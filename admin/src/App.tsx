import { useContext, useEffect, useState } from "react";
import "./App.css";
import axios from "./Service/api";
import Header from "./components/header";
import Form from "./components/form";
import { AnimatePresence } from "framer-motion";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Admin from "./page/admin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toastFail } from "./context/toast";
import { AppContext } from "./context/context";
import { toast } from "react-toastify";
import TopBarProgress from "react-topbar-progress-indicator";

function App() {
  const [admin, setAdmin] = useState(false);
  const [type, setType] = useState("login");
  const { isLoading } = useContext(AppContext);

  useEffect(() => {
    const handleLoading = () => {
      if (isLoading) {
        toast.info("Colocando produtos na estante...", {
          progress: undefined,
          autoClose: false,
          closeButton: false,
          toastId: "loadingToast",
          theme: "colored",
        });
      } else {
        toast.dismiss("loadingToast");
      }
    };

    handleLoading();
  }, [isLoading]);

  function LogedUser({ redirecionarPara }: { redirecionarPara: string }) {
    const isAutheticated = localStorage.getItem("token");

    return isAutheticated ? <Navigate to={redirecionarPara} /> : <Outlet />;
  }

  function ProtectRoutes({ redirecionarPara }: { redirecionarPara: string }) {
    let isAutheticated = localStorage.getItem("token");

    getInfoUser();

    return isAutheticated ? <Outlet /> : <Navigate to={redirecionarPara} />;
  }

  async function getInfoUser() {
    try {
      const {
        data: { user },
      } = await axios.get(`/admin/${await AsyncStorage.getItem("usuarioId")}`, {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      });
      return setAdmin(user);
    } catch (error: any) {
      if (error.response.status === 408) {
        await AsyncStorage.clear();
        toastFail("Sessão expirada, faca login novamente");
        return <Navigate to="/" />;
      }
    }
  }

  useEffect(() => {
    location.pathname === "/" || location.pathname === "/login"
      ? setType("login")
      : setType("register");
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-between w-full h-full">
      <>
        <Header admin={admin} setAdmin={setAdmin} />
        {isLoading && (
          <>
            <TopBarProgress />
            <div className="fixed top-0 left-0 z-50 w-full h-full bg-black opacity-50" />
          </>
        )}
        <div className="flex items-center justify-center h-full w-full overflow-auto">
          <AnimatePresence mode="wait">
            <Routes>
              <Route element={<LogedUser redirecionarPara="/home" />}>
                <Route
                  path="/"
                  element={
                    <Form type={type} setType={setType} setAdmin={setAdmin} />
                  }
                />
                <Route
                  path="/login"
                  element={
                    <Form type={type} setType={setType} setAdmin={setAdmin} />
                  }
                />
                <Route
                  path="/register"
                  element={
                    <Form type={type} setType={setType} setAdmin={setAdmin} />
                  }
                />
              </Route>
              <Route element={<ProtectRoutes redirecionarPara="/" />}>
                <Route path="/home" element={<Admin />} />
              </Route>
            </Routes>
          </AnimatePresence>
        </div>
      </>
    </div>
  );
}

export default App;
