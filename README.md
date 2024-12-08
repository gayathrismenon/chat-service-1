# chat-service
This is a scalable, real-time chat application where users can register, login, send messages and receive notifications. It uses microservices for handling authentication, chatting, and notifications , with RabbitMQ for asynchronous communication. The system is deployed on Kubernetes for reliability and scalability.

## Microservices:
- User Profile Service: This service gives the profile information of each user.
- Notification Service : Notification Service will handle real-time notifications for our chat application. Notifications play a crucial role in keeping users informed about new messages, ensuring timely communication, and providing a seamless chatting experience
- Chat Service: The Chat Service enables real-time communication between users, fostering a dynamic and interactive user experience within our application.
- User Service: A fundamental component of our microservices architecture. The User Service is responsible for handling user registration, authentication, and the storage of user-related data in MongoDB

