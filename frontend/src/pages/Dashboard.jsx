import InputBoxWithLabel from "../components/InputBoxWithLabel";
import UserAvatar from "../components/UserAvatar";
import User from "../components/User";
import {
  useRecoilState,
  useRecoilStateLoadable,
  useRecoilValueLoadable,
  useSetRecoilState,
} from "recoil";
import { userSearchInputAtom } from "../store/atoms/userSearchInputAtom";
import { usersSelector } from "../store/selectors/usersSelector";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { userSelector } from "../store/selectors/userSelector";
import { userBalanceSelector } from "../store/selectors/balanceSelector";
import { tokenAtom } from "../store/atoms/tokenAtom";
import { userAtom } from "../store/atoms/userAtom";

let timer;
function debounce(fn, timeout) {
  clearTimeout(timer);
  timer = setTimeout(fn, timeout);
}

export default function Dashboard() {
  const setInputState = useSetRecoilState(userSearchInputAtom);
  const setToken = useSetRecoilState(tokenAtom);
  const setCurrentUser = useSetRecoilState(userAtom);
  const users = useRecoilValueLoadable(usersSelector);
  const user = useRecoilValueLoadable(userSelector);
  const userBalance = useRecoilValueLoadable(userBalanceSelector);

  const navigate = useNavigate();

  return (
    <div className="w-screen">
      <div className="flex justify-between border-b border-gray-300 p-10 items-center">
        <div className="text-2xl font-bold">Payments App</div>
        <div className="flex items-center">
          <div>
            Hello, {user.state == "hasValue" ? user.contents.firstName : ""}
          </div>
          <div className="w-5"></div>
          {user.state == "hasValue" ? (
            <UserAvatar text={user.contents.firstName} />
          ) : null}

          <div className="w-5"></div>
          <Button
            title={"LogOut"}
            onClick={() => {
              localStorage.clear();
              setToken("");
              setCurrentUser("");
              navigate("/", {
                replace: true,
              });
            }}
          />
        </div>
      </div>
      <div className="flex justify-between py-5 px-10 items-center">
        <div className="text-2xl font-bold">
          Your Balance Rs
          {userBalance.state == "hasValue" ? userBalance.contents.balance : "0"}
        </div>
      </div>
      <div className="flex py-5 px-10 flex-col items-start">
        <div className="text-2xl font-bold">Users</div>
        <br />
        <InputBoxWithLabel
          showLabel={false}
          width={50}
          placeholder={"Search..."}
          onChange={(value) => {
            const input = value.target.value;
            debounce(() => {
              setInputState(input);
            }, 500);
          }}
        />

        {users.state == "hasValue" ? (
          users.contents.users.map((user) => (
            <User key={user._id} user={user} />
          ))
        ) : (
          <div>Loading....</div>
        )}
      </div>
    </div>
  );
}
