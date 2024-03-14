import { Link } from "react-router-dom";
import whatsapp from "../../assets/whatsapp.svg";
import { useState } from "react";
export default function Whatsapp() {
  const [show, setShow] = useState(false);
  return (
    <div className="fixed bottom-3 right-3 flex items-center">
      <h2 className="text-green">Teve algum problema ou tem dúvida?</h2>
      <Link
        to={"https://wa.me/5511947000924?text=Preciso%20de%20ajuda."}
        target="_blank"
        className="flex items-center bg-green p-1 rounded-full transition-all duration-500 ease-out w-fit hover:w-72"
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
      >
        <img className="w-12 h-12" src={whatsapp} />
        {show && (
          <p className="text-white w-full text-center text-2xl uppercase">
            Fale conosco
          </p>
        )}
      </Link>
    </div>
  );
}
