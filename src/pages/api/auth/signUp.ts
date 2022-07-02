import { NextApiResponse } from "next";
import nc from "next-connect";

import { onError, onNoMatch, NextApiRequestWithUser } from "utils/apiUtils";

const handler = nc<NextApiRequestWithUser, NextApiResponse>({
  onError,
  onNoMatch,
}).post((req, res) => {});

export default handler;
