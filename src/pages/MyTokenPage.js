import React from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

import web3, { nftContract } from "../utils/web3";
import TokenItem from "../components/TokenItem";

// 실습
/**
 * 1. fetchOwnedToken을 호출하여 현재 로그인된 계정이 소유한 tokenId들을 state에 저장 (useEffect)
 * 2. Card 컴포넌트들을 components/TokenItem.js로 분리하여 생성
 *
 * 3. TokenItem 컴포넌트는 props로 tokenId를 받도록.
 */

export default function MyTokenPage({ history, location, match }) {
  const [myTokens, setMyTokens] = React.useState([]);
  React.useEffect(() => {
    // web3.eth.getAccounts().then((accounts) => {
    //   const account = accounts[0];
    //   nftContract.methods
    //     .fetchOwnedToken(account)
    //     .call()
    //     .then((tokenIds) => {
    //       console.log(tokenIds);
    //       setMyTokens(tokenIds);
    //     });
    // });
    async function fetchTokens() {
      const accounts = await web3.eth.getAccounts();
      const account = accounts[0];
      const myTokens = await nftContract.methods
        .fetchOwnedToken(account)
        .call();
      setMyTokens(myTokens);
    }
    fetchTokens();
  }, []);

  return (
    <Container>
      <Row className="my-5">
        <Col xs={12}>
          <h2>My Tokens</h2>
        </Col>
      </Row>
      <Row>
        {myTokens.map((tokenId) => {
          return (
            <Col xs={12} md={4}>
              <TokenItem tokenId={tokenId} />
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
