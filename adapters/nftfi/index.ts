import * as dotenv from "dotenv";
dotenv.config();

export async function getDataNftFi(nft: string) {
  const now = Math.floor(Date.now() / 1e3);
  const res = await fetch(
    `https://sdk-api.nftfi.com/offers?nftAddress=${nft.toLowerCase()}&contractName=v2.loan.fixed.collection`,
    {
      headers: {
        "x-api-key": process.env.NFTFI_API_KEY,
      },
    }
  )
    .then((res) => res.json())
    .then((res) => res.results);
  const result = [];
  res.forEach((e) => {
    if (e.terms.loan.expiry >= now) {
      result.push({
        token: e.terms.loan.currency,
        principal: e.terms.loan.principal,
        repayment: e.terms.loan.repayment,
        duration: e.terms.loan.duration,
        expiry: e.terms.loan.expiry,
        interest: e.terms.loan.interest.bps,
        url: `https://app.nftfi.com/collection/${nft.toLowerCase()}`,
      });
    }
  });
  return result;
}
