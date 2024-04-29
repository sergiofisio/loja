import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../Service/api";
import leaftArrow from "../../assets/home/leaf-arrow.svg";
import leaftMini from "../../assets/home/leaf-mini.svg";
import leaft from "../../assets/home/leaf.svg";
import remedy from "../../assets/home/remedy.svg";
import logo from "../../assets/logo/logo.svg";
import user from "../../assets/user/User.svg";
import Benefits from "../../components/benefits";
import Button from "../../components/button";
import Form from "../../components/form";
import Payment from "../../components/payment";
import Sellers from "../../components/sellers";
import Testimonials from "../../components/testimonials";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Home({ login, setLogin, singIn, setSingIn }) {
  const navigate = useNavigate();
  const [infoDb, setInfoDb] = useState({
    depoimentos: [],
    historicos: [],
    parceiros: [],
    produtos: [],
  });

  function handleBtnClick(e) {
    e.preventDefault();
    e.stopPropagation();
    navigate("/store");
  }

  async function getPorductsCategoriesTestimonials() {
    try {
      const {
        data: { products, users, testimonials, partners },
      } = await axios.get("/infoHome/false", {
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
      });

      setInfoDb({
        depoimentos: testimonials,
        historicos: [],
        parceiros: partners,
        produtos: products,
      });
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getPorductsCategoriesTestimonials();
  }, []);

  return (
    <div className="flex flex-col w-full h-full">
      <section className="flex w-full min-h-full">
        <div className="flex items-center justify-center w-full h-[40rem] px-32 md:px-8">
          {!login && !singIn ? (
            <div className="relative flex flex-col gap-10">
              <div className="absolute top-[3%] -left-[5%] md:hidden">
                <img
                  className="absolute -top-[10%]"
                  src={logo}
                  alt="img logo"
                />
                <img
                  className="absolute top-[3%] -left-[5%] "
                  src={leaftMini}
                  alt="img leaf-mini"
                />
              </div>
              <div className="flex flex-col gap-5">
                <h1 className="text-black font-main text-5xl font-bold md:text-2xl">
                  Traga equilíbrio para sua vida com soluções naturais!
                </h1>
                <h2 className="text-black text-3xl font-light">
                  Promovendo saúde e vitalidade com uma abordagem holística
                  utilizando remédios naturais.
                </h2>
              </div>
              <div className="flex items-center gap-7">
                <Button
                  onClick={handleBtnClick}
                  type="submit"
                  className="bg-black h-20 text-3xl rounded-r-2xl rounded-bl-3xl"
                  text="Entrar"
                />
                <h2>10% OFF para novos usuários</h2>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-full h-full md:justify-start md:items-start">
              <Form
                login={login}
                setLogin={setLogin}
                singIn={singIn}
                setSingIn={setSingIn}
              />
              <h2 className="w-full text-center font-special">
                Esqueceu sua senha?
                <p className="cursor-pointer hover:drop-shadow-md">
                  Clique aqui
                </p>
              </h2>
            </div>
          )}
        </div>
        <div className="right relative flex w-full h-[50rem] md:hidden">
          <img
            className="home-products absolute min-h-[50%] max-h-[63%] bottom-[11%] left-[3%]"
            src={remedy}
            alt="imgProducts"
          />
          <img
            className="absolute h-[83%] b-[4%] right-0"
            src={leaft}
            alt="imgLeaf"
          />
          <img
            className="absolute h-[37%] top-0 right-[16%]"
            src={leaftArrow}
            alt="imgLeaf"
          />
        </div>
      </section>
      {!login && (
        <>
          <Sellers products={infoDb.produtos} />
          <div className="w-full border-b-2 border-gray-500 border-dotted border-opacity-30 my-4" />
          <Benefits />
          {infoDb.depoimentos.length ? (
            <Testimonials testimonials={infoDb.depoimentos} user={user} />
          ) : (
            ""
          )}
          <Payment />
        </>
      )}
    </div>
  );
}
