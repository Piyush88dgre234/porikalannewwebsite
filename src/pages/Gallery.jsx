import React from "react";
import institutePhoto from "../assets/images/institute-office.jpg";

export default function Gallery() {
  return (
    <div className="container">
      <h2>Gallery</h2>
      <img src={institutePhoto} alt="Institute" style={{ maxWidth: "100%", borderRadius: "10px" }} />
    </div>
  );
}
