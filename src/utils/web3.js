import Web3 from "web3";
import nftArtifact from "../artifacts/NFT.json";
import marketArtifact from "../artifacts/NFTMarket.json";

const web3 = new Web3(Web3.givenProvider || "ws://127.0.0.1:9999");

const nftContract = new web3.eth.Contract(
  nftArtifact.abi,
  nftArtifact.networks["5777"].address
);

const marketContract = new web3.eth.Contract(
  marketArtifact.abi,
  marketArtifact.networks["5777"].address
);

export default web3;
export { nftContract, marketContract };
