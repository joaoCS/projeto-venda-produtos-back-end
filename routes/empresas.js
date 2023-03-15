import express from 'express';
import { verifyToken } from './users.js';
import { EmpresaModel } from '../models/Empresas.js';

const router = express.Router();

router.post('/cadastrar', verifyToken, async (req, res) => {
    
    const { razaoSocial, cnpj, endereco, telefone } = req.body;

    const empresa = await EmpresaModel.findOne({ cnpj });

    if(empresa) {
        console.log(empresa)
        res.status(403);
        return res.json({message: "Empresa ja cadastrada!"});
    }

    try{
        const newCompany = new EmpresaModel({ razaoSocial, cnpj, endereco, telefone });
        await newCompany.save();

        return res.json({ message: "Empresa cadastrada com sucesso!" });
    }
    catch(err) {
        res.status(401);
        return res.json({ message: "Erro ao cadastrar empresa!" });
    }
});

export {router as empresaRouter};