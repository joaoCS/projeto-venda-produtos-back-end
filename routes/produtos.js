import express from 'express';
import { ProdutoModel } from '../models/Produtos.js';
import { CategoriaModel } from '../models/Categorias.js';
import { verifyToken } from './users.js';

const router = express.Router();

router.post('/create', verifyToken, async (req, res) => {

    try {
        const produto = new ProdutoModel(req.body);

        await produto.save();

        return res.json({message: "Produto cadastrado com sucesso!"});
    }
    catch (err) {
        res.status(500);
        return res.json({message: "Erro ao cadastrar produto!", err});    
    }

    return res.end();
});

router.get('/', verifyToken, async (req, res) => {
    try {
        const produtos = await ProdutoModel.find({});// retorna todos os produtos

        let newProdutos = [];

        for (var i = 0; i < produtos.length; i++) {
            const categoria = await CategoriaModel.findById(produtos[i].categoria);
            
            newProdutos.push({ 
                _id: produtos[i]._id, 
                nome: produtos[i].nome, 
                valorCompra: produtos[i].valorCompra,
                valorVenda: produtos[i].valorVenda,
                categoria
            });
        }

        return res.json(newProdutos);

    } catch (error) {
        res.status(500);
        return res.json(error);
    }

});


export { router as produtoRouter }