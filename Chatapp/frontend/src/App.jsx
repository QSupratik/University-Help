import { Route, Routes, Navigate } from "react-router";
import HomePage from "./pages/HomePage.jsx"
import SignupPage from "./pages/SignupPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import NotificationsPage from "./pages/NotificationsPage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import CallPage from "./pages/CallPage.jsx"
import OnboardingPage from "./pages/OnboardingPage.jsx"
import {Toaster} from "react-hot-toast"
import { axiosInstance} from "./lib/axios.js";
import { useQuery } from "@tanstack/react-query";


const App = () => {
  const { data:authData, isLoading, error } = useQuery({
    queryKey:["authUser"],
    queryFn: async()=>{
      const res = await axiosInstance.get("/auth/me");
      return res.data;
    }
  })
  const authUser = authData?.user;

  return (
    <div className="h-screen" data-theme="forest">
      <Toaster/>
      <Routes>
        <Route path="/" element={ authUser ? <HomePage/> : <Navigate to="/login"/>}></Route>
        <Route path="/signup" element={!authUser ? <SignupPage/> : <Navigate to="/"/> }></Route>
        <Route path="/login" element={!authUser ? <LoginPage/> : <Navigate to="/"/>}></Route>
        <Route path="/notifications" element={authUser ? <NotificationsPage/> : <Navigate to="/login"/>}></Route>
        <Route path="/chat" element={ authUser ? <ChatPage/> : <Navigate to="/login"/>}></Route>
        <Route path="/call" element={authUser ? <CallPage/> : <Navigate to="/login"/>}></Route>
        <Route path="/onboarding" element={authUser ? <OnboardingPage/> : <Navigate to="/login"/>}></Route>
      </Routes>
    </div>
  );
}

export default App;