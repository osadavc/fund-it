import { Button } from "@chakra-ui/react";
import Link from "next/link";

const Navbar = () => {
  return (
    <div className="mx-auto flex max-w-7xl items-center justify-between py-5 px-4">
      <Link href="/" passHref>
        <h1 className="cursor-pointer select-none bg-gradient-to-r from-gray-700 via-gray-900 to-black bg-clip-text text-3xl font-bold text-transparent">
          Fund It
        </h1>
      </Link>
      <Button
        style={{
          fontWeight: 500,
        }}
      >
        Start A Fund Raiser
      </Button>
    </div>
  );
};

export default Navbar;
