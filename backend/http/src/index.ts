import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";
import { verifyJwt } from "./middlewares/middlewares.js";
import { RoomSchema, SigninSchema, SignupSchema } from "@kadm/draw-common";
import { prisma } from "@backend/db";

const app = express();

app.use(express.json());
const port = 4000;

app.get("/", (req, res) => {
    res.json({message: "hello"});
})

app.post("/signup", async (req, res) => {
    const parsedData = SignupSchema.safeParse(req.body);
    if(!parsedData.success){
        return res.json({message: "Incorrect inputs"});
    }

    const data = parsedData.data;
    try {
        const user = await prisma.user.create({
            data:{
                email: data.username,
                password: data.password,
                name: data.name
            }
        })
    
        res.json({userId: user.id});
    
    } catch (e) {
        console.log(e);
        res.json({message: e});    
    }
})

app.post("/signin", async (req, res) => {

    const parsedData = SigninSchema.safeParse(req.body);
    if(!parsedData.success){
        return res.json({message: "Incorrect inputs"});
    }

    const data = parsedData.data;

    const user = await prisma.user.findFirst({
        where: {
            email: data.username,
            password: data.password
        }
    })

    if(!user) return res.json({message: "Not Authorized"}); 


    const userId = user.id;
    const token = jwt.sign({userId}, JWT_SECRET);
    res.json({token});
})

app.post("/room", verifyJwt, async (req, res) => {
    const parsedData = RoomSchema.safeParse(req.body);
    if(!parsedData.success){
        return res.json({message: "Incorrect inputs"});
    }

    const data = parsedData.data;

    const userId = req.userId || "";
    try{

        const room = await prisma.room.create({
            data:{
                name: data.name,
                adminId: userId
            }
        })
        
        res.json({roomId: room.id});
    } catch(e){
        res.json({message: "Error"});
    }
})

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
})