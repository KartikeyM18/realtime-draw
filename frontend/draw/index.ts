import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { MutableRefObject } from "react";

export type Tool = "rect" | "circle" | "line" | "pencil" | "pointer";

export type Shape = {
    type: Tool;
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    points?: { x: number; y: number }[];
};

export async function initDraw(
    canvas: HTMLCanvasElement, 
    roomId: string, 
    socket: WebSocket, 
    selectedToolRef: MutableRefObject<Tool>,
    selectedColorRef: MutableRefObject<string>
) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return { cleanup: () => {}, triggerClear: () => {} };

    
    const resizeCanvas = () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        renderCanvas(existingShapes, canvas, ctx);
    };
    window.addEventListener("resize", resizeCanvas);
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let existingShapes: Shape[] = await getExistingShapes(roomId);
    let currentPoints: { x: number, y: number }[] = [];

    
    const messageHandler = (e: MessageEvent) => {
        const message = JSON.parse(e.data);
        if (message.type === "chat") {
            const parsedShape = JSON.parse(message.message);
            existingShapes.push(parsedShape);
            renderCanvas(existingShapes, canvas, ctx);
        } else if (message.type === "clear") {
            existingShapes = [];
            renderCanvas(existingShapes, canvas, ctx);
        }
    };
    socket.addEventListener("message", messageHandler);

    
    renderCanvas(existingShapes, canvas, ctx);

    
    let clicked = false;
    let startX = 0;
    let startY = 0;

    const onMouseDown = (e: MouseEvent) => {
        if (selectedToolRef.current === "pointer") return;
        clicked = true;
        startX = e.clientX;
        startY = e.clientY;
        
        if (selectedToolRef.current === "pencil" ) {
            currentPoints = [{ x: startX, y: startY }];
        }
    };

    const onMouseUp = (e: MouseEvent) => {
        if (!clicked) return;
        clicked = false;
        
        const width = e.clientX - startX;
        const height = e.clientY - startY;

        let shape: Shape | null = null;

        
        if (selectedToolRef.current === "pencil") {
            if (currentPoints.length > 1) {
                shape = {
                    type: selectedToolRef.current,
                    x: startX,
                    y: startY,
                    width: 0, 
                    height: 0,
                    color: selectedColorRef.current,
                    points: [...currentPoints]
                };
            }
            currentPoints = []; 
        } 
        
        else if (Math.abs(width) > 2 || Math.abs(height) > 2) {
            shape = {
                type: selectedToolRef.current,
                x: startX,
                y: startY,
                width,
                height,
                color: selectedColorRef.current
            };
        }

        if (shape) {
            existingShapes.push(shape);
            socket.send(JSON.stringify({
                type: "chat",
                message: JSON.stringify(shape),
                roomId
            }));
        }
        
        renderCanvas(existingShapes, canvas, ctx);
    };

    const onMouseMove = (e: MouseEvent) => {
        if (!clicked) return;
        
        const width = e.clientX - startX;
        const height = e.clientY - startY;

        
        if (selectedToolRef.current === "pencil") {
            currentPoints.push({ x: e.clientX, y: e.clientY });
        }

        
        renderCanvas(existingShapes, canvas, ctx);
        
        
        ctx.strokeStyle = selectedColorRef.current;
        ctx.lineWidth = 2;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();

        if (selectedToolRef.current === "rect") {
            ctx.strokeRect(startX, startY, width, height);
        } else if (selectedToolRef.current === "circle") {
            const radiusX = Math.abs(width) / 2;
            const radiusY = Math.abs(height) / 2;
            const centerX = startX + width / 2;
            const centerY = startY + height / 2;
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
            ctx.stroke();
        } else if (selectedToolRef.current === "line") {
            ctx.moveTo(startX, startY);
            ctx.lineTo(e.clientX, e.clientY);
            ctx.stroke();
        } else if (selectedToolRef.current === "pencil") {
            ctx.moveTo(currentPoints[0].x, currentPoints[0].y);
            for (let i = 1; i < currentPoints.length; i++) {
                ctx.lineTo(currentPoints[i].x, currentPoints[i].y);
            }
            ctx.stroke();
        }
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mouseup", onMouseUp);
    canvas.addEventListener("mousemove", onMouseMove);

    
    const triggerClear = () => {
        existingShapes = [];
        renderCanvas(existingShapes, canvas, ctx);
        
        socket.send(JSON.stringify({ type: "clear", roomId })); 
    };

    return {
        cleanup: () => {
            window.removeEventListener("resize", resizeCanvas);
            socket.removeEventListener("message", messageHandler);
            canvas.removeEventListener("mousedown", onMouseDown);
            canvas.removeEventListener("mouseup", onMouseUp);
            canvas.removeEventListener("mousemove", onMouseMove);
        },
        triggerClear
    };
}


function renderCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    existingShapes.forEach((shape) => {
        ctx.strokeStyle = shape.color;
        ctx.lineWidth = 2; 
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        ctx.beginPath();

        if (shape.type === "rect") {
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === "circle") {
            const radiusX = Math.abs(shape.width) / 2;
            const radiusY = Math.abs(shape.height) / 2;
            const centerX = shape.x + shape.width / 2;
            const centerY = shape.y + shape.height / 2;
            ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, 2 * Math.PI);
            ctx.stroke();
        } else if (shape.type === "line") {
            ctx.moveTo(shape.x, shape.y);
            ctx.lineTo(shape.x + shape.width, shape.y + shape.height);
            ctx.stroke();
        } else if ((shape.type === "pencil") && shape.points) {
            if (shape.points.length > 0) {
                ctx.moveTo(shape.points[0].x, shape.points[0].y);
                for (let i = 1; i < shape.points.length; i++) {
                    ctx.lineTo(shape.points[i].x, shape.points[i].y);
                }
                ctx.stroke();
            }
        }
    });
}

async function getExistingShapes(roomId: string) {
    const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`);
    const messages = res.data.messages;

    return messages.map((ele: { message: string }) => {
        return JSON.parse(ele.message);
    });
}