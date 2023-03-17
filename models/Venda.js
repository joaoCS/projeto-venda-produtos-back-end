import mongoose from "mongoose";

const VendaSchema = new mongoose.Schema({
    produto: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "produtos",
            required: true,
        },
    quantidade: {
        type: Number,
        required: true
    }

});

export const VendaModel = mongoose.model('vendas', VendaSchema);