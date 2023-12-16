import { useLocation, useNavigate } from "react-router-dom";
import { toastSuccess } from "../../context/toast";

export default function ModalUserHeader({ setShowModalHeader }) {
  const navigate = useNavigate();
  const location = useLocation();
  function handleMeusPedidos(e) {
    e.preventDefault();
    e.stopPropagation();
    if (location.pathname !== "/home") {
      navigate("/home");
    }
    setShowModalHeader(false);
  }

  function handleSair(e) {
    e.preventDefault();
    e.stopPropagation();
    toastSuccess("Até mais!", 3000, "top-center");
    setTimeout(() => {
      localStorage.clear();
      setShowModalHeader(false);
      navigate("/");
    }, 3000);
  }
  return (
    <div className="flex flex-col items-center justify-center absolute -bottom-20 right-5 shadow-green/80">
      <div className="flex flex-col justify-center border-green border-2 rounded-xl gap-1 bg-green w-full h-24">
        <h2
          className="flex items-center justify-center cursor-pointer z-50 decoration-0 text-white transition-all bg-transparent duration-500 ease-in-out hover:underline hover:underline-offset-2 px-3 w-full h-full"
          onClick={handleMeusPedidos}
        >
          Meus pedidos
        </h2>
        <h2 className="border-b-green border-solid border-2 "></h2>
        <h2
          className="flex items-center justify-center cursor-pointer z-50 decoration-0 text-white transition-all bg-transparent duration-500 ease-in-out hover:underline hover:underline-offset-2 px-5 w-full h-full"
          onClick={(e) => handleSair(e)}
        >
          Sair
        </h2>
      </div>
    </div>
  );
}
