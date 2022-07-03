import Navbar from "components/Home/Navbar";
import User, { UserI } from "models/User";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import dbConnect from "utils/dbConnect";
import { NextPage } from "next";
import VerifyWallet from "components/Dashboard/VerifyWallet";
import { useEffect, useState } from "react";
import { Button, Tooltip, useDisclosure } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import NewProjectDrawer from "components/Dashboard/NewProjectDrawer";

interface DashboardProps {
  user: UserI;
}

const Dashboard: NextPage<DashboardProps> = ({ user: serverUser }) => {
  const [user, setUser] = useState<UserI>(serverUser);
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    setUser(serverUser);
  }, [serverUser]);

  return (
    <div>
      <Navbar />

      <div className="mx-auto max-w-7xl px-4 pt-16">
        {!user.walletAddress ? (
          <VerifyWallet setUser={setUser} />
        ) : (
          <div>
            <div className="flex items-center text-2xl">
              <div className="flex-grow">
                <h3 className="font-semibold">Fund Raisers</h3>
                <h4 className="text-base capitalize">
                  View and Manage all your fundraisers
                </h4>
              </div>

              <NewProjectDrawer isOpen={isOpen} onClose={onClose} />

              <Tooltip label="Create New Project">
                <Button onClick={onOpen}>
                  <AddIcon className="text-sm" />
                </Button>
              </Tooltip>
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

  dbConnect();

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
