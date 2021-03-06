import Navbar from "components/Home/Navbar";
import User, { UserI } from "models/User";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import dbConnect from "utils/dbConnect";
import { NextPage } from "next";
import VerifyWallet from "components/Dashboard/VerifyWallet";
import { useEffect } from "react";
import { Button, Tooltip, useDisclosure } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import NewFundRaiserDrawer from "components/Dashboard/NewFundRaiserDrawer";
import useStore from "store";
import UserFundRaiser from "components/Home/UserFundRaiser";
import Link from "next/link";

interface DashboardProps {
  user: UserI;
}

const Dashboard: NextPage<DashboardProps> = ({ user: serverUser }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const user = useStore((state) => state.user);
  const replaceUser = useStore((state) => state.replaceUser);

  useEffect(() => {
    replaceUser(serverUser);
  }, [serverUser, replaceUser]);

  return (
    <div>
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 pt-16">
        {!user?.walletAddress ? (
          <VerifyWallet setUser={replaceUser} />
        ) : (
          <div>
            <div>
              <div className="flex items-center text-2xl">
                <div className="flex-grow">
                  <h3 className="font-semibold">Fund Raisers</h3>
                  <h4 className="text-base capitalize">
                    View and Manage all your fundraisers. View All Fund Raisers
                    Including yours on{" "}
                    <Link href="/fund-raisers">
                      <a className="text-blue-500">Fund Raisers Page</a>
                    </Link>
                  </h4>
                </div>

                <NewFundRaiserDrawer isOpen={isOpen} onClose={onClose} />

                <Tooltip label="Create New Project">
                  <Button onClick={onOpen}>
                    <AddIcon className="text-sm" />
                  </Button>
                </Tooltip>
              </div>
            </div>

            <div className="my-8 space-y-4">
              {user?.fundRaisers?.map((fundRaiser) => (
                <UserFundRaiser key={fundRaiser._id} fundRaiser={fundRaiser} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const session = await getSession(ctx);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  await dbConnect();

  const user = await User.findOne({
    googleId: session?.id,
  }).populate("fundRaisers");

  return {
    props: {
      session,
      user: JSON.parse(JSON.stringify(user)),
    },
  };
};

export default Dashboard;
