import { Route, Routes, Navigate } from "react-router";
import HomePage from "./pages/HomePage.jsx"
import SignupPage from "./pages/SignupPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import NotificationsPage from "./pages/NotificationsPage.jsx"
import ChatPage from "./pages/ChatPage.jsx"
import CallPage from "./pages/CallPage.jsx"
import OnboardingPage from "./pages/OnboardingPage.jsx"
import { Toaster } from "react-hot-toast"
import { axiosInstance } from "./lib/axios.js";
import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "./lib/api.js";
import useAuthUser from "./hooks/useAuthUser.js";
import Layout from "./components/Layout.jsx"


const App = () => {
  const { isLoading, authUser } = useAuthUser();

  const isAuthenticated = Boolean(authUser);
  const isOnboarded = authUser?.isOnboarded;

  return (
    <div className="h-screen" data-theme="forest">
      <Toaster />
      <Routes>

        <Route path="/" element={isAuthenticated && isOnboarded ? (
          <Layout showSidebar={true}>
            <HomePage />
          </Layout>
        ) : (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />)
        }
        />

        <Route path="/signup" element={
          !isAuthenticated ? <SignupPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />
        }
        />
        <Route path="/login" element={
          !isAuthenticated ? <LoginPage /> : <Navigate to={isOnboarded ? "/" : "/onboarding"} />}>
        </Route>
        <Route
          path="/notifications"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={true}>
                <NotificationsPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/chat/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <Layout showSidebar={false}>
                <ChatPage />
              </Layout>
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />
        <Route
          path="/call/:id"
          element={
            isAuthenticated && isOnboarded ? (
              <CallPage />
            ) : (
              <Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />
            )
          }
        />

        <Route path="/onboarding" element={
          isAuthenticated ? (!isOnboarded ? (<OnboardingPage />) : (<Navigate to="/" />)) :
            (<Navigate to="/login" />)}
        />
      </Routes>
    </div>
  );
}

export default App;