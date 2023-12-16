import Rating from "@mui/material/Rating";

export function ProductsByCategories({ img, name, rating }) {
  return (
    <div className="flex flex-col justify-between items-center w-48 h-60 rounded-xl border-green border-solid border-2 p-4">
      <img className="flex w-1/2" src={img} alt={`imagem ${name}`} />
      <h2 className="text-[#253d4e] font-main font-semibold text-xl text-center">
        {name}
      </h2>
      {/* <div className="flex">
        <Rating name="read-only" value={rating} readOnly />
        <h2>{`(${Math.round(rating)})`}</h2>
      </div> */}
    </div>
  );
}
