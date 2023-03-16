import mongoose from 'mongoose';

const ProdutoSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
    },
    valorCompra: {
        type: Number,
        required: true,
    },
    valorVenda: {
        type: Number,
        required: true
    },
    categoria: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "categorias",
        required: true
    }
                
});

export const ProdutoModel = mongoose.model("produtos", ProdutoSchema);