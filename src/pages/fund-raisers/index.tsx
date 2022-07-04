import Navbar from "components/Home/Navbar";
import FundRaiser, { FundRaiserI } from "models/FundRaiser";
import { GetServerSideProps } from "next";
import dbConnect from "utils/dbConnect";
import { NextPage } from "next";
import FundRaiserCard from "components/FundRaisers/FundRaiserCard";

interface FundRaisersProps {
  fundRaisers: FundRaiserI[];
}

const FundRaisers: NextPage<FundRaisersProps> = ({ fundRaisers }) => {
  return (
    <div>
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 pt-16 md:px-2">
        <div className="flex-grow">
          <h3 className="text-2xl font-semibold">Fund Raisers</h3>
          <h4 className="text-base capitalize">
            See user created fund raisers, and donate them if you like.
          </h4>
        </div>

        <div className="my-8 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {fundRaisers.map((item) => (
            <FundRaiserCard key={item._id} fundRaiser={item} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default FundRaisers;

export const getServerSideProps: GetServerSideProps = async () => {
  await dbConnect();

  const fundRaisers = await FundRaiser.find();

  return {
    props: { fundRaisers: JSON.parse(JSON.stringify(fundRaisers)) },
  };
};
