import mongoose from 'mongoose';

const ClienteSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true
    },
    cpf: {
        type: String,
        required: true,
        unique: true
    },
    endereco: {
        type: String,
    },

    telefone: {
        type: String,
    }
}
);


export const ClienteModel = mongoose.model("clientes", ClienteSchema);