import React from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";

export default function User({ user }) {
  const navigate = useNavigate();
  return (
    <div className="flex flex-row items-center justify-between w-full my-5">
      <div className="flex items-center">
        <div className="bg-gray-200 rounded-full p-2 w-10 h-10 flex justify-center items-center">
          {`${user.firstName.substring(0, 2)}`}
        </div>
        <div className="pl-5 text-lg font-bold">{`${user.firstName} ${user.lastName}`}</div>
      </div>
      <div className="flex items-center">
        <Button
          title={"Send Money"}
          onClick={() => {
            navigate(`/send/${user._id}`);
          }}
        />
      </div>
    </div>
  );
}
