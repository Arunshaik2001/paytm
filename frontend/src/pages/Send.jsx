import { useLocation, useParams } from "react-router-dom";
import UserAvatar from "../components/UserAvatar";
import InputBoxWithLabel from "../components/InputBoxWithLabel";
import Button from "../components/Button";
import { useRecoilValue } from "recoil";
import { tokenAtom } from "../store/atoms/tokenAtom";
import { userAtom } from "../store/atoms/userAtom";
import axios from "axios";
import { BASE_URL } from "../../config";
import { Toaster, toast } from "sonner";

export default function Send() {
  const { userId } = useParams();
  const tokenValue = useRecoilValue(tokenAtom);
  let amountEntered = 0;

  return (
    <div>
      <Toaster />
      <div className="bg-slate-300 h-screen flex flex-col justify-center items-center">
        <div className="flex flex-col items-center px-10 py-10 bg-white rounded-lg justify-between h-[45%] w-[20%]">
          <div className="font-bold text-lg">Send Money</div>
          <div className="flex flex-col justify-start">
            <div className="flex items-center">
              <UserAvatar text={"Arun"} />
              <div className="pl-5 text-lg font-bold">Arun</div>
            </div>
            <div>Amount in (Rs)</div>
            <div className="my-4">
              <InputBoxWithLabel
                showLabel={false}
                placeholder={"Enter amount"}
                type={"number"}
                onChange={(value) => {
                  amountEntered = parseFloat(value.target.value);
                }}
              />
            </div>
            <div className="pb-5 flex justify-center">
              <Button
                title={"Initiate Transfer"}
                onClick={async () => {
                  const res = await axios.post(
                    `${BASE_URL}/account/transfer`,
                    {
                      to: userId,
                      amount: amountEntered,
                    },
                    {
                      headers: {
                        Authorization: `Bearer ${tokenValue}`,
                      },
                    }
                  );
                  console.log(res);
                  if (res.status == 200) {
                    toast.success("Successfully Tranferred Rs" + amountEntered);
                  } else {
                    toast.warning("Failed to Transfer Rs" + amountEntered);
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
