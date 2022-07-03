import { Button } from "@chakra-ui/react";

import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/router";

const IntroSection = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleClick = () => {
    if (session) {
      return router.push("/dashboard");
    }

    signIn("google", {
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className="mx-auto flex max-w-7xl flex-col items-center px-8 pt-24">
      <h1 className="bg-gradient-to-r from-gray-700 via-gray-900 to-black bg-clip-text text-center text-4xl font-bold text-transparent md:text-6xl">
        Fund Your Favorite Project And Help Them To Take Off
      </h1>

      <p className="mx-auto mt-5 w-[70%] text-center">
        Support and fund your favorite projects with XRP and help them to make
        their project the new reality. No fees, no hidden costs.
      </p>

      <div className="mt-8 flex flex-col space-x-3 md:flex-row">
        <Button
          style={{
            fontWeight: 500,
          }}
          onClick={() => {
            router.push("/fund-raisers");
          }}
        >
          Donate Now
        </Button>
        <Button
          variant="outline"
          style={{
            fontWeight: 500,
          }}
          onClick={handleClick}
        >
          Start A Fund Raiser
        </Button>
      </div>
    </div>
  );
};

export default IntroSection;
