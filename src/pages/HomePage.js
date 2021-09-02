import React from "react";

export default function HomePage({ history, location, match }) {
  return (
    <div>
      <div>HomePage</div>
      <button
        onClick={(e) => {
          e.preventDefault();
          history.push("/market");
        }}
      >
        MarketPage이동
      </button>
    </div>
  );
}
