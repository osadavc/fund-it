import Navbar from "components/Home/Navbar";
import User, { UserI } from "models/User";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";
import dbConnect from "utils/dbConnect";
import { NextPage } from "next";
import VerifyWallet from "components/Dashboard/VerifyWallet";
import { useEffect, useState } from "react";

interface DashboardProps {
  user: UserI;
}

const Dashboard: NextPage<DashboardProps> = ({ user: serverUser }) => {
  const [user, setUser] = useState<UserI>(serverUser);

  useEffect(() => {
    setUser(serverUser);
  }, [serverUser]);

  return (
    <div className="mx-auto max-w-7xl px-4">
      <Navbar />

      {!user.walletAddress && <VerifyWallet setUser={setUser} />}
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
