import FundRaiser from "models/FundRaiser";
import { NextApiResponse } from "next";
import nc from "next-connect";

import { onError, onNoMatch, NextApiRequestWithUser } from "utils/apiUtils";
import dbConnect from "utils/dbConnect";
import xumm from "utils/xummUtils";

const handler = nc<NextApiRequestWithUser, NextApiResponse>({
  onError,
  onNoMatch,
})
  .patch(async (req, res) => {
    await dbConnect();

    const { id } = req.query;
    const { token, amount } = req.body;
    const fundRaiser = await FundRaiser.findOne({ id }).populate("beneficiary");

    const { uuid, ...payload } = (await xumm.payload.create(
      {
        TransactionType: "Payment",
        Destination: fundRaiser?.beneficiary.walletAddress,
        Amount: (amount * 1000000).toString(),
      },
      true
    ))!;

    fundRaiser?.funders.push({
      UUID: uuid,
      userKey: token,
      amount: amount,
    });
    await fundRaiser?.save();

    res.status(200).json(payload);
  })
  .post(async (req, res) => {
    await dbConnect();

    const { uuid, token } = req.body;
    const { id } = req.query;
    const fundRaisers = await FundRaiser.findOne({ id }).populate(
      "beneficiary"
    );

    const fundRaiser = fundRaisers?.funders.find(
      (funder) => funder.UUID === uuid && funder.userKey === token
    );

    if (fundRaiser) {
      const data = await xumm.payload.get(uuid!, true);

      fundRaisers!.funders = fundRaisers?.funders.map((funder) =>
        funder.UUID == uuid
          ? {
              ...funder,
              walletAddress: data?.response.signer!,
            }
          : funder
      )!;
      fundRaisers!.XRPProgress += fundRaiser.amount!;
      await fundRaisers?.save();

      return res.status(200).json({
        success: true,
        walletAddress: data?.response.signer,
        amount: fundRaiser.amount,
        XRPProgress: fundRaisers!.XRPProgress,
      });
    }

    throw new Error("Invalid UUID");
  });

export default handler;
