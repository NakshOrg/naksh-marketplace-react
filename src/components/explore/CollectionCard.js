import React from "react";

import nearLogo from "../../assets/svgs/near-logo.svg";
import polygonLogo from "../../assets/svgs/polygon-logo.svg";
import classes from "./explore.module.css";
import globalStyles from "../../globalStyles";

export function CollectionCard({
  image,
  title,
  artistName,
  artistImg,
  onClick,
  className
}) {
  return (
    <div
      style={{ zIndex: 2 }}
      onClick={onClick}
      className={className + " " + classes.cardContainer2 + " cursor-pointer w-full h-[258px] flex flex-col justify-center items-center space-y-4 bg-brand-gray rounded-xl"}
    >
      <img
        src={image}
        alt="nft"
        className="object-cover rounded-full w-[131px] h-[131px]"
      />
      <div className="w-full flex flex-col justify-center items-center space-y-2">
        <h1
          style={{
            fontFamily: "Athelas-Bold",
          }}
          className="text-3xl"
        >
          {title}
        </h1>
        <div className="w-full flex justify-center items-center space-x-3">
          {artistImg && <img src={artistImg} className="object-cover w-5 h-5 rounded-full" alt="" />}
          <p className="text-sm">{artistName}</p>
        </div>
      </div>
    </div>
  );
}
