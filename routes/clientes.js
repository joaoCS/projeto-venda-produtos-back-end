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

router.put('/edit', verifyToken, async (req, res) => {
    const { _id, nome, endereco, cpf, telefone } = req.body;

    let cliente = await ClienteModel.findOne({_id});

    if(!cliente){
        res.status(500);
        return res.json({message: "Cliente não existe!"});
    }

    try {
        cliente.nome = nome;
        cliente.endereco = endereco;
        cliente.cpf = cpf;
        cliente.telefone = telefone;

        await cliente.save();

        res.json({message: "Cliente alterado com sucesso!"});
    } 
    catch (err) {
        res.status(500);
        res.json({ message: "Erro ao editar cliente!" });
    }
});

router.delete('/delete', verifyToken, async (req, res) => {
    const { _id } = req.body.cliente;

    if (!_id) {

        res.status(500);
        return res.json({message: "Id de cliente não fornecido!"});
    }

    try {
        await ClienteModel.deleteOne({_id});
        res.json({message: "Cliente removido com sucesso!"});
    } 
    catch (err) {
        res.status(500);
        return res.json({message: "Erro ao remover cliente!", err});
    }
});

export { router as clienteRouter }