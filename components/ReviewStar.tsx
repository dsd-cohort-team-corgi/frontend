import { useState } from "react";
import Star from "./icons/Star";

interface ReviewStarProps {
  clickedStar: number;
  setClickedStar: React.Dispatch<React.SetStateAction<number>>;
}

function ReviewStar({ clickedStar, setClickedStar }: ReviewStarProps) {
  const [hoveredStar, setHoveredStar] = useState(0);
  const starArr = new Array(5).fill(null);
  const handleMouseEnter = (idx: number) => {
    setHoveredStar(idx + 1);
  };
  const handleMouseLeave = () => {
    setHoveredStar(0);
  };
  const handleClick = (idx: number) => {
    setClickedStar(idx + 1);
  };

  return (
    <div className="flex" onMouseLeave={handleMouseLeave}>
      {starArr.map((_, idx) => {
        const isFilled =
          (hoveredStar !== 0 && idx + 1 <= hoveredStar) ||
          (hoveredStar === 0 && idx + 1 <= clickedStar);

        const starColor = isFilled ? "#ffd250" : "#e0e0e0";

        return (
          <div
            key={idx}
            onMouseEnter={() => handleMouseEnter(idx)}
            onClick={() => handleClick(idx)}
            style={{ cursor: "pointer" }}
          >
            <Star color={starColor} fill={starColor} />
          </div>
        );
      })}
    </div>
  );
}

export default ReviewStar;
