import { useNavigate } from "react-router-dom";
import Button from "../../components/button";

const NotFound = () => {
  const navigate = useNavigate();
  const voltar = () => navigate(-1);
  return (
    <section className="flex justify-center items-center w-full h-full font-main bg-white">
      <div className="flex flex-col items-center justify-center bg-white border-2 border-solid border-black rounded-3xl w-80 h-52">
        <h1>Não encontrado</h1>
        <br />
        <p className="mb-5">A página requisitada não foi encontrada.</p>
        <Button
          onClick={voltar}
          className="bg-green !w-52 h-12"
          text="Voltar"
        />
      </div>
    </section>
  );
};

export default NotFound;
