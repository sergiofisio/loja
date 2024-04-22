export default function Step4({ userInfo }) {
  return (
    <div>
      <h2 className="font-main text-2xl font-semibold t-[#253D4E]">
        {`Parabens ${userInfo.name}!!!`}{" "}
      </h2>
      <h2>
        Sua compra foi realizada com sucesso. Agora é so esperar que sua compra
        vai chegar rapidinho no seu endereço.
      </h2>
    </div>
  );
}
