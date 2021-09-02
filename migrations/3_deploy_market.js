const Market = artifacts.require("NFTMarket");

module.exports = (deployer) => {
  deployer.deploy(Market);
};
