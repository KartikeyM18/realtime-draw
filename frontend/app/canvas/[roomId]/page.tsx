import { RoomCanvas } from "@/components/RoomCanvas";


export default async function CanvasRoom({params}: {params: Promise<{roomId: string}>}){
    const roomId = (await params).roomId;

    
    return <RoomCanvas room={roomId} />
}