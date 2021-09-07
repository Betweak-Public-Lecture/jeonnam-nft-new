import React from "react";
import { Card, Button } from "react-bootstrap";

import { ipfsToHttps, Ipfs } from "../utils/ipfs";
import web3, {
  nftContract as NFTContract,
  marketContract,
} from "../utils/web3";

export default function MarketItem({
  buyer,
  itemId,
  nftContract,
  price,
  seller,
  status,
  tokenId,
  ...rest
}) {
  const [account, setAccount] = React.useState("");
  React.useEffect(() => {
    web3.eth.getAccounts().then((accounts) => {
      if (accounts.length > 0) {
        setAccount(accounts[0]);
      }
    });
  }, []);

  const [tokenInfo, setTokenInfo] = React.useState({
    name: "",
    description: "",
    image: "",
  });
  // 1. nftContract와 tokenId로 tokenURI가져오기
  React.useEffect(() => {
    async function getTokenInfo() {
      // tokenURI
      const storeContract = NFTContract.clone();
      storeContract.options.address = nftContract;

      const cid = await storeContract.methods.tokenURI(tokenId).call();
      const ipfs = new Ipfs(cid);
      const tokenInfo = await ipfs.fetchMetadata();
      setTokenInfo(tokenInfo);
    }
    getTokenInfo();
  }, [nftContract, tokenId]);

  const buyItem = React.useCallback(
    async (e) => {
      e.preventDefault();
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];

      const priceWithFee = await marketContract.methods
        .itemPriceWithFee(itemId)
        .call();

      const receipt = await marketContract.methods
        .createMarketSale(itemId)
        .send({
          from: account,
          value: priceWithFee,
        });
      console.log(receipt);
    },
    [itemId]
  );
  const cancelItem = React.useCallback(
    async (e) => {
      e.preventDefault();
      const receipt = await marketContract.methods
        .cancelMarketItem(itemId)
        .send({
          from: account,
        });
      console.log(receipt);
      alert("취소되었습니다.");
    },
    [itemId, account]
  );

  return (
    <Card style={{ width: "18rem", marginTop: 30 }}>
      <Card.Header>
        {itemId}. {tokenInfo.name}
      </Card.Header>
      <Card.Img
        variant="top"
        src={ipfsToHttps(tokenInfo.image)}
        style={{
          height: "12rem",
          objectFit: "cover",
        }}
      />
      <Card.Body>
        <Card.Title>{web3.utils.fromWei(price, "ether")} ETHER</Card.Title>
        <Card.Text>{tokenInfo.description}</Card.Text>

        <Card.Text>seller: {account === seller ? "내 상품" : seller}</Card.Text>
        <Card.Text>CA: {nftContract}</Card.Text>

        <Button variant="primary" onClick={buyItem}>
          Buy
        </Button>

        {account === seller ? (
          // 취소버튼 클릭시 아이템 리스팅 취소 요청하도록 컨트랙트 호출.
          <Button
            variant="danger"
            style={{ float: "right" }}
            onClick={cancelItem}
          >
            취소
          </Button>
        ) : null}
      </Card.Body>
    </Card>
  );
}
