import { xummAPIKey, xummAPISecret } from "config";
import { XummSdk } from "xumm-sdk";

const xumm = new XummSdk(xummAPIKey, xummAPISecret);

export default xumm;
