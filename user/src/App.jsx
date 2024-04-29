import { AnimatePresence } from "framer-motion";
import { useContext, useEffect, useState } from "react";
import {
  Navigate,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import "./App.css";
import Footer from "./components/footer";
import Header from "./components/header";
import Access from "./pages/access";
import Home from "./pages/home";
import NotFound from "./pages/notFound";
import Store from "./pages/store";
import Cart from "./pages/cart";
import ModalHeader from "./components/modalHeader";
import Confirm from "./pages/confirm";
import ModalContato from "./components/modalContato";
import TopBarProgress from "react-topbar-progress-indicator";
import { AppContext } from "./context/context";
import { toast } from "react-toastify";
import Whatsapp from "./components/whatsapp";

TopBarProgress.config({
  barColors: {
    0: "#f00",
    "1.0": "#0f0",
  },
  shadowBlur: 5,
});

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [singIn, setSingIn] = useState(false);
  const [login, setLogin] = useState(false);
  const [productsCart, setProductsCart] = useState([]);
  const [adress, setAdress] = useState("");
  const [card, setCard] = useState("");
  const [id, setId] = useState("");
  const [showModalContato, setShowModalContato] = useState(false);
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

  function LogedUser({ redirecionarPara }) {
    const isAutheticated = localStorage.getItem("token");

    return isAutheticated ? <Navigate to={redirecionarPara} /> : <Outlet />;
  }

  function ProtectRoutes({ redirecionarPara }) {
    let isAutheticated = localStorage.getItem("token");

    return isAutheticated ? <Outlet /> : <Navigate to={redirecionarPara} />;
  }

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
    <div className="relative flex flex-col items-center w-full h-full">
      <Header
        productsCart={productsCart}
        setShowModal={setShowModal}
        setLogin={setLogin}
        login={login}
      />
      {isLoading && (
        <>
          <TopBarProgress />
          <div className="fixed top-0 left-0 z-50 w-full h-full bg-black opacity-50" />
        </>
      )}
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
            <Route path={"/home"} element={<Access login />} />
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
          <Route
            path={"/store"}
            element={<Store setShowModal={setShowModal} />}
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AnimatePresence>
      {!login ? <Footer setShowModalContato={setShowModalContato} /> : ""}
      <Whatsapp />
      {showModalContato && (
        <ModalContato setShowModalContato={setShowModalContato} />
      )}
      {showModal ? (
        <ModalHeader
          setShowModal={setShowModal}
          showModal={showModal}
          login={login}
          setLogin={setLogin}
        />
      ) : (
        ""
      )}
    </div>
  );
}
