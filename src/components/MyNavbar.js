import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Navbar, Nav, Container } from "react-bootstrap";

import web3, { marketContract } from "../utils/web3";

export default function MyNavbar({ ethAccount, requestAccount }) {
  const [ownerContract, setOwnerContract] = React.useState("0x00");
  useEffect(() => {
    marketContract.methods
      .owner()
      .call()
      .then((owner) => {
        setOwnerContract(owner);
      });
  }, []);

  const ownerWithdraw = React.useCallback(
    async (e) => {
      e.preventDefault();
      const amount = prompt("출금할 금액 입력 (ether)");
      if (!amount) {
        return;
      }
      const receipt = marketContract.methods
        .withdraw(web3.utils.toWei(amount, "ether"))
        .send({
          from: ethAccount,
        });
      console.log(receipt);
    },
    [ethAccount]
  );

  return (
    <Navbar collapseOnSelect expand="md" bg="dark" variant="dark">
      <Container>
        <Navbar.Brand as={Link} to="/home">
          NFT-Market
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />

        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/market">
              Market
            </Nav.Link>
          </Nav>
          <Nav>
            <Nav.Link as={Link} to="/mytoken">
              My Token
            </Nav.Link>
            <Nav.Link as={Link} to="/minting">
              Mint
            </Nav.Link>
            {ethAccount ? (
              <React.Fragment>
                <Nav.Link>
                  <small>{ethAccount}</small>
                </Nav.Link>
                {ethAccount === ownerContract ? (
                  <Nav.Link onClick={ownerWithdraw}>출금</Nav.Link>
                ) : null}
              </React.Fragment>
            ) : (
              <Nav.Link
                onClick={(e) => {
                  e.preventDefault();
                  requestAccount();
                }}
              >
                Login
              </Nav.Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
