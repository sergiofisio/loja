import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosPrivate from "../../Service/api";

export default function Confirm() {
  const navigate = useNavigate();
  const [validToken, setValidToken] = useState(false);
  const [isValidated, setisValidated] = useState(false);
  const location = useLocation();
  const urlParams = new URLSearchParams(location.search);
  const token = urlParams.get("id");
  async function activeUser() {
    try {
      const response = await axiosPrivate.post("/active", {
        token,
      });

      if (response.data.hasOwnProperty("isValid")) {
        setisValidated(true);
      }
      setValidToken(true);
    } catch (error) {
      console.log(error);
    }
  }

  async function HandleNewActivation() {
    try {
      await axiosPrivate.post("/confirmEmail", {
        token,
      });
    } catch (error) {
      console.log(error);
    }
  }

  function handleLogin() {
    navigate("/login");
  }

  useEffect(() => {
    activeUser();
  }, [validToken]);
  return (
    <div className=" h-full flex flex-col items-center justify-center">
      {!isValidated ? (
        validToken ? (
          <>
            <h1 className="text-4xl">Obrigado por confirmar seu email.</h1>
            <h1 onClick={handleLogin} className="cursor-pointer text-4xl">
              Clique aqui para fazer login
            </h1>
          </>
        ) : (
          <>
            <h1 className="text-4xl">Esta ativação não é mais válida.</h1>
            <h1 className="text-4xl">
              Por favor peça uma nova ativação{" "}
              <span
                className="text-green cursor-pointer transition-all hover:font-bold"
                onClick={HandleNewActivation}
              >
                clicando aqui.
              </span>
            </h1>
          </>
        )
      ) : (
        <>
          <h1 className="text-4xl">Email já Validado.</h1>
          <h1 onClick={handleLogin} className="cursor-pointer text-4xl">
            Clique aqui para fazer login
          </h1>
        </>
      )}
    </div>
  );
}
