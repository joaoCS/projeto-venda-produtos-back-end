import express from 'express';

const router = express.Router();
import { ClienteModel } from '../models/Clientes.js';
import { verifyToken } from './users.js'

router.post('/create', verifyToken, async (req, res) => {
    const { nome, cpf, endereco, telefone } = req.body;

    try{
        const cliente = new ClienteModel(req.body);
        await cliente.save();

        return res.json({message: "Cliente cadastrado com sucesso!"});

    }
    catch(err) {

        return res.json({message: "Cliente cadastrado com sucesso!"});

    }
});



export { router as clienteRouter }