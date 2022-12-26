import { ethers } from "ethers";

export const ethRpc = "https://eth-rpc.gateway.pokt.network";
export const ethprovider = new ethers.providers.JsonRpcProvider(ethRpc);

export const SECONDS_IN_A_YEAR = 365 * 24 * 60 * 60
export const SECONDS_IN_A_DAY = 24 * 60 * 60