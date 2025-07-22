function convertTimeToAm(t: string): string {
  const [time, modifier] = t.split(" ");
  const [h, minutes] = time.split(":").map(Number);
  let hours = h;
  // solving eslint error: minutes is const but hours is not const, so we use let with hours to keep eslint happy

  if (modifier === "PM" && hours !== 12) hours += 12;
  if (modifier === "AM" && hours === 12) hours = 0;

  return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}
