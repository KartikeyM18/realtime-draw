import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";
import { verifyJwt } from "./middlewares/middlewares.js";
import { RoomSchema, SigninSchema, SignupSchema } from "@kadm/draw-common";

const app = express();

app.use(express.json());
const port = 4000;

app.get("/", (req, res) => {
    res.json({msg: "hello"});
})

app.post("/signup", (req, res) => {
    const data = SignupSchema.safeParse(req.body);
    if(!data.success){
        return res.json({msg: "Incorrect inputs"});
    }

    res.json({userId: "1"});
})

app.get("/signin", (req, res) => {

    const data = SigninSchema.safeParse(req.body);
    if(!data.success){
        return res.json({msg: "Incorrect inputs"});
    }

    const userId = req.userId;
    const token = jwt.sign({userId}, JWT_SECRET);
    res.json({token});
})

app.post("/room", verifyJwt, (req, res) => {
    const data = RoomSchema.safeParse(req.body);
    if(!data.success){
        return res.json({msg: "Incorrect inputs"});
    }

    res.json({roomId: 1});
})

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
})