import { Response, Request } from "express";
import { AuthRequest } from "../middleware";
import { UserProfile } from "../database";
import { ApiError } from "../utils";

export const getProfile = async (req: any, res: Response) => {
  try {
    const userId = req.params.userId;
    const profile = await UserProfile.findById(userId);

    if (!profile) {
      throw new ApiError(404, "User profile not found");
    }

    res.json({
      status: 200,
      message: "Profile retrieved successfully!",
      data: profile
    });
  } catch (error: any) {
    res.json({
      status: error instanceof ApiError ? error.statusCode : 500,
      message: error.message
    });
  }
};

export const updateProfile = async (req: any, res: Response) => {
  try {
    const userId = req.params.userId;
    const updatedProfile = req.body;

    const profile = await UserProfile.findByIdAndUpdate(
      userId, 
      updatedProfile, 
      { new: true }
    );

    if (!profile) {
      throw new ApiError(404, "User profile not found");
    }

    res.json({
      status: 200,
      message: "Profile updated successfully!",
      data: profile
    });
  } catch (error: any) {
    res.json({
      status: error instanceof ApiError ? error.statusCode : 500,
      message: error.message
    });
  }
};

export const changePassword = async (req: any, res: Response) => {
  try {
    const userId = req.params.userId;
    const { currentPassword, newPassword } = req.body;

    const user = await UserProfile.findById(userId);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    // Add password verification logic
    const isPasswordValid = user.password === currentPassword;

    if (!isPasswordValid) {
      throw new ApiError(401, "Current password is incorrect");
    }

    user.password = newPassword;
    await user.save();

    res.json({
      status: 200,
      message: "Password updated successfully!"
    });
  } catch (error: any) {
    res.json({
      status: error instanceof ApiError ? error.statusCode : 500,
      message: error.message
    });
  }
};

export const deleteAccount = async (req: any, res: Response) => {
  try {
    const userId = req.params.userId;

    const deletedProfile = await UserProfile.findByIdAndDelete(userId);

    if (!deletedProfile) {
      throw new ApiError(404, "User profile not found");
    }

    res.json({
      status: 200,
      message: "Account deleted successfully!"
    });
  } catch (error: any) {
    res.json({
      status: error instanceof ApiError ? error.statusCode : 500,
      message: error.message
    });
  }
};

// export default {
//   getProfile,
//   updateProfile,
//   changePassword,
//   deleteAccount
// };