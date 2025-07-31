import { useState } from "react";
import Star from "./icons/Star";

function ReviewStar() {
  const [clickedStar, setClickedStar] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const starArr = new Array(5).fill(null);
  const handleMouseEnter = (idx: number) => {
    setHoveredStar(idx + 1);
  };
  const handleMouseLeave = () => {
    setHoveredStar(0)
  }
  const handleClick = (idx: number) {
    setClickedStar(idx + 1)
  }
  
  return (
    <div className="flex" onMouseLeave={handleMouseLeave}>
      {starArr.map((_, idx) => (
        <div
          key={idx}
          onMouseEnter={() => handleMouseEnter(idx)}
          onClick={() => handleClick(idx)}
        >
          <Star
            color={color ? "#ffd250" : "#e0e0e0"}
            fill={color ? "#ffd250" : "#e0e0e0"}
          />
        </div>
      ))}
    </div>
  );
}

export default ReviewStar;
