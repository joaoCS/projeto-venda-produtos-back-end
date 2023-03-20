import express from 'express';
import { ListaVendaModel } from '../models/ListaVenda.js';
import { VendaModel } from '../models/Venda.js';
import { verifyToken } from './users.js';

const router = express.Router();

router.post('/efetuarVenda', verifyToken, async (req, res) => {
    try {
        const { cliente, totalPagar, venda } = req.body;

        let produtos = [];
        for (let index = 0; index < venda.length; index++) {
           let produto = {}
           
            produto._id = venda[index]._id;
            produto.nome = venda[index].nome;
            produto.quantidade = venda[index].quantidade;
            produto.valorVenda = venda[index].valorVenda;   

            produtos.push(produto);
        }

        const listaVendaModel = new ListaVendaModel({  produtos, cliente: cliente._id, totalPagar });
        
        console.log(produtos);
        await listaVendaModel.save();

       return res.json({message: "Venda efetuada com sucesso!"});

    } catch (err) {
        res.status(500);
        return res.json({ message: "Erro ao efetuar venda!", err });
    }
});




export { router as vendaRouter };