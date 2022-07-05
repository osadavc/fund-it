import Navbar from "components/Home/Navbar";
import FundRaiser, { FundRaiserI } from "models/FundRaiser";
import { GetServerSideProps } from "next";
import dbConnect from "utils/dbConnect";
import { NextPage } from "next";
import {
  Button,
  Input,
  InputGroup,
  InputLeftAddon,
  Progress,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { XummPostPayloadResponse } from "xumm-sdk/dist/src/types";
import axios from "axios";

interface SingleFundRaiserPage {
  fundRaiser: FundRaiserI;
}

const SingleFundRaiserPage: NextPage<SingleFundRaiserPage> = ({
  fundRaiser: serverFundRaiser,
}) => {
  const [xummResponse, setXummResponse] =
    useState<XummPostPayloadResponse | null>();
  const [isLoading, setLoading] = useState(false);
  const [amount, setAmount] = useState(0);
  const [fundRaiser, setFundRaiser] = useState<FundRaiserI | null>(null);
  const toast = useToast();

  useEffect(() => {
    setFundRaiser(serverFundRaiser);
  }, [serverFundRaiser]);

  const handleDonation = async () => {
    setLoading(true);
    const { data: response } =
      await axios.patch<XummPostPayloadResponse | null>(
        `/api/fund-raiser/${fundRaiser?._id}`,
        {
          token: localStorage.getItem("token"),
          amount,
        }
      );
    setXummResponse(response);

    const ws = new WebSocket(response?.refs.websocket_status!);
    ws.addEventListener("message", async ({ data }) => {
      const json = JSON.parse(data);

      if (json.payload_uuidv4) {
        try {
          const { data: response } = await axios.post(
            `/api/fund-raiser/${fundRaiser?._id}`,
            {
              uuid: json.payload_uuidv4,
              token: localStorage.getItem("token"),
            }
          );

          // @ts-ignore
          setFundRaiser((prev) => ({
            ...prev,
            XRPProgress: response.XRPProgress,
            funders: [
              // @ts-ignore
              ...prev!.funders,
              {
                amount: response.amount,
                walletAddress: response.walletAddress,
              },
            ],
          }));

          if (response.success) {
            toast({
              status: "success",
              title: "Success",
              description: "Donation successful, Thank you for donating",
            });
            setXummResponse(null);
          }
        } catch (error) {
          console.log(error);

          toast({
            status: "error",
            title: "Error",
            description: "Your donation was not successful",
          });
        } finally {
          ws.close();
          setLoading(false);
        }
      }
    });
  };

  return (
    <div>
      <Navbar />

      <div className="mx-auto flex max-w-7xl flex-col space-y-10 px-4 pt-16 md:flex-row md:space-y-0 md:space-x-4 md:px-2">
        <div className="flex-grow">
          <img
            src={fundRaiser?.image}
            alt=""
            className="mb-8 h-[48rem] w-full object-cover object-left-top"
          />

          <h1 className="text-2xl font-bold">{fundRaiser?.title}</h1>
          <p className="mt-1 text-sm">By {fundRaiser?.beneficiary.name}</p>
          {fundRaiser?.description.split("\n").map((item, id) => (
            <p className="mt-4 text-xl" key={id}>
              {item}
            </p>
          ))}
        </div>

        <div className="flex h-min min-w-[300px] flex-col rounded-md bg-slate-50 py-5 px-4 md:max-w-[300px]">
          <h4 className="text-center text-xl font-semibold">Donate Now</h4>

          <p className="mt-3 text-center text-sm">
            {fundRaiser?.title} By {fundRaiser?.beneficiary.name} is looking for
            donations to build up their project. Donate now.
          </p>

          {xummResponse ? (
            <div className="text-center">
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
            <div className="mt-1">
              <div>
                <h4 className="mt-4 mb-1 text-xs font-semibold">XRP Amount</h4>
                <InputGroup size="md">
                  <InputLeftAddon>XRP</InputLeftAddon>
                  <Input
                    placeholder="Expected XRP Amount"
                    type="number"
                    value={amount}
                    onChange={(e) => {
                      setAmount(parseInt(e.target.value));
                    }}
                  />
                </InputGroup>
              </div>
              <Button
                className="mt-2"
                isLoading={isLoading}
                loadingText="Loading"
                onClick={handleDonation}
              >
                Donate Via XRP
              </Button>
            </div>
          )}

          <h4 className="mt-8 font-light">XRP Goal : {fundRaiser?.XRPGoal}</h4>
          <h4 className="font-light">
            XRP Collected : {fundRaiser?.XRPProgress ?? 0}
          </h4>
          <h4 className="mt-4 mb-1 text-xs font-semibold">Donation Progress</h4>

          <Progress
            value={parseInt(
              (
                ((fundRaiser?.XRPProgress ?? 0) / fundRaiser?.XRPGoal!) *
                100
              ).toFixed(2)
            )}
          />

          <div>
            <h4 className="mt-4 mb-1 text-xs font-semibold">
              Previous Donations
            </h4>

            {fundRaiser?.funders.length === 0 && (
              <p className="text-xs text-slate-600">
                No donations yet, be the first one
              </p>
            )}

            <div className="space-y-2">
              {fundRaiser?.funders.map((funder) => {
                if (funder.amount && funder.walletAddress) {
                  return (
                    <p className="text-xs text-slate-600" key={funder._id}>
                      {funder.walletAddress} donated {funder.amount} XRP
                    </p>
                  );
                } else {
                  return null;
                }
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  await dbConnect();

  if (typeof ctx.query.id != "string") {
    return {
      redirect: {
        permanent: false,
        destination: "/fund-raiser",
      },
    };
  }

  const fundRaiser = await FundRaiser.findOne({
    _id: ctx.query.id,
  }).populate("beneficiary");

  if (!fundRaiser) {
    return {
      notFound: true,
    };
  }

  return {
    props: { fundRaiser: JSON.parse(JSON.stringify(fundRaiser)) },
  };
};

export default SingleFundRaiserPage;
