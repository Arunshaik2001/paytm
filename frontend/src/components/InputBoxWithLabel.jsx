import React from "react";

export default function InputBoxWithLabel({
  label,
  placeholder,
  type,
  onChange,
  showLabel,
  width,
}) {
  return (
    <>
      <div className="w-full flex flex-col">
        {showLabel ? <div>{label}</div> : null}
        <input
          className={
            "border border-solid border-gray-300 rounded-md p-2 " + `w-full`
          }
          type={type ?? "text"}
          placeholder={placeholder}
          onChange={onChange}
        />
      </div>
      <br />
    </>
  );
}
