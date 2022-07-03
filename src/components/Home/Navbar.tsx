import { Button } from "@chakra-ui/react";
import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react";
import { useRouter } from "next/router";

const Navbar = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const isDashboard = router.pathname === "/dashboard";

  const handleClick = () => {
    if (session) {
      return router.push("/dashboard");
    }

    signIn("google", {
      callbackUrl: "/dashboard",
    });
  };

  return (
    <div className="mx-auto flex max-w-7xl items-center justify-between py-5 px-4 md:max-w-none md:px-10">
      <Link href="/" passHref>
        <h1 className="cursor-pointer select-none bg-gradient-to-r from-gray-700 via-gray-900 to-black bg-clip-text text-3xl font-bold text-transparent">
          Fund It
        </h1>
      </Link>

      {isDashboard ? (
        <Button
          style={{
            fontWeight: 500,
          }}
          onClick={() => {
            signOut({
              callbackUrl: "/",
            });
          }}
        >
          Log Out
        </Button>
      ) : (
        <Button
          style={{
            fontWeight: 500,
          }}
          onClick={handleClick}
        >
          Start A Fund Raiser
        </Button>
      )}
    </div>
  );
};

export default Navbar;
