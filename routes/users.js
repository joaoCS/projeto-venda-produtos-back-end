import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


const router = express.Router();

import { UserModel } from '../models/Users.js';

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

    return res.json({ token, userId: user._id });
});

export {router as userRouter};