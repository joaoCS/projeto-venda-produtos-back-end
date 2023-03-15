import mongoose from "mongoose";

const EmpresaSchema = new mongoose.Schema({
    razaoSocial: {
        type: String,
        required: true
    },
    cnpj: {
        type: String,
        required: true,
        unique: true
    },
    endereco: {
        type: String,
        required: true
    },
    
    telefone: {
        type: String,
        required: true
    },
});

export const EmpresaModel = mongoose.model("empresas", EmpresaSchema);