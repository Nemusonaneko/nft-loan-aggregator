import { gql, request } from "graphql-request";
import { SECONDS_IN_A_WEEK } from "../../utils/constants";
const api =
  "https://api.thegraph.com/subgraphs/name/nemusonaneko/nftfi-accepted-offers";

async function subgraphCall(nft: string) {
  const now = Math.floor(Date.now() / 1e3);
  const weekAgo = now - SECONDS_IN_A_WEEK;
  const query = gql`
    query {
      nfts(where: { id: "${nft.toLowerCase()}" }) {
        loans(where: {blockTimestamp_gte: "${weekAgo}", blockTimestamp_lte: "${now}"}) {
          adminFee
          blockNumber
          blockTimestamp
          borrower
          collateralId
          lender
          id
          loanDuration
          loanId
          loanInterestRate
          loanStart
          maxRepayment
          principal
          referralFee
          revenueShare
          revenueSharePartner
          token
          blockNumber
          blockTimestamp
          txHash
        }
      }
    }
  `;
  return (await request(api, query)).nfts;
}

export async function getDataNftFi(nft: string) {
  const subgraphcall = await subgraphCall(nft);
  if (subgraphcall.length === 0) return [];
  const loans = subgraphcall[0].loans;
  const results = [];
  for (let i = 0; i < loans.length; i++) {
    const loan = loans[i];
    results.push({
      token: loan.token,
      principal: loan.principal,
      maxRepayment: loan.maxRepayment,
      interestRate: loan.loanInterestRate,
      loanDuration: loan.loanDuration,
      timestamp: loan.blockTimestamp,
    });
  }
  return results;
}
