import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage.jsx"
import SignupPage from "./pages/SignupPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import NotificationsPage from "./pages/NotificationsPage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import CallPage from "./pages/CallPage.jsx"
import OnboardingPage from "./pages/OnboardingPage.jsx"
import {Toaster} from "react-hot-toast"
import { axiosInstance} from "./lib/axios.js";

const { data:authData, isLoading, error } = useQuery({
  queryKey:["authUser"],
  queryFn: async()=>{
    const res = await axiosInstance.get("/auth/me");
    return res.data;
  }
})

const authUser = authData?.user;

const App = () => {
  return (
    <div className="h-screen" data-theme="forest">
      <Toaster/>
      <Routes>
        <Route path="/" element={<HomePage/>}></Route>
        <Route path="/signup" element={<SignupPage/>}></Route>
        <Route path="/login" element={<LoginPage/>}></Route>
        <Route path="/notifications" element={<NotificationsPage/>}></Route>
        <Route path="/chat" element={<ChatPage/>}></Route>
        <Route path="/call" element={<CallPage/>}></Route>
        <Route path="/onboarding" element={<OnboardingPage/>}></Route>
      </Routes>
    </div>
  );
}

export default App;