import mongoose from "mongoose";

const ProdutoSchema = new mongoose.Schema({
    _id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    nome: {
        type: String,
        required: true
    },
    quantidade: {
        type: Number,
        required: true
    },
    valorVenda : {
        type: Number,
        required: true
    },
    
});
 

const ListaVendaSchema = new mongoose.Schema({
    produtos: [ProdutoSchema],

    cliente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "clientes",
        required: true
    },

    totalPagar: {
        type: Number,
        required: true
    }

});

export const ListaVendaModel = mongoose.model('listaVendas', ListaVendaSchema);