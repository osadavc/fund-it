import Navbar from "components/Home/Navbar";
import { GetServerSideProps } from "next";
import { getSession } from "next-auth/react";

const Dashboard = () => {
  return (
    <div>
      <Navbar />
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

  return {
    props: {
      session,
    },
  };
};

export default Dashboard;
