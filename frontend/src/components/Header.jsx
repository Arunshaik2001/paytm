import React from "react";

export default function Header({ title, description }) {
  return (
    <div className="p-10 items-center flex flex-col ">
      <div className="text-2xl font-bold">{title}</div>
      <div>{description}</div>
    </div>
  );
}
