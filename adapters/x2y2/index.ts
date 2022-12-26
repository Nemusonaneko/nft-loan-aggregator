import { gql, request } from "graphql-request";
const api = "https://api.thegraph.com/subgraphs/name/nemusonaneko/x2y2-borrows";

async function subgraphCall(nft: string) {
  const query = gql`
    query {
        nfts(where: { id: "${nft.toLowerCase()}" }) {
            loans(orderBy: blockTimestamp, orderDirection: desc, first: 5) {
                adminShare
                blockNumber
                blockTimestamp
                borrowAmount
                borrower
                collateralId
                id
                lender
                loanDuration
                loanId
                loanStart
                repayAmount
                token
                txHash
            }
        }
    }
    `;
  return (await request(api, query)).nfts;
}

export async function getDataX2y2(nft: string) {
  const subgraphCallResult = await subgraphCall(nft);
  if (subgraphCallResult.length === 0 ) return [];
  const loans = subgraphCallResult[0].loans;
  const results = []
  for (let i = 0; i < loans.length; i++) {
    const loan = loans[i];
    results.push({
        token: loan.token,
        borrowAmount: loan.borrowAmount,
        repayAmount: loan.repayAmount,
        loanDuration: loan.loanDuration,
        timestamp: loan.blockTimestamp
    })
  }
  return results;
}
