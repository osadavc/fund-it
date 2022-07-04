import Navbar from "components/Home/Navbar";
import FundRaiser, { FundRaiserI } from "models/FundRaiser";
import { GetServerSideProps } from "next";
import dbConnect from "utils/dbConnect";
import { NextPage } from "next";
import { Button, Progress } from "@chakra-ui/react";

interface SingleFundRaiserPage {
  fundRaiser: FundRaiserI;
}

const SingleFundRaiserPage: NextPage<SingleFundRaiserPage> = ({
  fundRaiser,
}) => {
  return (
    <div>
      <Navbar />

      <div className="mx-auto flex max-w-7xl flex-col space-y-4 px-4 pt-16 md:flex-row md:space-y-0 md:space-x-4 md:px-2">
        <div className="flex-grow">
          <img
            src={fundRaiser.image}
            alt=""
            className="mb-8 h-[48rem] w-full object-cover object-top"
          />

          <h1 className="text-2xl font-bold">{fundRaiser.title}</h1>
          <p className="mt-1 text-sm">By {fundRaiser.beneficiary.name}</p>
          <p className="mt-4 text-xl">{fundRaiser.description}</p>
        </div>

        <div className="flex h-min max-w-[300px] flex-col rounded-md bg-zinc-50 py-5 px-4">
          <h4 className="text-center text-xl font-semibold">Donate Now</h4>

          <p className="mt-3 text-center text-sm">
            {fundRaiser.title} By {fundRaiser.beneficiary.name} is looking for
            donations to build up their project. Donate now.
          </p>

          <Button className="mt-5">Donate Via XRP</Button>

          <h4 className="mt-8 font-light">XRP Goal : {fundRaiser.XRPGoal}</h4>
          <h4 className="font-light">
            XRP Collected : {fundRaiser.XRPProgress ?? 0}
          </h4>
          <h4 className="mt-4 mb-1 text-xs font-semibold">Donation Progress</h4>
          <Progress
            value={parseInt(
              (
                ((fundRaiser.XRPProgress ?? 0) / fundRaiser.XRPGoal) *
                100
              ).toFixed(2)
            )}
          />

          <div>
            <h4 className="mt-4 mb-1 text-xs font-semibold">
              Previous Donations
            </h4>

            {fundRaiser.funders.length === 0 && (
              <p className="text-xs text-slate-600">
                No donations yet, be the first one
              </p>
            )}

            {fundRaiser.funders.map((funder) => (
              <p className="text-xs text-slate-600" key={funder._id}>
                {funder.walletAddress} donated {funder.amount} XRP
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  await dbConnect();

  if (typeof ctx.query.id != "string") {
    return {
      redirect: {
        permanent: false,
        destination: "/fund-raiser",
      },
    };
  }

  const fundRaiser = await FundRaiser.findOne({
    _id: ctx.query.id,
  }).populate("beneficiary");

  return {
    props: { fundRaiser: JSON.parse(JSON.stringify(fundRaiser)) },
  };
};

export default SingleFundRaiserPage;
