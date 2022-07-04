import mongoose from "mongoose";
import { UserI } from "./User";

export interface FundRaiserI {
  _id?: string;
  title: string;
  description: string;
  image: string;
  XRPGoal: number;
  XRPProgress: number;
  funders: {
    walletAddress: string;
    amount: number;
  }[];
  beneficiary: UserI;
}

const fundRaiserSchema = new mongoose.Schema<FundRaiserI>({
  title: {
    type: String,
    required: true,
    maxlength: 50,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  XRPGoal: {
    type: Number,
    required: true,
    min: 0,
  },
  XRPProgress: {
    type: Number,
    required: true,
    min: 0,
  },
  funders: [
    {
      walletAddress: {
        type: String,
        required: true,
      },
      amount: {
        type: Number,
        required: true,
      },
    },
  ],
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default (mongoose.models.FundRaiser as mongoose.Model<FundRaiserI>) ||
  mongoose.model<FundRaiserI>("FundRaiser", fundRaiserSchema);
