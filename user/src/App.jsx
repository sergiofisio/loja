import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import axios from "./Service/api";
import Footer from "./components/footer";
import Header from "./components/header";
import Access from "./pages/access";
import Home from "./pages/home";
import NotFound from "./pages/notFound";
import Store from "./pages/store";
import Cart from "./pages/cart";
import ModalHeader from "./components/modalHeader";
import Confirm from "./pages/confirm";
import Admin from "./pages/admin";
import { localconfig } from "./utils/localConfig";
import ModalContato from "./components/modalContato";
import { PulseLoader } from "react-spinners";

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [singIn, setSingIn] = useState(false);
  const [login, setLogin] = useState(false);
  const [productsCart, setProductsCart] = useState([]);
  const [adress, setAdress] = useState("");
  const [card, setCard] = useState("");
  const [id, setId] = useState("");
  const [initialization, setInitialization] = useState(false);
  const [showModalContato, setShowModalContato] = useState(false);

  function LogedUser({ redirecionarPara }) {
    const isAutheticated = localStorage.getItem("token");

    return isAutheticated ? <Navigate to={redirecionarPara} /> : <Outlet />;
  }

  function ProtectRoutes({ redirecionarPara }) {
    let isAutheticated = localStorage.getItem("token");

    return isAutheticated ? <Outlet /> : <Navigate to={redirecionarPara} />;
  }

  async function startDb() {
    try {
      await axios.get("/");
      setInitialization(true);
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    if (!initialization) {
      console.log("OK");
      startDb();
    }
  }, []);

  useEffect(() => {
    location.pathname === "/"
      ? (setSingIn(false), setLogin(false))
      : location.pathname === "/login"
        ? (setSingIn(false), setLogin(true))
        : location.pathname === "/register"
          ? (setSingIn(true), setLogin(false))
          : location.pathname === "/home"
            ? setLogin(true)
            : "";
  }, [location.pathname]);

  return (
    <div className="relative flex flex-col items-center w-full">
      {!initialization ? (
        <div>
          <PulseLoader color="#000" />
        </div>
      ) : (
        <>
          <Header
            productsCart={productsCart}
            setShowModal={setShowModal}
            setLogin={setLogin}
            login={login}
          />
          <AnimatePresence mode="wait">
            <Routes>
              <Route element={<LogedUser redirecionarPara={"/home"} />}>
                <Route path="/confirm/*" element={<Confirm />} />
                <Route
                  path="/"
                  element={
                    <Home
                      setLogin={setLogin}
                      login={login}
                      setSingIn={setSingIn}
                      singIn={singIn}
                    />
                  }
                />
                <Route
                  path="/login"
                  element={
                    <Home
                      setLogin={setLogin}
                      login={login}
                      setSingIn={setSingIn}
                      singIn={singIn}
                    />
                  }
                />
                <Route
                  path="/register"
                  element={
                    <Home
                      setLogin={setLogin}
                      login={login}
                      setSingIn={setSingIn}
                      singIn={singIn}
                    />
                  }
                />
              </Route>

              <Route element={<ProtectRoutes redirecionarPara={"/"} />}>
                <Route
                  path={"/store"}
                  element={<Store setShowModal={setShowModal} />}
                />
                <Route
                  path={"/home"}
                  element={
                    <Access
                      id={id}
                      setId={setId}
                      adress={adress}
                      setAdress={setAdress}
                      card={card}
                      setCard={setCard}
                    />
                  }
                />
                <Route
                  path="/cart"
                  element={
                    <Cart
                      id={id}
                      setId={setId}
                      adress={adress}
                      card={card}
                      setProductsCart={setProductsCart}
                      productsCart={productsCart}
                    />
                  }
                />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
          <Footer setShowModalContato={setShowModalContato} />
        </>
      )}
      {showModalContato && (
        <ModalContato setShowModalContato={setShowModalContato} />
      )}
      {showModal ? (
        <ModalHeader setShowModal={setShowModal} showModal={showModal} />
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
