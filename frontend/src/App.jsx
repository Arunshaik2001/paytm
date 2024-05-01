import { Route, Routes, Navigate } from "react-router-dom";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Dashboard from "./pages/Dashboard";
import Send from "./pages/Send";

import { BrowserRouter } from "react-router-dom";
import { RecoilRoot, useRecoilValue } from "recoil";
import { tokenAtom } from "./store/atoms/tokenAtom";

function App() {
  return (
    <>
      <RecoilRoot>
        <Routing />
      </RecoilRoot>
    </>
  );
}

function Routing() {
  const token = useRecoilValue(tokenAtom);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<SignUp />}></Route>
          <Route path="/signin" element={<SignIn />}></Route>
          <Route path="/dashboard" element={<Dashboard />}></Route>
          <Route path="/send/:userId" element={<Send />}></Route>
          <Route
            path="/"
            element={<Navigate to={token ? "/dashboard" : "/signup"} />}
          />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
