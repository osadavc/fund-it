import FundRaiser from "models/FundRaiser";
import User from "models/User";
import { NextApiResponse } from "next";
import nc from "next-connect";

import {
  auth,
  onError,
  onNoMatch,
  NextApiRequestWithUser,
} from "utils/apiUtils";
import dbConnect from "utils/dbConnect";

const handler = nc<NextApiRequestWithUser, NextApiResponse>({
  onError,
  onNoMatch,
})
  .use(auth)
  .post(async (req, res) => {
    const { title, beneficiaryName, xrpAmount, description, image } = req.body;

    if (!title || !beneficiaryName || !xrpAmount || !description || !image) {
      return res.status(400).json({
        error: "Missing required fields",
      });
    }
    await dbConnect();

    const beneficiary = await User.findOne({
      googleId: req.user.sub,
    });

    const fundRaiser = await FundRaiser.create({
      title,
      description,
      XRPGoal: xrpAmount,
      XRPProgress: 0,
      image,
      beneficiary: beneficiary?._id,
    });

    beneficiary?.fundRaisers!.push(fundRaiser._id.toString() as any);
    await beneficiary?.save();

    res.status(201).json(fundRaiser);
  });

export default handler;
