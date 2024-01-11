import { useEffect, useState } from "react";
import "./App.css";
import axios from "./Service/api";
import { PulseLoader } from "react-spinners";
import Header from "./components/header";
import Form from "./components/form";
import { AnimatePresence } from "framer-motion";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import Admin from "./page/admin";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { toastFail } from "./context/toast";

function App() {
  const [init, setInit] = useState(false);
  const [admin, setAdmin] = useState(false);
  const [type, setType] = useState("login");

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
      console.log(error);
      if (error.response.status === 408) {
        await AsyncStorage.clear();
        toastFail("Sessão expirada, faca login novamente");
        return <Navigate to="/" />;
      }
    }
  }

  async function startDb() {
    try {
      const {
        data: { init },
      } = await axios.get("/");

      setInit(init);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!init) {
      startDb();
    }
  }, []);

  useEffect(() => {
    location.pathname === "/" || location.pathname === "/login"
      ? setType("login")
      : setType("register");
  }, []);

  return (
    <div className="relative flex flex-col items-center justify-between w-full h-full">
      {!init ? (
        <div className="flex flex-col items-center">
          <PulseLoader color="#000" />
          <h1>Carregando...</h1>
        </div>
      ) : (
        <>
          <Header admin={admin} setAdmin={setAdmin} />
          <div className="flex items-center justify-center h-full w-full overflow-hidden">
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
      )}
    </div>
  );
}

export default App;
