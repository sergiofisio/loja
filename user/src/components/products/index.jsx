export default function Seller({ onClick, img, name, priceFull }) {
  return (
    <div className="flex flex-col justify-around items-center w-72 h-full border-2 border-solid border-green rounded-3xl p-4">
      <div className="grid items-end justify-between justify-items-center h-4/5">
        <img className="w-1/2" src={img} alt={`img ${name}`} />
        <h1 className="text-green font-main text-xl font-semibold">{name}</h1>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex justify-center font-semibold items-center gap-3">
          <h3
            className="text-green font-main text-2xl
            "
          >{`${priceFull}`}</h3>
        </div>
      </div>
    </div>
  );
}
