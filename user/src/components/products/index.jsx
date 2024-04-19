export default function Seller({ onClick, img, name, priceFull, stock }) {
  return (
    <div
      className={`flex flex-col justify-center items-center w-72 h-[20rem] border-2 border-solid rounded-3xl p-4 relative ${
        !stock
          ? "bg-gray-400 bg-opacity-30 border-gray-400 border-opacity-30"
          : "border-green"
      } md:h-96`}
    >
      <div className="flex flex-col items-center justify-between w-full h-full">
        <img
          className={`${!stock ? "grayscale-[100%]" : ""} max-h-[70%]`}
          src={img}
          alt={`img ${name}`}
        />
        <div className="flex flex-col items-center justify-center">
          <h1
            className={`text-center font-main text-xl font-semibold ${
              !stock ? "line-through" : "text-green"
            }`}
          >
            {name}
          </h1>
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
