import React from "react";

function BlinkingCursor() {
  return (
    <span className="inline-block w-0.5 h-6 bg-blue-400 animate-pulse ml-1 align-text-bottom" />
  );
}

type UserTextBubblesType = {
  finishedBubbles: string[];
  inProgressBubbles: string;
};

export default function UserTextBubbles({
  finishedBubbles,
  inProgressBubbles,
}: UserTextBubblesType) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col items-end w-full">
        {finishedBubbles.map((text, index) => (
          <div
            /* this list order will never change, and there a risk the text could be the same which would lead to two identical keys if index is not used */
            /* eslint-disable react/no-array-index-key */
            key={`bubbles-${index}-${text}`}
            className="rounded-2xl bg-gray-900 p-4 text-white mb-2"
          >
            {text}
          </div>
        ))}
      </div>
      {inProgressBubbles && (
        <div className="text-white text-center text-xl">
          {(() => {
            const words = inProgressBubbles.split(" ");
            if (words.length === 0) return null;

            const lastWord = words.pop();
            const otherWords = words.join(" ");

            return (
              <>
                {otherWords && (
                  <span className="text-white">{`${otherWords} `}</span>
                )}
                <span className="text-blue-200">{lastWord || ""}</span>
                <BlinkingCursor />
              </>
            );
          })()}
        </div>
      )}
    </div>
  );
}
