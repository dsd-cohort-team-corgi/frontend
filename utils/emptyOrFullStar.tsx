import EmptyStar from "../components/icons/EmptyStar";
import FullStar from "../components/icons/FullStar";

export default function emptyOrFullStar(index: number, numberOfStars: number) {
  if (index + 1 <= numberOfStars) {
    return <FullStar />;
  }
  return <EmptyStar />;
}
