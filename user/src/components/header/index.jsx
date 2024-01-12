import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import arrowDown from "../../assets/arrow_down.svg";
import cart from "../../assets/cart/cart.svg";
import logo from "../../assets/logo/logoNome.svg";
import search from "../../assets/search.svg";
import userImg from "../../assets/user/User.svg";
import SelectProduct from "../input/select";
import ModalUserHeader from "../modalUserHeader";

export default function Header({
  productsCart,
  setShowModal,
  login,
  setLogin,
}) {
  const navigate = useNavigate();
  const [selectInput, setSelectInput] = useState("Todos");
  const [showModalHeader, setShowModalHeader] = useState(false);
  const [cart, setCart] = useState(null)

  function handleClickLogo(e) {
    e.preventDefault();
    e.stopPropagation();
    if (login) {
      navigate("/store");
    } else {
      navigate("/");
    }
    setShowModalHeader(false);
  }

  function handleShowModal(e) {
    e.preventDefault();
    e.stopPropagation();
    if (localStorage.getItem("cart").length > 2) {
      setShowModal(true);
    }
  }

  useEffect(() => {
     if(!cart) setCart(productsCart.length)
  }, [cart]);

  return (
    <header className="relative flex w-full h-24 py-6 px-8">
      <div className="flex items-center gap-5 w-full">
        <img
          className="cursor-pointer"
          src={logo}
          alt="Logo"
          onClick={(e) => handleClickLogo(e)}
        />
        {/* <h2 className="text-grey font-main text-base font-semibold">|</h2>
        <Link className="text-green font-main text-base font-semibold">
          Seja Parceiro
        </Link> */}
      </div>
      {productsCart.length ? (
        <>
          <div className="flex items-center justify-center h-full w-full bg-[#f3f3f3] gap-[5%] p-3 rounded-l-2xl">
            <SelectProduct
              className="!w-1/3 !bg-transparent !border-none "
              setSelectInput={setSelectInput}
              selectInput={selectInput}
            />
            <h2>|</h2>
            <input
              className="bg-transparent border-none w-9/12 h-full outline-none font-main text-sm font-medium"
              type="search"
              name=""
              id=""
            />
          </div>
          <img
            src={search}
            alt="icon search"
            className="h-full rounded-r-2xl rounded-bl-2xl bg-green p-2"
          />
        </>
      ) : (
        ""
      )}
      <div className="flex justify-end w-full gap-10">
        <div
          className="flex items-center cursor-pointer"
          onClick={(e) => handleShowModal(e)}
        >
          {cart ? (
            <>
              <h2 className=" text-base font-medium">
                Finalize suas compras clicando aqui
              </h2>
              <div className="flex items-center h-full gap-3">
                <div className="relative flex w-full">
                  <img className="w-4/5 h-4/5" src={cart} alt="icon fav" />
                  <h2 className="absolute right-0 top-1 flex items-center justify-center bg-green text-white rounded-full w-5 h-5 font-main">
                    {!localStorage.getItem("cart")
                      ? 0
                      : JSON.parse(localStorage.getItem("cart")).length}
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
          ) : (
            ""
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
      {showModalHeader && (
        <ModalUserHeader setShowModalHeader={setShowModalHeader} />
      )}
    </header>
  );
}
