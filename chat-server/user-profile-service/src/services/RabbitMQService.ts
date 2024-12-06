import amqp, { Channel, Connection } from "amqplib";
import config from "../config/config";
import { UserProfile } from "../database";
import { ApiError } from "../utils";

class RabbitMQService {
    private requestQueue = "USER_PROFILE_REQUEST";
    private responseQueue = "USER_PROFILE_RESPONSE";
    private connection!: Connection;
    private channel!: Channel;

    constructor() {
        this.init();
    }

    async init() {
        this.connection = await amqp.connect(config.msgBrokerURL!);
        this.channel = await this.connection.createChannel();

        await this.channel.assertQueue(this.requestQueue);
        await this.channel.assertQueue(this.responseQueue);

        this.listenForRequests();
    }

    private async listenForRequests() {
        this.channel.consume(this.requestQueue, async (msg) => {
            if (msg && msg.content) {
                const { userId } = JSON.parse(msg.content.toString());
                const userProfile = await this.getUserProfile(userId);

                this.channel.sendToQueue(
                    this.responseQueue,
                    Buffer.from(JSON.stringify(userProfile)),
                    { correlationId: msg.properties.correlationId }
                );

                this.channel.ack(msg);
            }
        });
    }

    private async getUserProfile(userId: string) {
        const userProfile = await UserProfile.findOne({ userId });
        if (!userProfile) {
            throw new ApiError(404, "User profile not found");
        }
        return userProfile;
    }
}

export const rabbitMQService = new RabbitMQService();