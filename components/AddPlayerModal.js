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
position:"C"
});

async function submit(){

await addDoc(collection(db,"players"),{

name:form.name,
team:form.team,
league:form.league,
position:form.position,

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
width:400,
borderRadius:10
}}>

<h2 style={{color:GREEN}}>
Add Player
</h2>

<input

placeholder="Name"

onChange={e=>setForm({...form,name:e.target.value})}

/>

<input

placeholder="Team"

onChange={e=>setForm({...form,team:e.target.value})}

/>

<input

placeholder="League"

onChange={e=>setForm({...form,league:e.target.value})}

/>

<select

onChange={e=>setForm({...form,position:e.target.value})}

>

<option>C</option>
<option>LW</option>
<option>RW</option>
<option>LD</option>
<option>RD</option>
<option>G</option>

</select>

<div style={{marginTop:20}}>

<button onClick={submit}>
Add Player
</button>

<button onClick={onClose}>
Cancel
</button>

</div>

</div>

</div>

);

}
