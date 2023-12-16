import { useEffect, useState } from "react";
import closeBtn from "../../assets/closeBtn.svg";
import Input from "../input/form/input";
import axios from "./../../Service/api";
import uploadProduct from "../../assets/uploadProduct.svg";

export default function ModalAdminProduto({
  produto,
  setProduto,
  setShowModal,
}) {
  const [nome, setNome] = useState(produto.name || "");
  const [descricao, setDescricao] = useState(produto.description || "");
  const [id_categoria, setId_categoria] = useState(produto.categoryId || "");
  const [peso, setPeso] = useState(produto.weight || 0);
  const [preco, setPreco] = useState(produto.price || 0);
  const [estoque, setEstoque] = useState(produto.stock || 0);
  const [url, setUrl] = useState("");
  const [img, setImg] = useState("");

  async function handleUploadImg(e) {
    e.preventDefault();
    e.stopPropagation();
    const formData = new FormData();
    formData.append("file", url);
    const {
      data: {
        file: { Location },
      },
    } = await axios.post("/upload", formData, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
        "Content-Type": "multipart/form-data",
      },
    });
    setUrl(Location);
  }

  useEffect(() => {
    if (produto) {
      setImg(produto.images[0].url), setUrl(produto.images[0].url);
    }
  }, []);
  return (
    <div className="flex flex-col justify-center items-center bg-bgModal fixed top-0 w-full h-full z-50">
      <div
        className={`relative flex flex-col items-center justify-evenly w-2/3 h-[90%] bg-white rounded-3xl px-12 py-8 shadow-green shadow-2xl  gap-4`}
      >
        <img
          onClick={() => {
            setProduto("");
            setShowModal(false);
          }}
          className="absolute top-6 right-6 cursor-pointer"
          src={closeBtn}
          alt="btnClose"
        />
        <h2>{produto ? "Editar Produto" : "Novo Produto"}</h2>
        <div className="flex items-center w-full h-full">
          <img className="w-1/3" src={url || uploadProduct} alt="" />
          <div className="w-full h-full">
            <input type="file" onChange={(e) => setImg(e.target.files[0])} />
            <Input
              type="text"
              label="Nome do produto"
              placeholder="Nome do produto"
              set={setNome}
              value={nome}
              required={true}
            />
            <div className="w-full">
              <label
                className="font-main font-normal text-[#3bb77e] "
                htmlFor="descricao"
              >
                Descrição
              </label>
              <textarea
                className="border-[#555555] border-solid border-2 w-full resize-none overflow-y-scroll  scrollbar-thin scrollbar-thumb-green rounded-xl py-1 px-3 text-black"
                cols="30"
                rows="8"
                type="text"
                onChange={(e) => {
                  setDescricao(e.target.value);
                }}
                value={descricao}
              />
            </div>
            <div className="flex gap-5">
              <Input
                type="number"
                label="Peso(gramas)"
                placeholder="Peso"
                set={setPeso}
                value={peso}
                required={true}
              />
              <Input
                type="text"
                label="Preço"
                placeholder="Preço"
                set={setPreco}
                value={`${preco}`}
                required={true}
              />
            </div>
            {/* <Input
              type="number"
              label="Peso(gramas)"
              placeholder="Peso"
              set={setPeso}
              value={peso * 100}
              required={true}
            /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
