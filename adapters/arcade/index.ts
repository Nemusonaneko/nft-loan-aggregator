import * as dotenv from "dotenv";
import { SECONDS_IN_A_WEEK } from "../../utils/constants";
dotenv.config();

const url =
  "https://api-v2.arcade.xyz/api/v2/loanterms?kind=collection&collectionId";

export async function getDataArcade(nftContract: string) {
  const now = Math.floor(Date.now() / 1e3);
  const res = await fetch(`${url}=${nftContract.toLowerCase()}`, {
    headers: {
      "x-api-key": process.env.ARCADE_API_KEY,
    },
  }).then((res) => res.json());
  const results = [];
  res.forEach((item) => {
    const time = Math.floor(new Date(item.updatedAt).getTime() / 1e3);
    if (item.role === "lender" && Number(item.deadline) >= now) {
      results.push({
        token: item.payableCurrency,
        principal: item.principal,
        interest: item.interestRate,
        duration: item.durationSecs,
        deadline: item.deadline,
        installments: item.numInstallments,
        timestamp: time,
        url: `https://app.arcade.xyz/terms/collection/${nftContract.toLowerCase()}`,
      });
    }
  });

  return results;
}
