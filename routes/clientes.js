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

router.get('/', async (req, res)=>{
    
    try {

        const clientes = await ClienteModel.find({}); // retorna todos os clientes

        return res.json(clientes);

    } catch (error) {
        res.status(500);
        return res.json(error);
    }
});

export { router as clienteRouter }