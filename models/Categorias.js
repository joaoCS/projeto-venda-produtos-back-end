import mongoose from 'mongoose';

const CategoriaSchema = new mongoose.Schema({
    nome: {
        type: String,
        required: true,
        unique: true
    },
});


export const CategoriaModel = mongoose.model('categorias', CategoriaSchema);