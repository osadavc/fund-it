import { NextApiRequest, NextApiResponse } from "next";
import { getToken, JWT } from "next-auth/jwt";

export interface NextApiRequestWithUser extends NextApiRequest {
  user: JWT;
}

export const onError = (
  err: any,
  req: NextApiRequest,
  res: NextApiResponse
) => {
  console.log(err);
  res.status(500).json({ statusCode: 500, message: err.message });
};

export const onNoMatch = (req: NextApiRequest, res: NextApiResponse) => {
  res.status(404).json({ statusCode: 404, message: "Not Found" });
};

export const auth = async (
  req: NextApiRequestWithUser,
  res: NextApiResponse,
  next: Function
) => {
  const token = await getToken({ req });

  if (!token) {
    return res.status(401).json({
      statusCode: 401,
      message: "Unauthorized",
    });
  }

  req.user = token;
  next();
};
