import mongoose from "mongoose";
import { FundRaiserI } from "./FundRaiser";

export interface UserI extends mongoose.Document {
  googleId: number;
  name: string;
  email: string;
  createdAt: Date;
  walletAddress: string;
  xummUUID: string;
  fundRaisers: FundRaiserI[];
}

const userSchema = new mongoose.Schema<UserI>({
  googleId: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    maxlength: 50,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  walletAddress: {
    type: String,
  },
  xummUUID: {
    type: String,
  },
  fundRaisers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FundRaiser",
    },
  ],
});

export default (mongoose.models.User as mongoose.Model<UserI>) ||
  mongoose.model<UserI>("User", userSchema);
