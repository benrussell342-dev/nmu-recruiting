"use client";

import { useState } from "react";
import { db } from "../lib/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function AddPlayerModal({ onClose }) {

const [name,setName] = useState("");
const [team,setTeam] = useState("");
const [league,setLeague] = useState("");
const [position,setPosition] = useState("C");

async function addPlayer(){

if(!name){
alert("Player must have a name");
return;
}

await addDoc(collection(db,"players"),{

name,
team,
league,
position,

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
background:"rgba(0,0,0,0.5)",
display:"flex",
justifyContent:"center",
alignItems:"center"
}}>

<div style={{
background:"#fff",
padding:30,
width:400,
borderRadius:8
}}>

<h2>Add Player</h2>

<input
placeholder="Name"
onChange={(e)=>setName(e.target.value)}
/>

<input
placeholder="Team"
onChange={(e)=>setTeam(e.target.value)}
/>

<input
placeholder="League"
onChange={(e)=>setLeague(e.target.value)}
/>

<select onChange={(e)=>setPosition(e.target.value)}>

<option>C</option>
<option>LW</option>
<option>RW</option>
<option>LD</option>
<option>RD</option>
<option>G</option>

</select>

<div style={{marginTop:20}}>

<button onClick={addPlayer}>
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
