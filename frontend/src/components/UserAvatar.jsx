import React from "react";

export default function UserAvatar({ text }) {
  return (
    <>
      <div className="bg-gray-200 rounded-full p-2 w-10 h-10 flex justify-center items-center">
        {text ? text.substring(0, 2) : "A"}
      </div>
    </>
  );
}
