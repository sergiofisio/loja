import leaft from "../../assets/footer/leaf.svg";
import leaf2 from "../../assets/footer/leaf2.svg";
import leaf3 from "../../assets/footer/leaf3.svg";
import pontilhado from "../../assets/footer/pontilhado.svg";
import pontilhadoCanto from "../../assets/footer/pontilhadoCanto.svg";
import logo from "../../assets/logo/logo.svg";
import Button from "../button";

export default function Footer({ setShowModalContato }) {
  return (
    <footer className="relative flex flex-col justify-around items-center w-full border-t-2 border-greenScale-200 border-solid mx-32 my-8 gap-8 text-black font-main text-3xl font-medium">
      <img
        src={leaft}
        alt="img Leaf"
        className="absolute top-[17%] right-[4%]"
      />
      <img src={leaf2} alt="img leaf2" className="absolute top-0 right-[16%]" />
      <img
        src={leaf3}
        alt="img leaf2"
        className="absolute bottom-[10%] left-[10%]"
      />
      <img
        src={pontilhado}
        alt="img pontilhado"
        className="absolute bottom-[20%] left-[13%]"
      />
      <img
        src={pontilhadoCanto}
        alt="img pontilhadoCanto"
        className="absolute bottom-0 right-0"
      />
      <img src={logo} alt="imgLogo" className="mt-[1%]" />
      <h1 className="mt-[2%] w-3/5 text-center">
        Tenha agora mesmo acesso a uma ampla variedade de suplementos naturais
        de alta qualidade
      </h1>
      <div className="flex flex-col items-center w-2/5 gap-4">
        <h2>Está tendo algum problema?</h2>
        <div className="w-1/3">
          <Button
            onClick={() => setShowModalContato(true)}
            type="button"
            className="bg-black h-20 p-4 rounded-r-2xl rounded-bl-3xl 1536:text-base 1440:text-base 1366:text-base"
            text="Entre em contato aqui"
          />
        </div>
      </div>
    </footer>
  );
}
