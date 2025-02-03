const exp=require('express');
const app=exp();
const conn=require('./conn');
const user=require('./user');
const message=require('./message');
conn();
app.use(exp.json());
const id="abc";
app.post('/name',async(req,res)=>{
    try{
       const id=req.body.mailid;
         const pass=req.body.password;
            const name=req.body.name;
            const data= user.create({mailid:id,password:pass,name:name});
            res.send(data);
    }
    catch(err){
        console.log(err);
    }
});

app.get('/names',async(req,res)=>{
    try{
      const data = await user.find();
      if(data.length>0){
        res.send(data);
      }
      else{
        res.send("no data found");
      }
    }
    catch(err){
        console.log(err);
    }
});
app.post('/message',async(req,res)=>{
try{
   await message.deleteMany();
   res.send("deleted");
}
catch(err){
    console.log(err);
}
}); 
app.get('/check',async(req,res)=>{
    try{
         const daat=await message.find();
        res.send(daat);
    }
    catch(err){
        console.log(err);
    }
});
app.post('/deletemsg',async(req,res)=>{
    const s="abc@gmail.com";
    const r="sohan@gmail.com";
    const msg="bhenkloda";
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
app.listen(3005,()=>{
    console.log('server is running');
});