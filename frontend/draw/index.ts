import { RefObject } from "react";

type Shape = {
    type: "rect",
    x: number,
    y: number,
    width: number,
    height: number
}

export function initDraw(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let existingShapes: Shape[] = [];

    ctx.strokeStyle = "red";
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
        existingShapes.push(...existingShapes,
            {
                type: "rect",
                height,
                width,
                x: startX,
                y: startY
            }
        )
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

function clearCanvas(existingShapes: Shape[], canvas: HTMLCanvasElement, ctx: CanvasRenderingContext2D){
    ctx.clearRect(0,0, canvas.width, canvas.height);
    existingShapes.map((shape)=>{
        if(shape.type == "rect"){
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        }
    })
}