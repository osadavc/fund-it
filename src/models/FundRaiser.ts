import mongoose from "mongoose";
import { UserI } from "./User";

export interface FundRaiserI extends mongoose.Document {
  title: string;
  description: string;
  image: string;
  XRPGoal: number;
  funders: string[];
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
  funders: [String],
  beneficiary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

export default (mongoose.models.User as mongoose.Model<FundRaiserI>) ||
  mongoose.model<FundRaiserI>("FundRaiser", fundRaiserSchema);
