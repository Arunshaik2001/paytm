import Header from "../components/Header";
import InputBoxWithLabel from "../components/InputBoxWithLabel";
import Button from "../components/Button";
import LinkText from "../components/LinkText";
import axios from "axios";
import { BASE_URL } from "../../config";
import { tokenAtom } from "../store/atoms/tokenAtom";
import { userAtom } from "../store/atoms/userAtom";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from "recoil";

export default function SignUp() {
  const navigate = useNavigate();
  const setToken = useSetRecoilState(tokenAtom);
  const setCurrentUser = useSetRecoilState(userAtom);
  const formData = {};

  return (
    <div className="flex justify-center bg-slate-300 rounded-md flex-col items-center px-10 h-screen">
      <div className="bg-white flex justify-center flex-col px-10 rounded-2xl items-center">
        <Header
          title={"SignUp"}
          description={"Enter Your Information to create an account"}
        />
        <InputBoxWithLabel
          label={"First Name"}
          placeholder={"Enter First Name"}
          onChange={(value) => {
            formData.firstName = value.target.value;
          }}
        />
        <InputBoxWithLabel
          label={"Last Name"}
          placeholder={"Enter Last Name"}
          onChange={(value) => {
            formData.lastName = value.target.value;
          }}
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
          title={"SignUp"}
          className="me-2 mb-2 my-10"
          onClick={async () => {
            const res = await axios.post(`${BASE_URL}/user/signUp`, formData);
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
          title={"Already have an account?"}
          linkText={"LogIn"}
          navigateTo={"/signIn"}
          replace={true}
        />
      </div>
    </div>
  );
}
