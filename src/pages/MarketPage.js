import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import web3, { nftContract, marketContract } from "../utils/web3";

import MarketItem from "../components/MarketItem";
/**
 * 현재 팔고 있는 marketItem Rendering
 * Container Row Col
 * -> 카드
 *
 * 1. fetchActiveMarketItems 호출 --> state에 저장 ([])
 * 2. 해당 배열을 반복해서 MarketItem.js 컴포넌트를 만든 후 Rendering
 */

export default function MarketPage({ history, location, match }) {
  const [activeMarketItems, setActiveMarketItem] = React.useState([]);

  React.useEffect(() => {
    async function fetchItems() {
      const marketItems = await marketContract.methods
        .fetchActiveMarketItems()
        .call();
      console.log(marketItems);
      setActiveMarketItem(marketItems);
    }
    fetchItems();
  }, []);
  return (
    <Container>
      <Row className="my-4">
        <Col>
          <h2>Market Items</h2>
        </Col>
      </Row>
      <Row>
        {activeMarketItems.map((item) => {
          return (
            <Col xs={12} md={4}>
              <MarketItem {...item} />
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}
