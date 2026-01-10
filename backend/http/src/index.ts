import express from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "./config.js";
import { verifyJwt } from "./middlewares/middlewares.js";

const app = express();

app.use(express.json());
const port = 4000;

app.get("/", (req, res) => {
    res.json({msg: "hello"});
})

app.post("/signup", (req, res) => {
    res.json({userId: "1"});
})

app.get("/signin", (req, res) => {
    const userId = req.userId;
    const token = jwt.sign({userId}, JWT_SECRET);
    res.json({token});
})

app.post("/room", verifyJwt, (req, res) => {
    res.json({roomId: 1});
})

app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
})