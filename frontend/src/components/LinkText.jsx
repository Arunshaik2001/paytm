import React from "react";
import { Link } from "react-router-dom";

export default function LinkText({ title, linkText, navigateTo }) {
  return (
    <>
      <div className="flex mb-5">
        <div className="mr-2">{title}</div>
        <Link className="underline" to={navigateTo} replace={true}>
          {linkText}
        </Link>
      </div>
    </>
  );
}
