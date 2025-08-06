import React from "react";

type UserTextBubblesType = {
  bubbles: string[];
  inProgressBattles: string;
};
export default function UserTextBubbles({
  bubbles,
  inProgressBattles,
}: UserTextBubblesType) {
  return (
    <div className="space-y-2">
      {bubbles.map((text, index) => (
        <div
          key={`bubbles-${index}-${text}`}
          className="rounded-2xl bg-gray-900 p-3 text-sm font-extralight text-white shadow"
        >
          {text}
        </div>
      ))}
      {inProgressBattles && (
        <div className="rounded bg-gray-200 p-2 text-sm italic text-gray-500 shadow">
          {inProgressBattles}
        </div>
      )}
    </div>
  );
}
