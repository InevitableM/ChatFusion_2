import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from './chat';
import { set } from "mongoose";

const socket = io.connect("http://localhost:3001");

function App() {
  const [usname, setusname] = useState("");
  const [allusers, setallusers] = useState([]);
 const [mail,setmail]=useState('');
    const [passwordm,setpassword]=useState('');
    const [reg,setred]=useState(false);
    const [name,setname]=useState('');
    const [log,setlog]=useState(false);
    const [users,setusers]=useState([]);
const login=async(e)=>{
e.preventDefault();
    try{
        const res=await fetch('http://localhost:3001/login',{
            method:'POST',
            headers: { 'Content-Type':'application/json' },
            body:JSON.stringify({mail:mail,passwordm:passwordm}),
             });
        if(res.ok){
            const data=await res.json();
            setusname(data);
            console.log(data);
            fetchmyusers();
            fetchallusers();
            setlog(true);
        }
        else{
            alert('login failed');
            setmail(''); setpassword('');
        }
       
    }
    catch(err){
        console.log(err);}
}
 const fetchallusers=async()=>{
  try{
   const resp= await fetch('http://localhost:3001/getallusers');
   if(resp.ok){
      const data=await resp.json();
      setallusers(data);
      console.log(data);
   }
  }
  catch(err){
    console.log(err);
  }
 }
const fetchmyusers=async()=>{
  try{
    console.log('this is ',mail);
  const resp=await fetch('http://localhost:3001/fetchmyusers',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({mail:mail}),
  })
  if(resp.ok){
    const data=await resp.json();
    setusers(data);
    console.log(data);
  }
  }
  catch(err){
    console.log(err);
  }
}
const register=async(e)=>{
    e.preventDefault();
    try{
const resp=await fetch('http://localhost:3001/register',{
    method:'post',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({mail:mail,passwordm:passwordm,name:name}),
});
if(resp.ok){
    alert('Registration Successful');
}
else{
    alert('Registration failed');
}
    }
    catch(err){
        console.log(err);
    }
}
  const connectuser=()=>{
    try{
      socket.emit('connectuser',mail);
    }catch(err){
      console.log(err);
    }
  }
  return (
    <div>
    {  
     log ? (
       <div>
         <h1>logged in</h1>
         {connectuser()}
        <Chat socket={socket} username={mail} name={usname} users={users} allusers={ allusers}/>
       </div>
    ) : (
      <div>
        <form onSubmit={login}>   
          <p>Login</p>
          <input 
            type="email" 
            required 
            placeholder="emailID" 
            onChange={(e) => setmail(e.target.value)} 
          />
          <input 
            type="password" 
            required
            placeholder="password" 
            onChange={(e) => setpassword(e.target.value)} 
          />
          <button type="submit">Login</button>
        </form>
        <button onClick={() => setred(!reg)}>Register</button>
        {
          reg && (
            <form onSubmit={register}>
              <input type="email" required placeholder="mail" onChange={(e) => setmail(e.target.value)} />
              <input type="password" required placeholder="password" onChange={(e) => setpassword(e.target.value)} />
              <input type="text" required placeholder="username" onChange={(e) => setname(e.target.value)} />
              <button type="submit">Register</button>
            </form>
          )
        }
      </div>
    )}
    </div>
  );
}

export default App;
