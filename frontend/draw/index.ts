import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { RefObject } from "react";

type Shape = {
    type: "rect",
    x: number,
    y: number,
    width: number,
    height: number
}

export async function initDraw(canvas: HTMLCanvasElement, roomId: string, socket: WebSocket) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let existingShapes: Shape[] = await getExistingShapes(roomId);


    ctx.strokeStyle = "red";
    socket.onmessage = (e) => {
        const message = JSON.parse(e.data);

        if (message.type == "chat") {
            const parsedShape = JSON.parse(message.message);
            existingShapes.push(parsedShape);
            clearCanvas(existingShapes, canvas, ctx);


        }
    }


    clearCanvas(existingShapes, canvas, ctx);
    let clicked = false;
    let startX = 0;
    let startY = 0;
    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
    })


    canvas.addEventListener("mouseup", (e) => {
        clicked = false;
        const width = e.clientX - startX;
        const height = e.clientY - startY;
        const shape: Shape = {
            type: "rect",
            height,
            width,
            x: startX,
            y: startY
        }
        existingShapes.push(shape);
        socket.send(JSON.stringify({
            type: "chat",
            message: JSON.stringify(shape),
            roomId
        }));
    })

    canvas.addEventListener("mousemove", (e) => {
        if (clicked) {
            const width = e.clientX - startX;
            const height = e.clientY - startY;
            clearCanvas(existingShapes, canvas, ctx);
            ctx.strokeRect(startX, startY, width, height);
        }
    })
}

function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    existingShapes.map((shape) => {
        if (shape.type == "rect") {
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
    })
}

async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = res.data.messages;

    const shapes = messages.map((ele: { message: string }) => {
        const message = JSON.parse(ele.message);
        return message;
    })

    return shapes;
}