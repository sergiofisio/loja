import { ToastPosition, toast } from "react-toastify";

type ToastType = "success" | "error" | "info" | "warn";

export function toastfy(
  type: ToastType,
  msg: string,
  classname: string,
  time: number
) {
  toast[type](msg, {
    position: "bottom-center",
    autoClose: time,
    hideProgressBar: false,
    pauseOnHover: false,
    closeOnClick: true,
    draggable: false,
    icon: false,
    closeButton: false,
    theme: "colored",
    className: `${classname} w-full h-full !rounded-xl`,
  });
}

export function toastSuccess(
  msg: string,
  time?: number,
  position?: ToastPosition
) {
  toast.success(`${msg}`, {
    icon: false,
    position,
    autoClose: time || 3000,
    hideProgressBar: true,
    closeOnClick: true,
    pauseOnHover: false,
    draggable: false,
    className:
      "text-[white] font-main text-xl bg-green border-4 border-solid border-green rounded-2xl w-[29rem]",
  });
}
export function toastFail(msg: string, time?: number) {
  toast.error(`${msg}`, {
    closeButton: false,
    position: "bottom-left",
    autoClose: time || 3000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: false,
    theme: "light",
    className:
      "text-[red] font-main text-xl bg-[white] border-4 border-solid border-green rounded-2xl w-[29rem]",
  });
}
