import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';

import { userRouter } from './routes/users.js';
import { clienteRouter } from './routes/clientes.js';
import { categoriaRouter } from './routes/categorias.js';
import { empresaRouter } from './routes/empresas.js';
import { produtoRouter } from './routes/produtos.js';
import { vendaRouter } from './routes/vendas.js';



const app = express();


//app.use(express.json());
app.use(cors());

app.use(bodyParser.json());

app.use('/auth', userRouter);
app.use('/clientes', clienteRouter);
app.use('/categorias', categoriaRouter);
app.use('/empresas', empresaRouter);
app.use('/produtos', produtoRouter);
app.use('/vendas/', vendaRouter);

mongoose.connect("mongodb+srv://joao:this@cluster0.zpfz0.mongodb.net/sistemavendas?retryWrites=true&w=majority");

app.listen(3001, ()=> console.log("Servidor iniciado!"));
