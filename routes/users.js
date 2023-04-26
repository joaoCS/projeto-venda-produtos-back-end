import express from 'express';
import bcrypt from 'bcrypt';
import jwt, { verify } from 'jsonwebtoken';
import dotenv from "dotenv";


const router = express.Router();

import { UserModel } from '../models/Users.js';

dotenv.config();

const JWT_SECRET = process.env.SECRET;

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (token){
        jwt.verify(token, "secret", (err) => {
            if (err) {// token inválido
                res.sendStatus(403); 
                next();
            }
        });
        next();
    }
    else 
        res.sendStatus(401);
};

router.post('/createAdmin', async (req, res)=> {
    
    const { username, email, password } = req.body;

    const user = await UserModel.findOne({ username });

    if (user) {

        res.status(403);
        return res.json({ message: "Usuario ja existe!" });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new UserModel({ username, email, password: hashedPassword });

    await newUser.save();

    res.status(201);
    res.json({ message: "Usuario criado com sucesso!" });
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await UserModel.findOne({email});

    if(!user){
        res.status(401);
        return res.json({message: "Usuario nao cadastrado"});
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    
    if (!isPasswordValid){
        res.status(401);
        return res.json({message: "Senha incorreta!"});
    }
    
    const token = jwt.sign({ id: user._id }, "secret");

    return res.json({ token, userId: user._id, username: user.username });
});


router.get('/username', verifyToken, async (req, res) => {
    try {
        const user = await UserModel.findById(req.headers.userid);
        
        res.json({ username: user.username });
    } 
    catch (err) {
        res.status(500);
        res.json({message: "Erro ao buscar username!"});
    }
});

router.get('/user/:id', verifyToken, async (req, res) => {
    const { id } = req.params;
    if (!id) {
        res.status(500);
        return res.json({message: "Id do usuário não fornecido!"});
    }

    try {
        const user = await UserModel.findById(id);
        user.password = "";

        res.json(user);
    } 
    catch (err) {
        res.status(500);
        res.json({ message: "Erro ao buscar usuário!", err });    
    }
});

router.put('/edit', verifyToken, async (req, res) => {
    const { _id, username, email } = req.body;

    const user = await UserModel.findById(_id);

    if (!user) {
        res.status(500);
        return res.json({message: "Usuário não encontrado!"});
    }

    try {
        user.username = username;
        user.email = email;

        await user.save();

        res.json({message: "Dados atualizados com sucesso!"});
    } 
    catch (err) {
        res.status(500);
        return res.json({message: "Erro ao atualizar dados de usuário!"});
    }
});

router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    try{
        const user = await UserModel.findOne({ email });
        if (!user) {
            res.status(500);
            return res.json({ message: "Email não cadastrado!" });
        }

        const secret = JWT_SECRET + user.password;
        const token = jwt.sign({ email: user.email, id: user._id }, secret, { expiresIn: "5m" });

        const link = `localhost:3001/reset-password/${user._id}/${token}`;

        console.log(link);
        res.end();
    }
    catch(err) {
        res.json({ message: "Algo deu errado!" });
    }
});

export {router as userRouter};

