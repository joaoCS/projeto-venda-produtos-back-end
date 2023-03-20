import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const router = express.Router();

import { UserModel } from '../models/Users.js';

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

router.post('/createAdmin', async (req, res)=>{
    
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
        const user = await UserModel.findById(req.body.userId);
        
        res.json({ username: user.username });
    } 
    catch (err) {
        res.status(500);
        res.json({message: "Erro ao buscar username!"});
    }
});


export {router as userRouter};

