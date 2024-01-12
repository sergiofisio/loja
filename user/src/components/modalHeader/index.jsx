import { useNavigate } from "react-router-dom";
import trash from "../../assets/cart/trash.svg";
import Button from "../button";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { toastFail } from "../../context/toast";

export default function ModalHeader({ setShowModal, showModal }) {
  const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  function handleDeleteProduct(e, id) {
    e.preventDefault();
    e.stopPropagation();
    const newCart = JSON.parse(localStorage.getItem("cart")).filter(
      (product) => product.product.id !== id
    );
    localStorage.setItem("cart", JSON.stringify(newCart));
  }

  useEffect(() => {
    setCart(JSON.parse(localStorage.getItem("cart")));
  }, [cart]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: showModal ? 1 : 0, transition: { duration: 0.5 } }}
      exit={{ opacity: 0 }}
      className="absolute bg-bgModal w-full h-full z-10"
    >
      <div
        className={`fixed flex flex-col bg-white border-green border-2 shadow-green shadow-2xl ${
          showModal ? "right-0" : "right-[-10%]"
        } top-10 w-80 h-[90vh] rounded-2xl transition-all`}
      >
        <div className="flex w-full h-10 font-main text-black font-extrabold border-green border-b-4">
          <h2 className="flex justify-center items-center w-20">FOTO</h2>
          <h2 className="flex justify-center items-center w-full">NOME</h2>
        </div>
        <div className="flex flex-col overflow-y-scroll h-[77%] scrollbar-thin scrollbar-thumb-green">
          {cart.length ? (
            cart.map(({ product }, key) => {
              return (
                <div
                  key={key}
                  className="flex justify-center items-center border-green border-b-2 border-dashed font-main text-black font-extrabold"
                >
                  <img
                    className="flex justify-center items-center w-20 p-2"
                    src={product.url}
                    alt=""
                  />
                  <h2 className="flex justify-center items-center w-full">
                    {product.nome}
                  </h2>
                  <img
                    src={trash}
                    alt="icon trash"
                    className="w-8 h-8 cursor-pointer"
                    onClick={(e) => handleDeleteProduct(e, product.id)}
                  />
                </div>
              );
            })
          ) : (
            <h2 className="self-center">Sem items no carrinho no momento</h2>
          )}
          {localStorage.getItem("cart") ? (
            <div className="flex flex-col w-full absolute bottom-0 gap-4">
              <Button
                onClick={() => {
                  setShowModal(false);
                  navigate("/store");
                }}
                type="button"
                className="w-full min-h-[3rem] bg-[#797979]"
                text="Continuar comprando"
              />
              <Button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  if (!cart.length)
                    return toastFail("Seu carrinho esta vazio", 3000);
                  setShowModal(false);
                  navigate("/cart");
                }}
                type="button"
                className=" w-full min-h-[3rem] bg-green rounded-b-xl"
                text="Finalizar"
              />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </motion.div>
  );
}
