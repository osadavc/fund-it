import type { GetServerSideProps, NextPage } from "next";
import Navbar from "components/Home/Navbar";
import IntroSection from "components/Home/IntroSection";
import { getSession } from "next-auth/react";

const Home: NextPage = () => {
  return (
    <div className="relative">
      <Navbar />
      <IntroSection />
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  return {
    props: {
      session: await getSession(ctx),
    },
  };
};

export default Home;
