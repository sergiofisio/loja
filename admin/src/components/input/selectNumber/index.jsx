import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

export default function SelectProduct({ className, set, value, array }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={`${className} relative`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="pl-3 w-full pr-10 py-2 shadow-lg h-7 text-left rounded-xl"
      >
        {value}
        <div
          className={`${
            isOpen ? "rotate-180" : ""
          } absolute right-3 top-1/2 transform transition-all duration-500 -translate-y-1/2`}
        >
          <IoIosArrowDown size="28" className="h-6 w-6" />
        </div>
      </button>
      {isOpen && (
        <ul className="absolute w-full max-h-44 overflow-y-auto shadow-lg py-1 rounded-xl bg-green border border-gray-300">
          {array.map((option, key) => {
            return (
              <li
                key={key}
                onClick={() => {
                  set(option);
                  setIsOpen(false);
                }}
                className="px-3 py-1 hover:bg-white hover:text-green cursor-pointer"
              >
                {option.toString().length === 1 ? `0${option}` : option}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
