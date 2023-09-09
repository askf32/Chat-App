import express from 'express'
import {createServer, get} from 'http'
import {Server} from 'socket.io'
import path from 'path'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import Filter from 'bad-words'
import {generateMassages, generatedLocationMessage} from './utils/messages.js'
import { getUser, getUserRoom, addUser, removeUser } from './utils/users.js';


const app = express()

const server = createServer(app)
const io = new Server(server)

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const publicPath = path.join(__dirname,'./public')
app.use(express.static(publicPath))


// let count= 0;


io.on('connection',(socket)=>{

    socket.on('join',(options,callback)=>{
        const {error, user} = addUser({id: socket.id, ...options})

        if(error){
            callback(error)
        }


        socket.join(user.room)

        socket.emit('message', generateMassages('Admin','WELCOME!'))
        socket.broadcast.to(user.room).emit('message',generateMassages( 'Admin',`${user.username} has joined!`))
        io.to(user.room).emit('roomData',{
            room: user.room,
            users: getUserRoom(user.room)
        })
        callback()
    })

    

    socket.on('sendmessage',(message,callback)=>{
        const user = getUser(socket.id)
        
            const filter = new Filter()
            if(filter.isProfane(message)){
                return callback('Profanity is not allowed!')
            }
            io.to(user.room).emit('message', generateMassages(user.username,message) )
            callback()
        
        
    })
    socket.on('sendlocation',(cords, callback)=>{
        const user = getUser(socket.id)
        io.to(user.room).emit('locationMessage', generatedLocationMessage(user.username,`https://google.com/maps?q=${cords.latitude},${cords.longitude}`))
        callback()
        
    })

    // 'https://google.com/maps?q=latitude,longitude'
    
    // socket.emit('count', count)

    // socket.on('increment', ()=>{
    //     count++
    //     // socket.emit('count', count)  yeh signle user py update krta hai lakin dono user ko real time update krna hai tuo IO emit use kro
    //     io.emit('count',count)
    // })
    socket.on('disconnect', ()=>{
        
        const user = removeUser(socket.id)

        if (user) {
            io.to(user.room).emit('message', generateMassages('Admin',`${user.username} has left!`))
            io.to(user.room).emit('roomData',{
                room: user.room,
                users: getUserRoom(user.room)
            })
        }
        
    })
   
})


server.listen(3000,()=>{
    console.log("server is running")

})