import { ethers } from "ethers";
import { getAddress } from "ethers/lib/utils";
import { gql, request } from "graphql-request";
import poolAbi from "./abi";
import { ethprovider } from "../../utils/constants";
import BigNumber from "bignumber.js";
const subgraphApi = "https://api.thegraph.com/subgraphs/name/0xngmi/llamalend";
const quoteServerApi = "https://oracle.llamalend.com/quote";

async function subgraphCall(nftContract: string) {
  const query = gql`
    query {
      pools(
        where: { nftContract: "${nftContract.toLowerCase()}" }
      ) {
        name
        id
        ltv
        maxLoanLength
      }
    }
  `;
  return (await request(subgraphApi, query)).pools;
}

export async function getDataLlamalend(nftContract: string) {
  const subgraphQueryPools = await subgraphCall(nftContract);
  if (subgraphQueryPools.length === 0) return [];
  const quote = (
    await fetch(`${quoteServerApi}/1/${getAddress(nftContract)}`).then((res) =>
      res.json()
    )
  ).price;
  const pools = [];
  for (let i = 0; i < subgraphQueryPools.length; i++) {
    const pool = subgraphQueryPools[i];
    const poolContract = new ethers.Contract(
      getAddress(pool.id),
      poolAbi,
      ethprovider
    );
    const [maxPrice, { maxInstantBorrow, dailyBorrows, maxDailyBorrowsLimit }] =
      await Promise.all([
        poolContract.maxPrice(),
        poolContract.getDailyBorrows(),
      ]);
    const oneLoan = new BigNumber(quote).times(pool.ltv).div(1e18).toFixed(0);
    const maxPriceReached = Number(quote) > Number(maxPrice);
    const rateLimitReached =
      Number(dailyBorrows) + Number(oneLoan) > Number(maxDailyBorrowsLimit);
    const notEnoughETH = Number(oneLoan) > Number(maxInstantBorrow);
    if (maxPriceReached || rateLimitReached || notEnoughETH) continue;
    const annualInterest = await poolContract.currentAnnualInterest(
      BigNumber(quote).times(pool.ltv).div(1e18).toFixed(0)
    );
    pools.push({
      name: pool.name,
      oneLoan: oneLoan,
      ltv: pool.ltv.toString(),
      maxLoanLength: pool.maxLoanLength.toString(),
      annualInterest: annualInterest.toString(),
    });
  }
  return pools;
}
