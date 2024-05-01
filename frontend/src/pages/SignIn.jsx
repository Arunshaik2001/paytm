import Header from "../components/Header";
import InputBoxWithLabel from "../components/InputBoxWithLabel";
import Button from "../components/Button";
import LinkText from "../components/LinkText";
import { useSetRecoilState } from "recoil";
import { tokenAtom } from "../store/atoms/tokenAtom";
import { userAtom } from "../store/atoms/userAtom";
import axios from "axios";
import { BASE_URL } from "../../config";
import { useNavigate } from "react-router-dom";

export default function SignIn() {
  const setToken = useSetRecoilState(tokenAtom);
  const setCurrentUser = useSetRecoilState(userAtom);
  const navigate = useNavigate();
  const formData = {};
  return (
    <div className="flex justify-center bg-slate-300 rounded-md flex-col items-center px-10 h-screen">
      <div className="bg-white flex justify-center flex-col px-10 rounded-2xl items-center">
        <Header
          title={"SignIn"}
          description={"Enter Your Information to login"}
        />
        <InputBoxWithLabel
          label={"Email"}
          placeholder={"Enter email"}
          onChange={(value) => {
            formData.userName = value.target.value;
          }}
        />
        <InputBoxWithLabel
          label={"Password"}
          placeholder={"Enter Password"}
          type={"password"}
          onChange={(value) => {
            formData.password = value.target.value;
          }}
        />

        <Button
          title={"SignIn"}
          onClick={async () => {
            const res = await axios.post(`${BASE_URL}/user/signIn`, formData);
            console.log(res);
            if (res.data && res.data.token) {
              localStorage.setItem("token", res.data.token);
              localStorage.setItem("currentUser", res.data.currentUser);
              setToken(res.data.token);
              setCurrentUser(res.data.currentUser);
              navigate("/dashboard");
            }
          }}
        />
        <LinkText
          title={"Don't have an account?"}
          linkText={"SignUp"}
          navigateTo={"/signUp"}
        />
      </div>
    </div>
  );
}
