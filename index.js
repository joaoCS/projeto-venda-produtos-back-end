
// projeto hospedado em: projeto-venda-produtos-back-end-production.up.railway.app


import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

import { userRouter } from './routes/users.js';
import { clienteRouter } from './routes/clientes.js';
import { categoriaRouter } from './routes/categorias.js';
import { empresaRouter } from './routes/empresas.js';
import { produtoRouter } from './routes/produtos.js';
import { vendaRouter } from './routes/vendas.js';

dotenv.config();
const app = express();


//app.use(express.json());
app.use(cors());

app.set("view engine", "ejs");

app.use(bodyParser.json());

app.use('/auth', userRouter);
app.use('/clientes', clienteRouter);
app.use('/categorias', categoriaRouter);
app.use('/empresas', empresaRouter);
app.use('/produtos', produtoRouter);
app.use('/vendas/', vendaRouter);

mongoose.connect(process.env.MONGODB_CONNECTION_STRING);

app.listen(process.env.PORT, ()=> console.log("Servidor iniciado!"));
