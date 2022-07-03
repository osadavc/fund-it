import { Button } from "@chakra-ui/react";

const Navbar = () => {
  return (
    <div className="mx-auto flex max-w-7xl items-center justify-between py-5 px-4">
      <h1 className="bg-gradient-to-r from-gray-700 via-gray-900 to-black bg-clip-text text-3xl font-bold text-transparent">
        Fund It
      </h1>
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
