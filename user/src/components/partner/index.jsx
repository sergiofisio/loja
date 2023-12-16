import check from "../../assets/partner/check.svg";
import mais from "../../assets/partner/mais.svg";
import photo1 from "../../assets/partner/photo1.svg";
import photo2 from "../../assets/partner/photo2.svg";
import photo3 from "../../assets/partner/photo3.svg";
import photo4 from "../../assets/partner/photo4.svg";
import step1 from "../../assets/partner/step1.svg";
import step2 from "../../assets/partner/step2.svg";
import step3 from "../../assets/partner/step3.svg";
import Button from "../button";

export default function Partner() {
  return (
    <section className="flex flex-col gap-16 px-32">
      <div className="text-black text-center font-main text-5xl font-bold gap-4 flex flex-col">
        <h1>Se torne parceiro</h1>
        <p className="text-black text-2xl font-light">
          Junte-se a nós como afiliado e faça parte de uma{" "}
          <span className="font-bold">parceria lucrativa</span>, onde todos se
          beneficiam: você, seus pacientes e nossa missão de oferecer produtos
          naturais de qualidade para melhorar a saúde e o bem-estar de todos.
        </p>
      </div>
      <div className="flex h-full gap-[5%]">
        <div className="flex flex-col w-full h-full gap-[2%] border-green border-solid border-r-2">
          <div className="flex gap-[3%]">
            <img src={step1} alt="img Step" />
            <div className="h-full text-[#1b1b1b] font-main font-bold">
              <h1 className="text-3xl">Primeiro passo</h1>
              <h2 className="text-xl">
                Cadastre-se na plataforma como afiliado.
              </h2>
              <Button
                type="button"
                className="bg-black h-20 text-3xl rounded-r-2xl rounded-bl-3xl"
                text="Cadastrar"
              />
            </div>
          </div>
          <div className="flex gap-[3%]">
            <img src={step2} alt="img Step" />
            <div className="h-full text-[#1b1b1b] font-main font-bold">
              <h1 className="text-3xl">Segundo passo</h1>
              <h2 className="text-xl">
                Verifique sua conta e solicite um cupom único.
              </h2>
            </div>
          </div>
          <div className="flex gap-[3%]">
            <img src={step3} alt="img Step" />
            <div className="h-full text-[#1b1b1b] font-main font-bold">
              <h1 className="text-3xl">Terceiro passo</h1>
              <h2 className="text-xl">Divulgue seu cupom e ganhe benefícios</h2>
            </div>
          </div>
        </div>
        <div className="flex flex-col w-full gap-[5%]">
          <div className="flex font-main text-xl font-normal">
            <img src={check} alt="imgChecked" />
            <h1>Seus pacientes ganham 5% de desconto em todas as compras.</h1>
          </div>
          <div className="flex font-main text-xl font-normal">
            <img src={check} alt="imgChecked" />
            <h1>Benefícios para você e seus pacientes.</h1>
          </div>
          <div className="relative w-full flex justify-center items-center top-1/2">
            <img
              className="flex absolute border-2 border-solid border-green rounded-full w-1/5 left-[20%]"
              src={photo1}
              alt="img photo1"
            />
            <img
              className="flex absolute border-2 border-solid border-green rounded-full w-1/5 left-[32%]"
              src={photo2}
              alt="img photo2"
            />
            <img
              className="flex absolute border-2 border-solid border-green rounded-full w-1/5 left-[44%]"
              src={photo3}
              alt="img photo3"
            />
            <img
              className="flex absolute border-2 border-solid border-green rounded-full w-1/5 left-[56%]"
              src={photo4}
              alt="img photo5"
            />
            <img
              className="flex absolute border-2 border-solid border-green rounded-full w-1/5 left-[68%]"
              src={mais}
              alt="img mais"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
