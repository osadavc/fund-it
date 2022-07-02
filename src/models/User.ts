import mongoose from "mongoose";
import { FundRaiserI } from "./FundRaiser";

export interface UserI extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  walletAddress: string;
  fundRaisers: FundRaiserI[];
}

const userSchema = new mongoose.Schema<UserI>({
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
  password: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: () => new Date(),
  },
  walletAddress: {
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
