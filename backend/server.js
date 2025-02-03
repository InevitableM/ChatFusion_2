const express = require('express');
const cors = require('cors');
const http = require('http');
const path = require('path');
const { Server } = require('socket.io');
const database= require('./conn');
const user=require('./user');
const message=require('./message');
database();

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, 'build')));
const server = http.createServer(app);

app.use((req, res, next) => {
    res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
    res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
    next();
});

const io = new Server(server, {
    maxHttpBufferSize: 1e8,
    cors: {
        origin: "http://localhost:3000", 
        methods: ["GET", "POST"],
    },
});

io.on('connect', (socket) => {
   socket.on('connectuser',(usermail)=>{
    socket.join(usermail);
    console.log('user connected with mail',usermail);
   });
   socket.on('sendmsg',async(data)=>{
     console.log('receiver',data.receiver);
    socket.to(data.receiver).emit('recvmsg',data);
    storemessage(data);
  });
    socket.on('disconnect',()=>{
        console.log(`user with name ${socket.username} disconnected`);
    });
});

app.get('/getallusers',async(req,res)=>{
    console.log('getallusers');
    const resp=await user.find();
    if(resp){
        res.send(resp);
    }
    else{
        console.log('error');
    }
});

app.post('/login',async(req,res)=>{
    const {mail,passwordm}=req.body;
    const user1=await user.findOne({mailid:mail});
    if(user1){
        if(user1.password===passwordm){
          res.json(user1.name);
            console.log('login success');
        }else{
            res.status(400).send('Invalid password');
            console.log('Invalid password');
        }
    }
});

app.post('/register',async(req,res)=>{
    const {mail,passwordm,name}=req.body;
    const resp= await user.create({mailid:mail,password:passwordm,name:name});
    if(resp){
        res.send('success');
        console.log('registration success');    
    }
    else{
        console.log('error');
    }
});

const storemessage=async(data)=>{
try{let sender=data.usename;
let receiver=data.receiver;
let message1=data.message;
let image=data.img;
let video=data.vid;
const resp=await message.create({sender:sender,receiver:receiver,message:message1,image:image,video:video});
if(resp){
    console.log('message stored');
}
else{
console.log('error');}
}
catch(err){console.log(err);
 } 
}

app.post('/fetchmyusers',async(req,res)=>{
try{
    const {mail}=req.body;
const resp=await message.find({
    $or: [
        { sender: mail },
        { receiver: mail }
    ]
});
const users=new Set();
resp.forEach((msg)=>{
    if(msg.sender!==mail){
        users.add(msg.sender);
    }
    if(msg.receiver!==mail){
        users.add(msg.receiver);
    }
});
const usermaild=Array.from(users);
// res.send(Array.from(users));
const usernames=await user.find({mailid:{$in:usermaild}},{mailid:1,name:1});
console.log(usernames);
res.send(usernames);
}
catch(err){
    console.log(err);
}
});


app.post('/fetchchat',async(req,res)=>{
    const {mail, receiver}=req.body;
    console.log(mail,receiver);
    try{
    const resp = await message.find({
        $or: [
            { sender: mail, receiver: receiver },
            { sender: receiver, receiver: mail }
        ]
    });
    if(resp){
        res.send(resp);
    }
    else{
        console.log('error');
    }
}
catch(err){
    console.log(err);}
})

app.post('/deletemsg',async(req,res)=>{
    const s=req.body.sender;
    const r=req.body.receiver;
    const msg=req.body.message;
    try{
        const resp=await message.deleteOne({sender:s,receiver:r,message:msg});
        if(resp){
            res.send('deleted');
            console.log('deleted');
        }
        else{
            console.log('error');
        }
    }
    catch(err){
        console.log(err);
    }
})

server.listen(3001, () => {
    console.log('Server is running');
});