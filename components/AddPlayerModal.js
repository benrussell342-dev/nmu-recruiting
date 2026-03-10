"use client";

import { useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

const GREEN="#00563F";

export default function AddPlayerModal({onClose}){

const [form,setForm]=useState({
name:"",
team:"",
league:"",
position:"C",
height:"",
weight:"",
hand:"",
agent:"",
epLink:"",
instatLink:""
});

async function submit(){

if(!form.name){
alert("Player must have a name");
return;
}

await addDoc(collection(db,"players"),{

...form,

status:"Tracking",

matriculation:"",
scholarship:0,

reports:[],
notes:[],
contacts:[]

});

onClose();

}

return(

<div style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"rgba(0,0,0,0.6)",
display:"flex",
justifyContent:"center",
alignItems:"center"
}}>

<div style={{
background:"#fff",
padding:30,
width:450,
borderRadius:10
}}>

<h2 style={{color:GREEN}}>Add Player</h2>

<input placeholder="Name"
onChange={e=>setForm({...form,name:e.target.value})}/>

<input placeholder="Team"
onChange={e=>setForm({...form,team:e.target.value})}/>

<input placeholder="League"
onChange={e=>setForm({...form,league:e.target.value})}/>

<select
onChange={e=>setForm({...form,position:e.target.value})}>

<option>C</option>
<option>LW</option>
<option>RW</option>
<option>LD</option>
<option>RD</option>
<option>G</option>

</select>

<input placeholder="Height"
onChange={e=>setForm({...form,height:e.target.value})}/>

<input placeholder="Weight"
onChange={e=>setForm({...form,weight:e.target.value})}/>

<input placeholder="Hand"
onChange={e=>setForm({...form,hand:e.target.value})}/>

<input placeholder="Agent"
onChange={e=>setForm({...form,agent:e.target.value})}/>

<input placeholder="EliteProspects Link"
onChange={e=>setForm({...form,epLink:e.target.value})}/>

<input placeholder="InStat Link"
onChange={e=>setForm({...form,instatLink:e.target.value})}/>

<div style={{marginTop:20}}>

<button onClick={submit}>Add Player</button>

<button onClick={onClose}>Cancel</button>

</div>

</div>

</div>

);

}
