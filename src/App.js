import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom"; // Client Side Routing

import HomePage from "./pages/HomePage";
import MarketPage from "./pages/MarketPage";
import MyTokenPage from "./pages/MyTokenPage";
import MintingPage from "./pages/MintingPage";

import MyNavbar from "./components/MyNavbar";

import web3 from "./utils/web3";

function App() {
  const [ethAccount, setEthAccount] = React.useState("");

  const requestAccount = React.useCallback(() => {
    web3.eth.requestAccounts().then((accounts) => {
      if (accounts && accounts.length >= 1) {
        setEthAccount(accounts[0]);
      }
    });
  }, []);

  React.useEffect(() => {
    // 수시로 getAccounts
    const timer = setInterval(() => {
      web3.eth.getAccounts().then((accounts) => {
        if (accounts && accounts.length >= 1) {
          setEthAccount(accounts[0]);
        } else {
          setEthAccount("");
        }
      });
    }, 1000);

    return timer;
  }, []);

  return (
    <Router>
      <MyNavbar requestAccount={requestAccount} ethAccount={ethAccount} />

      <Switch>
        <Route
          path={["/", "/home"]}
          exact
          component={(props) => <HomePage {...props} />}
        />

        <Route
          path="/market"
          exact
          component={(props) => <MarketPage {...props} />}
        />
        <Route
          path="/mytoken"
          exact
          component={(props) => <MyTokenPage {...props} />}
        />
        <Route
          path="/minting"
          exact
          component={(props) => <MintingPage {...props} />}
        />
      </Switch>
    </Router>
  );
}

export default App;
