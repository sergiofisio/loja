import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import arrowDown from "../../assets/arrow_down.svg";
import cart from "../../assets/cart/cart.svg";
import logo from "../../assets/logo/logoNome.svg";
import userImg from "../../assets/user/User.svg";
import ModalUserHeader from "../modalUserHeader";

export default function Header({ setShowModal, login, setLogin }) {
  const navigate = useNavigate();
  const [showModalHeader, setShowModalHeader] = useState(false);

  function handleClickLogo(e) {
    e.preventDefault();
    e.stopPropagation();
    navigate("/");
    setShowModalHeader(false);
  }

  function handleShowModal(e) {
    e.preventDefault();
    e.stopPropagation();
    if (localStorage.getItem("cart").length > 2) {
      setShowModal(true);
    }
  }

  return (
    <header className="relative flex w-full h-24 py-6 px-8 md:px-2 md:gap-2">
      <div className="flex items-center gap-5 w-full">
        <img
          className="cursor-pointer"
          src={logo}
          alt="Logo"
          onClick={handleClickLogo}
        />
      </div>
      <div className="flex justify-end w-full gap-10">
        <div
          className="flex items-center cursor-pointer"
          onClick={handleShowModal}
        >
          {localStorage.getItem("cart") &&
            window.location.pathname !== "/cart" && (
              <>
                <h2 className=" text-base font-medium md:hidden">
                  Finalize suas compras clicando aqui
                </h2>
                <div className="flex items-center h-full gap-3">
                  <div className="relative flex w-full">
                    <img className="w-4/5 h-4/5" src={cart} alt="icon fav" />
                    <h2 className="absolute right-0 top-1 flex items-center justify-center bg-green text-white rounded-full w-5 h-5 font-main md:hidden">
                      {localStorage.getItem("cart")
                        ? JSON.parse(localStorage.getItem("cart")).length
                        : 0}
                    </h2>
                  </div>
                  <div className="relative flex items-center">
                    <div className="flex items-center">
                      <h2 className="text-[#253d4e] font-main text-base font-medium">
                        Meu carrinho
                      </h2>
                      <img src={arrowDown} alt="iconArrow" />
                    </div>
                  </div>
                </div>
              </>
            )}
        </div>
        <div
          className="flex items-center justify-end gap-6 cursor-pointer"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            if (!login) {
              navigate("/login");
              return setLogin(true);
            }
            setShowModalHeader(!showModalHeader);
          }}
        >
          <div className="flex justify-center p-2 rounded-full w-14 h-14 border-2 border-black border-solid">
            <img
              src={
                localStorage.getItem("usuarioImg") === "null" ||
                !localStorage.getItem("usuarioImg")
                  ? userImg
                  : localStorage.getItem("usuarioImg")
              }
              alt="img user"
              className="userImg"
            />
          </div>
          <h2>
            {localStorage.getItem("usuarioNome")
              ? localStorage.getItem("usuarioNome").split(" ")[0]
              : "Entrar"}
          </h2>
        </div>
      </div>
      {localStorage.getItem("usuarioId") && showModalHeader && (
        <ModalUserHeader setShowModalHeader={setShowModalHeader} />
      )}
    </header>
  );
}
