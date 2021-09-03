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

  // key: index(0부터 1씩증가시킴.) // value: 실제 tokenId
  mapping(uint256 => uint256) indexToTokenId;
  uint256 mappingCount;


  
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
    
    indexToTokenId[mappingCount] = tokenId;
    mappingCount++;

    emit TokenCreated(tokenId, _tokenURI, msg.sender);
    return tokenId;
  }

  function fetchOwnedToken(address _owner) external view returns(uint256[] memory){
    uint256 balance = balanceOf(_owner);
    
    // return 할 배열
    uint256[] memory allTokens = new uint256[](balance); 

    uint256 idxCount = 0;

    for (uint256 i=0; i<mappingCount; i++){
      uint256 tokenId = indexToTokenId[i]; // tokenId
      address owner = ownerOf(tokenId); // 해당 token의 owner
      if (owner == _owner){
        allTokens[idxCount] = tokenId;
        idxCount++;
      }
    }
    return allTokens;
  }

  function _stringToUint(string memory _str) pure internal returns (uint256){
    return uint256(bytes32(abi.encodePacked(_str)));
  }
}
