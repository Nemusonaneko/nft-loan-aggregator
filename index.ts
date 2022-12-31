import { getDataArcade } from "./adapters/arcade";
import { getDataBendDao } from "./adapters/benddao";
import { getDataJpegd } from "./adapters/jpegd";
import { getDataLlamalend } from "./adapters/llamalend";
import { getDataNftFi } from "./adapters/nftfi";
import { getDataX2y2 } from "./adapters/x2y2";

async function run() {
  const nft = "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d";
  // console.log("Bend DAO");
  // console.log(await getDataBendDao(nft));
  // console.log("JPEGd");
  // console.log(await getDataJpegd(nft));
  // console.log("LlamaLend");
  // console.log(await getDataLlamalend(nft));
  console.log("NFTFi");
  console.log(await getDataNftFi(nft));
  // console.log("X2Y2");
  // console.log(await getDataX2y2(nft));
  // console.log("Arcade");
  // console.log(await getDataArcade(nft));
}

run();
