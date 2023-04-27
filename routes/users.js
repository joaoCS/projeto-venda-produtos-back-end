import express from 'express';
import bcrypt from 'bcrypt';
import jwt, { verify } from 'jsonwebtoken';
import dotenv from "dotenv";
import nodemailer from "nodemailer";

const router = express.Router();

import { UserModel } from '../models/Users.js';

dotenv.config();

const JWT_SECRET = process.env.SECRET;
const host = process.env.HOST;
const port = process.env.PORT;

export const verifyToken = (req, res, next) => {
    const token = req.headers.authorization;

    if (token){
        jwt.verify(token, JWT_SECRET, (err) => {
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
    


    const token = jwt.sign({ id: user._id }, JWT_SECRET);

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

        const link = `${host}/auth/reset-password/${user._id}/${token}`;

        
        
        var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "sistemavendasnoreply@gmail.com",
                pass: process.env.APP_KEY
            }
        });
        
        var mailOptions = {
            from: "sistemavendasnoreply@gmail.com",
            to: email,
            subject: "Redefinição de senha",
            text: link
        };

        const response = await transporter.sendMail(mailOptions);

        res.end();
    }
    catch(err) {
        res.json({ message: "Algo deu errado!" });
    }
});


router.get("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    
    const user = await UserModel.findOne({ _id: id });
    if (!user) {
        res.status(500);
        return res.json({ message: "Usuário não cadastrado!" });
    }

    const secret = JWT_SECRET + user.password;

    try{

        const verify = jwt.verify(token, secret);
        
        res.render("index", { email: verify.email });
    
    }
    catch(err) {
        res.status(500);
        return res.json({ message: "Não verificado" });
    }
    
    
});

router.post("/reset-password/:id/:token", async (req, res) => {
    const { id, token } = req.params;
    const { password } = req.body;

    const user = await UserModel.findOne({ _id: id });
    if (!user) {
        res.status(500);
        return res.json({ message: "Usuário não cadastrado!" });
    }

    const secret = JWT_SECRET + user.password;

    try{

        const verify = jwt.verify(token, secret);
        
        const hashedPassword = await bcrypt.hash(password, 10);
        
        await UserModel.updateOne(
            {
                _id: id,
            },
            {
                $set: {
                    password: hashedPassword
                }
            }
        );

        res.json({ message: "Senha atualizada com sucesso!" });
    
    }
    catch(err) {
        res.status(500);
        return res.json({ message: "Algo deu errado!" });
    }
    
    
});

export {router as userRouter};

