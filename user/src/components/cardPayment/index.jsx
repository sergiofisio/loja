export default function CardPayment({ img, text, paragraph }) {
  return (
    <div className="relative min-w-[20rem] h-full rounded-xl border-2 border-solid border-black p-5 font-main text-white font-semibold bg-black md:p-2">
      <img
        className="absolute top-[5%] right-[5%] w-6 h-6"
        src={img}
        alt="icon"
      />
      <h2 className="text-xl">{text}</h2>
      <p className="text-base">{paragraph}</p>
    </div>
  );
}
