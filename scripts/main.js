const { abi } = require("../artifacts/contracts/TaxNFT.sol/TaxNFT.json");
// const { ethers } = require("ethers");

async function main() {
  const provider = new ethers.providers.JsonRpcProvider();
  const taxNFT = new ethers.Contract("0x5FbDB2315678afecb367f032d93F642f64180aa3", abi, provider);
  console.log(await taxNFT.name());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });