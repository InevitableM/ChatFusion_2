import { set } from "mongoose";
import React, { use } from "react";
import { useEffect, useState } from "react";

export default function Login(){
    const [mail,setmail]=useState('');
    const [passwordm,setpassword]=useState('');
    const [reg,setred]=useState(false);
    const [name,setname]=useState('');
    const [log,setlog]=useState(false);
const login=async(e)=>{
e.preventDefault();
    try{
        const res=await fetch('http://localhost:3001/login',{
            method:'POST',
            headers: { 'Content-Type': 'application/json' },
            body:JSON.stringify({mail:mail,passwordm:passwordm,name:"abc"}),
             });

        if(res.ok){
            console.log('lavde');
            setlog(true);
        }
        else{
            alert('login failed');
        }
        setmail(''); setpassword('');
    }
    catch(err){
        console.log(err);}

}
const register=async(e)=>{
    e.preventDefault();
    try{
const resp=await fetch('http://localhost:3001/register',{
    method:'POST',
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
    return(
    <div>
    {  
     log ? (<h1>logged in</h1>):(
   <div> <form  onSubmit={login}>   
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
        <button type="submit" >Login</button>
        </form>
        <button onClick={()=>setred(!reg)}>Register</button>
       {
        reg && (
          <form onSubmit={register}>
            <input tpye="email" required placeholder="mail" onChange={(e)=>setmail(e.target.value)}></input>
            <input type="password" required placeholder="password" onChange={(e)=>setpassword(e.target.value)}></input>
            <input type="text" required placeholder="username" onChange={(e)=>setname(e.target.value)}></input>
            <button type="submit">Register</button>
          </form>
        )
       }
       </div>
     )
}
      
    </div>
    );
}
