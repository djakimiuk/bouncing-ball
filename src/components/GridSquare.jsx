import PropTypes from "prop-types";
function GridSquare(props) {
  const classes = `grid-square color-${props.color}`;
  return <div className={classes}></div>;
}

GridSquare.propTypes = {
  color: PropTypes.string.isRequired,
};
export default GridSquare;
