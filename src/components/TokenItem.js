import React from "react";

import { Card, Button } from "react-bootstrap";
import web3, { nftContract, marketContract } from "../utils/web3";
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

  const createSaleItem = React.useCallback(
    async (e) => {
      e.preventDefault();
      const storeContract = nftContract.clone();
      storeContract.options.address = contractAddr;
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const isApproved = await storeContract.methods
        .isApprovedForAll(account, marketContract.options.address)
        .call();

      if (!isApproved) {
        alert("marketContract에 먼저 권한을 부여해주셔야 합니다.");
        const receipt = await storeContract.methods
          .setApprovalForAll(marketContract.options.address, true)
          .send({
            from: account,
          });
        console.log(receipt);
      }

      const price = prompt("얼마에 파시겠습니까? (unit: ETHER)");
      // createMarketItem(address _nftContract, uint256 _tokenId, uint256 _price)
      const listingPrice = await marketContract.methods.listingPrice().call();
      const receipt = await marketContract.methods
        .createMarketItem(
          contractAddr,
          tokenId,
          web3.utils.toWei(price, "ether")
        )
        .send({
          from: account,
          value: listingPrice,
        });
      alert("market 등록 완료");
      console.log(receipt);
    },
    [contractAddr, tokenId]
  );

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
        {/*
          [Minting된 NFT 판매 등록]
          버튼을 클릭했을 때, 해당 계정(owner)에 대한 nft권한 체크 
          1. 해당 operator(marketContract)가 owner의 자산을 이동시킬 권한이 있는지. (isApprovedForAll)
            - true시 2번
            - false시 setApprovalForAll 호출
          2. 사용자로부터 얼마에 팔건지 가격을 입력받음. (prompt 함수 사용)
          2. nftMarketContract에 존재하는 createMarketItem 
         */}
        <Button variant="primary" onClick={createSaleItem}>
          Sale
        </Button>
      </Card.Body>
    </Card>
  );
}
