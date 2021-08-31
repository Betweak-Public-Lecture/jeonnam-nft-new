// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract NFTMarket is Ownable {
  // 1. listingPrice 변수 설정 및 등록
  uint256 private _listingPrice = 0.001 ether; // 리스팅 수수료 (고정 수수료)
  uint256 private _marketFee = 5; // 거래 수수료 % (판매 수수료)

  uint256 private _itemIds; // item의 id (Counting 역할)
  uint256 private _itemSoldcount;

  event MarketItemChanged(
    uint256 itemId,
    address nftContract,
    uint256 tokenId,
    uint256 price,
    address seller,
    address buyer,
    uint8 status
  );


  // MarketItem 구조체 (item1개 - 거래내역 기록)
  struct MarketItem{
    uint256 itemId;       // Market에서 관리할 id
    uint256 tokenId;      // contract에서의 id
    uint256 price;        // 가격
    address nftContract;  // 해당 contract 주소(ERC721을 따름)
    address seller;       // 판매자
    address buyer;        // 구매자
    uint8 status;         // 상태 (0: 취소, 1: 거래중, 2: 거래 완료)
  }

  MarketItem[] private _marketItems;
  
  // 아이템 중복등록 방지 mutex
  mapping(address => mapping(uint256 => bool)) private _alreadyMarketItem; 

  function setListingPrice(uint256 price) external onlyOwner {
    _listingPrice = price;
  }
  function listingPrice() external view returns (uint256){
    return _listingPrice;
  }

  function setMarketFee(uint256 _fee) external onlyOwner{
    _marketFee = _fee;
  }
  function marketFee() external view returns(uint256) {
    return _marketFee;
  }

  // 2. withdraw 함수 구현
  function withdraw(uint256 _amount) external onlyOwner {
    require(address(this).balance >= _amount, "balance is less than requested amount");
    address payable owner = payable(owner());
    owner.transfer(_amount);
  }

  /**
    3. 마켓아이템 생성
     createMarketItem(address _nftContract, uint256 _tokenId, uint256 _price) 함수 정의
     - 외부 접근 가능
     - listingPrice만큼 지금
     - _price는 0보다 커야 함.
     - itemId, status등 marketItem 구조체 내용 채워주셔야 함
     - 배열에 추가.
     - 실제 해당 Contract에 토큰이 존재하는지 확인.
  */
  function createMarketItem(address _nftContract, uint256 _tokenId, uint256 _price) external payable{
    require(_listingPrice == msg.value);
    // 이중 등록 방지 (이미 등록: true, 등록 x: false)
    require(!_alreadyMarketItem[_nftContract][_tokenId], "This token is already located on market.");
    
    require(_price > 0);

    //실제 해당 Contract에 토큰 존재 확인. + owner 체크
    IERC721 nftContract = IERC721(_nftContract);

    address nftOwner = nftContract.ownerOf(_tokenId);
    require(nftOwner == msg.sender); // 실제 주인이 호출한 것이 맞는지 확인
    // 해당 NFT를 Handling할 권한을 부여 받았는지
    require(nftContract.isApprovedForAll(msg.sender, address(this)), "doesn't have Permission"); 

    // 이중등록 방지
    _alreadyMarketItem[_nftContract][_tokenId] = true;


    _marketItems.push(MarketItem(_itemIds, _tokenId, _price, _nftContract, msg.sender, address(0), 1));
    _itemIds++;


    emit MarketItemChanged(_itemIds-1, _nftContract, _tokenId, _price, msg.sender, address(0), 1);
  }


  // 4. 거래 체결
  /**
    createMarketSale(uint256 _itemId)
    - 외부에서 접근 가능
    - 이더리움을 token 가격 + token가격의 수수료(_marketFee) 이상 전달받아야 함.
    - token의 가격은 원 주인에게 전달.
    - (token의 가격+ 수수료 이상)의 금액을 전달받으면 구매자에게 돌려주어야 함.
    - 실제 NFT의 Contract를 발생시켜야 함.
    - itemSoldCount 증가
   */
  function createMarketSale(uint256 _itemId) external payable {
    // 이더리움을 token가격 + 수수료 이상 전달받아야 함
    uint256 priceWithFee = itemPriceWithFee(_itemId);
    require(priceWithFee <= msg.value);
    MarketItem storage targetItem = _marketItems[_itemId];

    // 거래 가능한지 확인
    require(targetItem.status==1, "This Token is not available"); 

    // 거스름돈 계산
    uint256 cashback = msg.value - priceWithFee;

    // 실제 로직
    IERC721 nftContract = IERC721(targetItem.nftContract);
    require(targetItem.seller == nftContract.ownerOf(targetItem.tokenId), "This Token is not available");

    // 해당 NFT Contract의 TX 발생
    nftContract.transferFrom(targetItem.seller, msg.sender, targetItem.tokenId);
    
    // MarketItem 상태 변화
    _alreadyMarketItem[targetItem.nftContract][targetItem.tokenId] = false;
    targetItem.buyer = msg.sender;
    targetItem.status = 2;
    _itemSoldcount++;

    // 판매대금 및 거스름돈 전달.
    payable(targetItem.seller).transfer(targetItem.price);
    payable(msg.sender).transfer(cashback);

    
/**

  event MarketItemChanged(
    uint256 itemId,
    address nftContract,
    uint256 tokenId,
    uint256 price,
    address seller,
    address buyer,
    uint8 status
  ); */
    emit MarketItemChanged(
      targetItem.itemId,
      targetItem.nftContract,
      targetItem.tokenId,
      targetItem.price,
      targetItem.seller,
      targetItem.buyer,
      targetItem.status
    );
  }

  // 5. 아이템 취소

  // 6. 아이템 리스트 가져오기(필터별로) external view


  function itemPriceWithFee(uint256 _itemId) public view returns(uint256){
    MarketItem memory marketItem = _marketItems[_itemId];
    uint256 fee = marketItem.price * _marketFee / 100;
    return fee + marketItem.price;
  }




}
