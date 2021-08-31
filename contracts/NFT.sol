// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract NFT is ERC721URIStorage {
  event TokenCreated(
    uint256 tokenId,
    string tokenURI,
    address owner
  );

  constructor() ERC721("ART NFT", "ANT") {
  }
  
  /**
   0. _tokenURI => tokenID 만들기
   1. mint
   2. setTokenURI
   3. return tokenID
   */
  function createToken(string memory _tokenURI) public returns (uint256){
    uint256 tokenId = _stringToUint(_tokenURI);
    _mint(msg.sender, tokenId);
    _setTokenURI(tokenId, _tokenURI);
    
    emit TokenCreated(tokenId, _tokenURI, msg.sender);
    return tokenId;
  }

  function _stringToUint(string memory _str) pure internal returns (uint256){
    return uint256(bytes32(abi.encodePacked(_str)));
  }
}
