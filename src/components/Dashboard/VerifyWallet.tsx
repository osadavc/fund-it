import { Button, useToast } from "@chakra-ui/react";
import axios from "axios";
import { useState } from "react";
import { XummPostPayloadResponse } from "xumm-sdk/dist/src/types";
import { FC } from "react";
import { UserI } from "models/User";

interface VerifyWalletProps {
  setUser: (user: UserI | null) => void;
}

const VerifyWallet: FC<VerifyWalletProps> = ({ setUser }) => {
  const [isLoading, setLoading] = useState(false);
  const [xummResponse, setXummResponse] =
    useState<XummPostPayloadResponse | null>();

  const toast = useToast();

  const handleVerify = async () => {
    setLoading(true);
    const { data: response } = await axios.get<XummPostPayloadResponse | null>(
      "/api/xumm/verify"
    );
    setXummResponse(response);
    setLoading(false);

    const ws = new WebSocket(response?.refs.websocket_status!);
    ws.addEventListener("message", async ({ data }) => {
      const json = JSON.parse(data);

      if (json.payload_uuidv4) {
        try {
          const { data: response } = await axios.post("/api/xumm/verify", {
            uuid: json.payload_uuidv4,
          });

          if (response.success) {
            setUser(response);

            toast({
              status: "success",
              title: "Success",
              description: "Your wallet has been successfully verified",
            });
          }
        } catch (error) {
          console.log(error);

          toast({
            status: "error",
            title: "Error",
            description: "Your wallet could not be verified",
          });
        } finally {
          ws.close();
        }
      }
    });
  };

  return (
    <div className="mx-auto mt-10 rounded-md bg-zinc-50 py-10 px-2 text-center md:w-[70%]">
      <h2 className="text-xl font-bold">Your XRP Wallet Is Not Verified</h2>
      <p className="mt-1">
        Please verify your XRP wallet to create a fund-raiser
      </p>

      {xummResponse ? (
        <div className="mt-5 flex flex-col items-center justify-center">
          <img src={xummResponse.refs.qr_png} alt="" />
          <p className="mt-2">
            Please scan this with your XUMM app or click the below button to
            open in your XUMM app
          </p>
          <Button
            className="mt-2"
            onClick={() => {
              window.open(xummResponse.next.always);
            }}
          >
            Open In Xumm
          </Button>
        </div>
      ) : (
        <Button
          className="mt-6"
          isLoading={isLoading}
          loadingText="Loading"
          onClick={handleVerify}
        >
          Verify Wallet
        </Button>
      )}
    </div>
  );
};

export default VerifyWallet;
