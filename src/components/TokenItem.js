import React from "react";

import { Card, Button } from "react-bootstrap";
import web3, { nftContract } from "../utils/web3";
import { Ipfs, ipfsToHttps } from "../utils/ipfs";

export default function TokenItem({ tokenId, contractAddr }) {
  /**
   * 1. tokenURI 가져오고 state로 저장 (nftContract에 존재)
   *
   * 2. tokenURI로 https 요청. ==> name, description, imageURI
   * 3. 응답데이터를 tokenInfo에 저장.
   */
  const [tokenURI, setTokenURI] = React.useState("");
  const [tokenInfo, setTokenInfo] = React.useState({
    name: "",
    description: "",
    image: "",
  });

  React.useEffect(() => {
    async function getToken() {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      const contract = nftContract.clone();
      contract.options.address = contractAddr;

      const tokenURI = await contract.methods
        .tokenURI(tokenId)
        .call({ from: account });

      setTokenURI(tokenURI);
    }
    getToken();
  }, [tokenId, contractAddr]);

  React.useEffect(() => {
    if (tokenURI) {
      async function getTokenInfo() {
        const ipfs = new Ipfs(tokenURI);
        const metadata = await ipfs.fetchMetadata();
        setTokenInfo(metadata);
      }
      getTokenInfo();
    }
  }, [tokenURI]);

  /**
   * Sale 버튼 클릭시-->
   * 1. NFT Contract에 권한 확인 isApprovedForAll 호출
   * 1-1. true시 2번으로
   * 1-2. false시 setApprovalForAll 호출
   * 2. nftMarketContract에 createMarketItem 호출
   */

  return (
    <Card style={{ width: "18rem", marginTop: 30 }}>
      <Card.Img
        variant="top"
        src={ipfsToHttps(tokenInfo.image)}
        style={{
          height: "12rem",
          objectFit: "cover",
        }}
      />
      <Card.Body>
        <Card.Title>{tokenInfo.name}</Card.Title>
        <Card.Text>{tokenInfo.description}</Card.Text>
        <Button variant="primary">Sale</Button>
      </Card.Body>
    </Card>
  );
}
