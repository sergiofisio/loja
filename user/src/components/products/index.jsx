export default function Seller({ onClick, img, name, priceFull, stock }) {
  return (
    <div
      className={`flex flex-col justify-around items-center w-72 h-full border-2 border-solid rounded-3xl p-4 relative ${
        !stock
          ? "bg-gray-400 bg-opacity-30 border-gray-400 border-opacity-30"
          : "border-green"
      }`}
    >
      <div className="flex flex-col items-center justify-between h-4/5 md:h-full">
        <img
          className={`${!stock ? "grayscale-[100%]" : ""} h-1/2 md:h-1/3`}
          src={img}
          alt={`img ${name}`}
        />
        <h1
          className={` font-main text-xl font-semibold ${
            !stock ? "line-through" : "text-green"
          }`}
        >
          {name}
        </h1>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex justify-center font-semibold items-center gap-3">
          <h3
            className={`text-green font-main text-2xl ${
              !stock ? "font-bold" : ""
            }`}
          >{`${!stock ? "Indisponível" : priceFull}`}</h3>
        </div>
      </div>
    </div>
  );
}
