import "../Styles/compare.css"
import PropTypes from "prop-types";
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

ComparisonCard.propTypes = {
  icon: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
};

export default ComparisonCard;