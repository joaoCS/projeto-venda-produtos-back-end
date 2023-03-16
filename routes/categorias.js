import express from 'express';
import { CategoriaModel } from '../models/Categorias.js';
import { verifyToken } from './users.js';


const router = express.Router();

router.get('/', async (req, res)=>{
    
    try {

        const categorias = await CategoriaModel.find({}); // retorna todas as categorias

        return res.json(categorias);

    } catch (error) {
        res.status(500);
        return res.json(error);
    }
});

router.get('/busca/:categoriaId', async (req, res)=>{

    const categoriaId  = req.params.categoriaId;
    console.log(categoriaId);

    try {
        const categoria = await CategoriaModel.findOne({
            _id: categoriaId
        });

        return res.json({ categoria });
        
    } 
    catch (err) {
        res.status(500);
        return res.json({message: "erro ao buscar categoria", err});    
    }

});

router.post('/create', verifyToken, async (req, res) => {

    try {
        const categoria = new CategoriaModel(req.body);

        await categoria.save();

        return res.json({message: "Categoria criada com sucesso!"});

    }
    catch (err) {
        return res.json({ message: "Erro ao criar categoria!", err });
    }
});

export { router as categoriaRouter }