import { Star } from "lucide-react";
import FullStar from "../components/icons/FullStar";

export default function emptyOrFullStar(index: number, numberOfStars: number) {
  const EmptyStar = <Star color="#FFD166" size={20} />;

  if (index + 1 <= numberOfStars) {
    return <FullStar />;
  }
  return EmptyStar;
}
