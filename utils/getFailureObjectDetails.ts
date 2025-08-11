// typescript isn't sure about details, because it doesn't exist on a normal object, but it does on the one we get back from the server
/* eslint-disable @typescript-eslint/no-explicit-any */
export default function failureObjectLogi(mutation: any) {
  const mainPart = (mutation?.failureReason as any)?.detail;
  if (Array.isArray(mainPart)) {
    let newString: string[] = [];
    mainPart.map((item) => newString.push(item.msg)).join("");
    return newString;
  } else {
    return mainPart;
  }
}
