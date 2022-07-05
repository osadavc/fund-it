import { FundRaiserI } from "models/FundRaiser";
import { FC } from "react";
import { Progress } from "@chakra-ui/react";
import Link from "next/link";

interface UserFundRaiser {
  fundRaiser: FundRaiserI;
}

const UserFundRaiser: FC<UserFundRaiser> = ({ fundRaiser }) => {
  return (
    <Link href={`/fund-raisers/${fundRaiser._id}`} passHref>
      <div className="flex w-full cursor-pointer rounded-md border">
        <img
          src={fundRaiser.image}
          alt=""
          className="w-1/3 rounded-l-md object-cover md:w-72"
        />

        <div className="flex flex-grow flex-col justify-between py-5 px-8">
          <div>
            <h2 className="text-2xl font-semibold">{fundRaiser.title}</h2>
            <p className="mt-1 text-sm">
              {fundRaiser.description.slice(0, 500)}
              {fundRaiser.description.length > 500 && "..."}
            </p>

            <h4 className="mt-4 font-light">XRP Goal : {fundRaiser.XRPGoal}</h4>
            <h4 className="font-light">
              XRP Collected : {fundRaiser.XRPProgress ?? 0}
            </h4>
          </div>

          <div className="mt-2">
            <h3 className="mb-2 text-xs">Progress: </h3>
            <Progress
              value={parseInt(
                (
                  ((fundRaiser.XRPProgress ?? 0) / fundRaiser.XRPGoal) *
                  100
                ).toFixed(2)
              )}
            />
          </div>
        </div>
      </div>
    </Link>
  );
};

export default UserFundRaiser;
