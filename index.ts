import { getDataBendDao } from "./adapters/benddao";
import { getDataJpegd } from "./adapters/jpegd";
import { getDataLlamalend } from "./adapters/llamalend";
import { getDataNftFi } from "./adapters/nftfi";
import { getDataX2y2 } from "./adapters/x2y2";

async function run() {
  const nft = "0x2c889A24AF0d0eC6337DB8fEB589fa6368491146";
  console.log("Bend DAO");
  console.log(await getDataBendDao(nft));
  console.log("JPEGd");
  console.log(await getDataJpegd(nft));
  console.log("LlamaLend");
  console.log(await getDataLlamalend(nft));
  console.log("NFTFi");
  console.log(await getDataNftFi(nft));
  console.log("X2Y2");
  console.log(await getDataX2y2(nft));
}

run();
