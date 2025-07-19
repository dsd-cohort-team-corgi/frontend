export default function objectIsEmptyCheck(object: object) {
  if (Object.keys(object).length === 0) {
    return true;
  }
  return false;
}
