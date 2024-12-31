import mongoose, { Schema, Model } from 'mongoose';
import { User } from '@shared';

// Create interface for the model that extends the base User interface
interface IUserModel extends Omit<User, 'id'>, Document {
  password: string; // Make password required in the model
}

const userSchema = new Schema<IUserModel>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false, // Don't include password in queries by default
    },
    cityId: {
      type: Schema.Types.String,
      ref: 'City',
      required: true,
    },
    friends: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    profile: {
      avatar: String,
      bio: String,
    },
    lastLoginAt: Date,
  },
  {
    timestamps: true, // Automatically handle createdAt and updatedAt
  }
);

// Create and export the model
export const UserModel = mongoose.model<IUserModel>('User', userSchema);
