export default async function ChatRoom({params}: {params: Promise<{ name: string }>}){
    const {name} = await params;
    
    return <div>
        {name} world
    </div>
}