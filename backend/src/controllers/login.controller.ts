
import { Request, Response } from "express";
import { autenticarUsuario } from "../services/login.service";


export const login = async (req: Request, res: Response) => {
  console.log('teste');
  const { email, senha } = req.body;

  if (!email || !senha) {
    return res.status(400).json({ message: "Email e senha são obrigatórios." });
  }

  try {
    const resultado = await autenticarUsuario(email, senha);
    return res.status(200).json(resultado);
  } catch (err: any) {
    return res.status(401).json({ message: err.message });
  }

};

