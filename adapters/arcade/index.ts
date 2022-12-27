import * as dotenv from "dotenv";
import { SECONDS_IN_A_WEEK } from "../../utils/constants";
dotenv.config();

const url = "https://api-v2.arcade.xyz/api/v2/lend";

export async function getDataArcade(nftContract: string) {
  const now = Math.floor(Date.now() / 1e3);
  const weekAgo = now - SECONDS_IN_A_WEEK;
  const res = await fetch(url, {
    headers: {
      "x-api-key": process.env.ARCADE_API_KEY,
    },
  })
    .then((res) => res.json())
    .then((res) =>
      res.filter(
        (res) =>
          res.collateralAddress.toLowerCase() === nftContract.toLowerCase()
      )
    )
    .then((res) => res.map((res) => res.loanTerms));
  const results = [];
  res.forEach((items) => {
    items.forEach((item) => {
      const time = Math.floor(new Date(item.updatedAt).getTime() / 1e3);
      if (item.role === "lender" && time <= now && time >= weekAgo) {
        console.log(item);
        results.push({
          token: item.payableCurrency,
          principal: item.principal,
          interest: item.interestRate,
          duration: item.durationSecs,
          deadline: item.deadline,
          installments: item.numInstallments,
          timestamp: time,
        });
      }
    });
  });
  console.log(results)
  return results;
}
