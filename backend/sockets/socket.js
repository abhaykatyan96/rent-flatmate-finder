import Chat from "../models/Chat.js";

const socketHandler = (io) => {

    io.on("connection",(socket)=>{

        console.log("User Connected",socket.id);

        socket.on("join",room=>{
            socket.join(room);
        });

        socket.on("sendMessage", async (data) => {

            const chat = await Chat.create({
                sender: data.sender,
                receiver: data.receiver,
                listing: data.listing,
                message: data.message
            });

            const populated = await Chat.findById(chat._id)
                .populate("sender", "name")
                .populate("receiver", "name");

            io.to(data.listing).emit("receiveMessage", populated);
        });

        socket.on("disconnect",()=>{

            console.log("Disconnected");

        });

    });

};

export default socketHandler;