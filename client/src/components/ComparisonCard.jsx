import React from "react";
import "../Styles/compare.css"

const ComparisonCard = ({ icon, title, description }) => {
  return (
    <div className="comparison-type-card">
      <div className="card-icon">
        <i className={icon}></i>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      <button className="compare-btn">Compare Now</button>
    </div>
  );
};

export default ComparisonCard;