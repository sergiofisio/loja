import bula from "../../assets/home/bula.svg";
import heart from "../../assets/home/heart.svg";
import leaftMini from "../../assets/home/leaf-mini.svg";
import radioactive from "../../assets/home/radioativo.svg";

export default function Benefits() {
  return (
    <section className="flex flex-col items-center justify-center w-full h-full gap-16 px-32 mt-8">
      <div className="relative flex flex-col text-black text-center font-bold">
        <img
          className="absolute -top-[40%] right-[28%] rotate-180"
          src={leaftMini}
          alt="img leaf"
        />
        <h2 className="font-main text-5xl">Benefícios</h2>
        <h3 className="font-special text-2xl font-[275]">
          pelos quais muitas pessoas optam pelos suplementos naturais
        </h3>
      </div>
      <div className="flex items-center justify-center w-full text-black font-main text-xl font-medium">
        <div className="w-full flex flex-col items-center px-16 gap-7">
          <img src={radioactive} alt="img radioactive" />
          <h2>Redução da exposição a produtos químicos</h2>
        </div>
        <div className="w-full flex flex-col items-center px-16 gap-7 border-x-2 border-solid border-green">
          <img src={bula} alt="img bula" />
          <h2>
            Suplementos naturais complementam uma visão completa da saúde,
            apoiando sistemas específicos do corpo.
          </h2>
        </div>
        <div className="w-full flex flex-col items-center px-16 gap-7">
          <img src={heart} alt="img heart" />
          <h2>Fortalecimento do sistema imunológico e muito mais</h2>
        </div>
      </div>
    </section>
  );
}
