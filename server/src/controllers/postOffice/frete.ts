import axios from "axios";
import { Request, Response } from "express";



export default async function frete(req: Request, res: Response) {
  let { cep } = req.params;
  cep = cep.replace("-", "")

  try {
    const frete = await axios.get(`https://api.correios.com.br/calculador/CalcPrecoPrazo.asmx/CalcPrecoPrazo?nCdEmpresa=&sDsSenha=&sCepOrigem=09710212&sCepDestino=${cep}&nVlPeso=1&nCdFormato=1&nVlComprimento=14&nVlAltura=9&nVlLargura=18&nVlDiametro=0&sCdMaoPropria=n&nVlValorDeclarado=0&sCdAvisoRecebimento=n&nCdServico=04014,04510&nVlDiametro=0&StrRetorno=xml`);
    console.log(frete);

    return res.status(200).json(frete.data);
  } catch (error: any) {
    console.log(error);
    return res.status(500).json({ error: "Erro interno" });
  }

}