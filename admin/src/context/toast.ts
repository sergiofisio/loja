import { ToastPosition, toast } from "react-toastify";

export function toastSuccess(msg: string, time?: number, position?: ToastPosition) {
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
