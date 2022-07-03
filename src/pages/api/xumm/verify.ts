import User from "models/User";
import { NextApiResponse } from "next";
import nc from "next-connect";

import {
  onError,
  onNoMatch,
  NextApiRequestWithUser,
  auth,
} from "utils/apiUtils";
import dbConnect from "utils/dbConnect";
import xumm from "utils/xummUtils";

const handler = nc<NextApiRequestWithUser, NextApiResponse>({
  onError,
  onNoMatch,
})
  .use(auth)
  .get(async (req, res) => {
    dbConnect();
    const { uuid, ...payload } = (await xumm.payload.create(
      {
        TransactionType: "SignIn",
      },
      true
    ))!;

    const user = await User.findOne({ googleId: req.user.sub });
    user!.xummUUID = uuid;
    await user?.save();

    res.status(200).json(payload);
  })
  .post(async (req, res) => {
    const { uuid } = req.body;
    dbConnect();

    const user = await User.findOne({ googleId: req.user.sub });

    if (user?.xummUUID === uuid) {
      const data = await xumm.payload.get(user?.xummUUID!, true);
      user!.walletAddress = data?.response.signer!;
      await user?.save();

      return res
        .status(200)
        .json({ success: true, walletAddress: data?.response.signer });
    }

    throw new Error("Invalid UUID");
  });

export default handler;
