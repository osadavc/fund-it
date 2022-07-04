import { Button } from "@chakra-ui/react";
import { FundRaiserI } from "models/FundRaiser";
import Link from "next/link";
import { FC } from "react";

interface FundRaiserCardProps {
  fundRaiser: FundRaiserI;
}

const FundRaiserCard: FC<FundRaiserCardProps> = ({ fundRaiser }) => {
  return (
    <div className="rounded-md border">
      <img
        src={fundRaiser.image}
        alt=""
        className="h-[300px] w-full rounded-t-md object-cover object-top"
      />

      <div className="py-3 px-4">
        <h1 className="text-xl font-semibold">{fundRaiser.title}</h1>
        <p className="text-base">
          {fundRaiser.description.slice(0, 500)}
          {fundRaiser.description.length > 500 && "..."}
        </p>

        <h4 className="mt-4 font-light">
          Goal Fulfillment :{" "}
          <span className="font-semibold">
            {(
              ((fundRaiser.XRPProgress ?? 0) / fundRaiser.XRPGoal) *
              100
            ).toFixed(2)}
            %
          </span>
        </h4>

        <Link href={`/fund-raisers/${fundRaiser._id}`} passHref>
          <Button className="mt-4">Donate</Button>
        </Link>
      </div>
    </div>
  );
};

export default FundRaiserCard;
