import React from "react";

export default function BumiAiHeader() {
  return (
    <>
      <img
        src="/bumi.png"
        width={75}
        height={75}
        className="mr-4 rounded-full bg-primary"
      />
      <div>
        <h3 className="font-small"> Bumi </h3>
        <span className="block text-base font-light">
          {" "}
          Home maintenance assistant{" "}
        </span>
      </div>
    </>
  );
}
