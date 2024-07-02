import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import arrowDown from "../../assets/arrow_down.svg";
import logo from "../../assets/logo/logoNome.svg";
import ModalUserHeader from "../modalUserHeader";
import imgUser from "../../assets/user/User.svg";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Header({
  admin,
  setAdmin,
}: {
  admin: boolean;
  setAdmin: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const navigate = useNavigate();
  const [showModalHeader, setShowModalHeader] = useState(false);
  const [userName, setUserName]: any = useState("");

  useEffect(() => {
    async function getUserName() {
      try {
        setUserName(await AsyncStorage.getItem("usuarioNome"));
      } catch (error: any) {}
    }

    getUserName();
  }, [userName]);

  return (
    <header
      className={`relative flex ${
        !admin ? "justify-center" : "justify-between"
      } w-full h-24 py-6 px-8`}
    >
      <div className="flex items-center gap-5">
        <img
          className="cursor-pointer"
          src={logo}
          alt="Logo"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            navigate("/"), setShowModalHeader(false);
          }}
        />
      </div>

      {admin && (
        <>
          <h2 className="text-green text-5xl font-semibold font-main">Admin</h2>

          <div className="flex justify-end gap-10">
            {localStorage.getItem("cart") ? (
              <div
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setShowModalHeader(false);
                }}
                className="flex cursor-pointer items-center"
              >
                <h2 className="text-[#253d4e] font-main text-base font-medium">
                  Meu carrinho
                </h2>
                <img src={arrowDown} alt="iconArrow" />
              </div>
            ) : (
              ""
            )}
            <div
              className="flex items-center justify-end gap-6 cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowModalHeader(!showModalHeader);
              }}
            >
              <div className="flex justify-center p-2 rounded-full w-14 h-14 border-2 border-black border-solid">
                <img src={imgUser} alt="" />
              </div>
              <h2>{userName && userName.split(" ")[0]}</h2>
            </div>
          </div>
        </>
      )}
      {showModalHeader && (
        <ModalUserHeader
          setShowModalHeader={setShowModalHeader}
          setAdmin={setAdmin}
        />
      )}
    </header>
  );
}
