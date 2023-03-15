import express from 'express';
import { CategoriaModel } from '../models/Categorias.js';
import { verifyToken } from './users.js';


const router = express.Router();

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