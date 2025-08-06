import React from "react";

type UserTextBubblesType = {
  finishedBubbles: string[];
  inProgressBubbles: string;
};
export default function UserTextBubbles({
  finishedBubbles,
  inProgressBubbles,
}: UserTextBubblesType) {
  return (
    <div className="space-y-2">
      {finishedBubbles.map((text, index) => (
        <div
          /* this list order will never change, and there a risk the text could be the same which would lead to two identical keys if index is not used */
          /* eslint-disable react/no-array-index-key */
          key={`bubbles-${index}-${text}`}
          className="rounded-2xl bg-gray-900 p-3 text-sm font-extralight text-white shadow"
        >
          {text}
        </div>
      ))}
      {inProgressBubbles && (
        <div className="rounded bg-gray-200 p-2 text-sm italic text-gray-500 shadow">
          {inProgressBubbles}
        </div>
      )}
    </div>
  );
}
