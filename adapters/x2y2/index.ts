import * as dotenv from "dotenv";
dotenv.config();

export async function getDataX2y2(nft: string) {
  const now = Math.floor(Date.now() / 1e3);
  const res = await fetch(
    `https://loan-api.x2y2.org/v1/offer/list?nftAddress=${nft.toLowerCase()}&tokenId=0`,
    {
      headers: {
        "x-api-key": process.env.X2Y2_API_KEY,
      },
    }
  )
    .then((res) => res.json())
    .then((res) => res.data.list);
  const result = [];
  res.forEach((res) => {
    if (res.expireTime >= now) {
      result.push({
        amount: res.amount,
        repayment: res.repayment,
        apr: res.apr,
        expires: res.expireTime,
        adminFee: res.adminFee,
        duration: res.duration,
        token: res.erc20Address,
      });
    }
  });
  return result;
}
