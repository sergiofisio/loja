import check from "../../../assets/cart/checked.svg";
import uncheck from "../../../assets/cart/unchecked.svg";
import link from "../../../assets/cart/link.svg";

export default function ChangeStep({ step }) {
  return (
    <div className="flex w-full justify-center md:hidden">
      <img
        className={`${step !== "step1" ? "bg-green w-8" : ""} rounded-full `}
        src={step !== "step1" ? check : uncheck}
        alt=""
      />
      <img
        className={` ${
          step === "step1" ? "opacity-100 gradient-mask-r-0" : "opacity-100"
        }`}
        src={link}
        alt=""
      />
      <img
        className={`${
          step === "step1"
            ? "opacity-70"
            : step === "step2"
              ? "opacity-100"
              : "opacity-100 bg-green w-8 rounded-full"
        }`}
        src={step !== "step1" && step !== "step2" ? check : uncheck}
        alt=""
      />
      <img
        className={` ${
          step === "step1"
            ? "opacity-20"
            : step === "step2"
              ? "opacity-100 gradient-mask-r-0"
              : "opacity-100"
        }`}
        src={link}
        alt=""
      />
      <img
        className={`${
          step === "step1"
            ? "opacity-40"
            : step === "step2"
              ? "opacity-70"
              : step === "step3"
                ? "opacity-100"
                : "opacity-100 bg-green w-8 rounded-full"
        }`}
        src={
          step !== "step1" && step !== "step2" && step !== "step3"
            ? check
            : uncheck
        }
        alt=""
      />
      <img
        className={` ${
          step === "step1"
            ? "opacity-20"
            : step === "step2"
              ? "opacity-40"
              : step === "step3"
                ? "opacity-70 gradient-mask-r-0"
                : "opacity-100 "
        }`}
        src={link}
        alt=""
      />
      <img
        className={`${
          step === "step1"
            ? "opacity-20"
            : step === "step2"
              ? "opacity-40"
              : step === "step3"
                ? "opacity-70"
                : "opacity-100"
        }`}
        src={uncheck}
        alt=""
      />
    </div>
  );
}
