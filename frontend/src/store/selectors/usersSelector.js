import { selector } from "recoil";
import { userSearchInputAtom } from "../atoms/userSearchInputAtom";
import axios from "axios";
import { BASE_URL } from "../../../config";
import { tokenAtom } from "../atoms/tokenAtom";
export const usersSelector = selector({
  key: "usersSelector",
  get: async ({ get }) => {
    const inputValue = get(userSearchInputAtom);
    const token = get(tokenAtom);

    const res = await axios.get(`${BASE_URL}user/bulk?filter=${inputValue}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    try {
      return res.data;
    } catch (error) {
      console.error("Error fetching users:", error);
      return [];
    }
  },
});
