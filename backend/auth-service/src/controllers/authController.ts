import { Request , Response } from "express";
import bcrypt from 'bcrypt'
import { User } from "../models/User";
import { generateToken } from '../../../utils/jwtUtils'

export const register = async (req:Request , res:Response) => {
    const {username , email , password} = req.body
    try{
        const hashed = await bcrypt.hash(password , 10)
        const user = await User.create({username , email ,password_hash : hashed })
        res.status(201).json({username : user.username , email : user.email})
    } catch (error) {
        res.status(404).json({error : 'Email already exists'})
    }
}

export const login = async (req : Request , res : Response) => {
    const {email , password} = req.body
    const user = await User.findOne({where : {email}})
    if (!user || !(await bcrypt.compare(password , user.password_hash))) {
        return res.status(404).json('Invalid Credential')
    }
    const token = generateToken(user.id)
    res.json({ user_id : user.id , email : user.email , token})
}

export const getUserByEmail = async (req : Request , res : Response) => {
    const {email} = req.body
    
    const user = await User.findOne({where: {email : email as string}})
    if (!user) {
        return res.status(404).json({error : 'User not found'})
    }
    res.json({user_id : user.id})
}