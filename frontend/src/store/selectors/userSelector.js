import { selector } from "recoil";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { tokenAtom } from "../atoms/tokenAtom";
import { userAtom } from "../atoms/userAtom";
export const userSelector = selector({
  key: "userSelector",
  get: async ({ get }) => {
    const userId = get(userAtom);
    const token = get(tokenAtom);
    console.log(token);

    const res = await axios.get(
      `${BASE_URL}user/userDetail/${userId}`,

      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    try {
      return res.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  },
});
