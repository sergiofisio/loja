import { useContext } from "react";
import { AppContext } from "../context/app-context";

export default function UseAppList() {
  return useContext(AppContext);
}