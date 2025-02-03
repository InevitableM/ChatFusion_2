import React, { useState, useEffect, useRef } from "react";
import "./App.css";
import { set } from "mongoose";

function Chat({ name,username, socket,users ,allusers}) {
  const [msg, setmsg] = useState("");
  const [showmessage, setshowmessage] = useState([]);
  const [img, setimg] = useState("");
  const [vid, setvid] = useState("");
  const [receiver,setreceiver]=useState('');
  const [chats,setchats]=useState([]);
  const [deletedMessages, setDeletedMessages] = useState(null);
  const [s,sets]=useState(false);
  const [dd,setdd]=useState([]);
  const sendmessage = async () => {
    if((msg.length === 0 && img.length === 0) && vid.length === 0){
        alert("Please enter a message or select an image to send");
        return;
    }
    if(!checkuser()){
      alert('user not found,Please add user');return;
    }
    addmyuser();
    const data = {
      usename: username,
      receiver:receiver,
      message: msg,
      img: img,
      vid: vid,
      sentbyMe: true,
    };
    setmsg('');
    setimg('');
    setvid('');

    await socket.emit("sendmsg", data);
    setshowmessage((prevMessages) => [...prevMessages, { ...data, sentbyMe: true,receiver:receiver,sender:username }]);
  };
  const fetchchat=async()=>{
    try{
   const resp=await fetch('http://localhost:3001/fetchchat',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({mail:username,receiver:receiver}),
   });
   if(resp.ok){
    const data=await resp.json();
    setchats(data);
    console.log(data);
   }
    }
    catch(err){
      console.log(err);
    }
  }
useEffect(()=>{
  fetchchat();
},[receiver,username]);

  useEffect(() => {
    const handleReceiveMessage = (data) => {
      setshowmessage((prevMessages) => [
        ...prevMessages,
        { ...data, sentbyMe: data.username === username },
      ]);
    };
    socket.on("recvmsg", handleReceiveMessage);
    return () => {
      socket.off("recvmsg", handleReceiveMessage);
    };
  }, [username, socket,receiver]);

  const image = (e) => {
    const file = e.target.files[0];
    if (!file) {
      alert("Please select an image to send");
    }
      const reader = new FileReader();
      reader.onload = () => {
        const data= reader.result;
        setimg(data);
        console.log(data);
      };
      reader.readAsDataURL(file);
     e.target.value = '';
  };
  const video = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result;
        setvid(base64);
      };
      reader.readAsDataURL(file);
      e.target.value='';
    }
  };
const checkuser=()=>{
 for(let i=0;i<allusers.length;i++){
   if(allusers[i].mailid===receiver){
     return true;
   }
 }
  console.log('user not found');
}
const addmyuser=async()=>{
  for(let i=0;i<users.length;i++){
    if(users[i].mailid===receiver){
      return;
    }
  }
  users.push({mailid:receiver,name:receiver});
}
const deletemsg=()=>{
  const id= deletedMessages;
  console.log(deletedMessages);
  const data=showmessage.filter((value,index)=>index!=id);
  setshowmessage(data);
  try{
  const resp=fetch('http://localhost:3001/deletemsg',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({sender:dd.usename,receiver:dd.receiver,message:dd.message})
  })
  if(resp){
    alert('deleted');
  }
  else{
    alert('error');
  }
  }
  catch(err){
console.log(err);
  };
  setDeletedMessages(null);
  sets(false);
  setdd([]);
}

  return (
    <div className="div">
      <div className="chat-header">
        <p>
          <strong>User:{name}</strong> 
        </p>
        <h3>new chat</h3>
       <input type="email" placeholder="enter mail ID for new Chat"required onChange={(e)=>setreceiver(e.target.value)}/>
       {
          users.map((value,index)=>(
            <div key={index} onClick={()=>setreceiver(value.mailid) }>
            <p className="chat-user">{value.name}</p>
            </div>
          ))
       }
      </div>
      <div className="container">
       <div className="chatbox">
    {
      chats.map((value,index)=>(
      <div key={index} className={
        value.sender === username ? "message-container sent":"message-container received"
      }
      >
      <p className="message-text">{value.message}</p>
      {
        value.image &&
        (
          <img src={value.image}
          alt="this is a image"
          className="message-image"/>
        )
      }
      {
        value.video && (
          <video src={value.video}
          alt="video"
          className="message-image"
          controls
         />
        )
      }
      </div>
      ))
    }
  {showmessage
  .filter((value)=>(value.receiver===receiver && value.sender===username) || (value.receiver===username && value.sender===receiver))
  .map((value, index) => {
      return (
        <div
          key={index}
          className={`message-container ${value.sentbyMe ? "sent" : "received"} ${
            deletedMessages === index ? "selected" : ""
          }`}
          onClick={() => { setDeletedMessages(index); sets(!s); setdd(value); }}
        >
          <p className="message-text" >{value.message}</p>
          {value.img && (
            <img
              src={value.img}
              alt="received"
              className="message-image"
            />
          )}
          {
            value.vid && (
           <video
           src={value.vid}
            alt="received"
            className="message-image"
            controls
            onLoadedMetadata={(e)=>e.target.play()}
           />
            )
          }
        </div>
      );})}
  {
    deletedMessages !== null && s===true && (
      <button  className=" delete-button" onClick={deletemsg}>Delete</button>
    )
  }

</div>
        <div className="entermessage">
          <input
            type="text"
            className="chatfoot"
            value={msg}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendmessage();
              }
            }
          }
            placeholder="Enter message"
            onChange={(event) => {
              setmsg(event.target.value);
            }
          }
          />
          <button onClick={sendmessage}>Send</button>
          <input type="file" accept="image/*" className="input" onChange={image}/>
          <input type ="file" accpet="video/*" className="input " onChange={video} />
        </div>
      
      </div>
    </div>
  );
}

export default Chat;
