import React from "react";

import { Card, Button } from "react-bootstrap";

export default function TokenItem({ tokenId }) {
  return (
    <Card style={{ width: "18rem" }}>
      <Card.Header>{tokenId}</Card.Header>
      <Card.Img variant="top" src="holder.js/100px180" />
      <Card.Body>
        <Card.Title>Card Title</Card.Title>
        <Card.Text>
          Some quick example text to build on the card title and make up the
          bulk of the card's content.
        </Card.Text>
        <Button variant="primary">Go somewhere</Button>
      </Card.Body>
    </Card>
  );
}
