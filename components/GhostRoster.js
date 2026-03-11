"use client";

import { useState,useEffect } from "react";
import { db } from "../lib/firebase";
import { collection,onSnapshot } from "firebase/firestore";

const GREEN="#00563F";
const GOLD="#CFB53B";

export default function GhostRoster(){

const [players,setPlayers]=useState([]);

const [roster,setRoster]=useState({
LW:["","","","",""],
C:["","","","",""],
RW:["","","","",""],
LD:["","","","",""],
RD:["","","","",""],
G:["","","",""]
});

const [scholarships,setScholarships]=useState({});

useEffect(()=>{

const unsub=onSnapshot(collection(db,"players"),snap=>{

setPlayers(
snap.docs.map(doc=>({
id:doc.id,
...doc.data()
}))
);

});

return ()=>unsub();

},[]);

function updateSlot(position,index,name){

const updated={...roster};

updated[position][index]=name;

setRoster(updated);

}

function updateScholarship(name,value){

setScholarships({
...scholarships,
[name]:parseFloat(value)||0
});

}

function getTotalScholarships(){

return Object.values(scholarships)
.reduce((a,b)=>a+b,0);

}

function getRemaining(){

return (18-getTotalScholarships()).toFixed(2);

}

function getClassCount(){

const counts={
SR:0,
JR:0,
SO:0,
FR:0
};

players.forEach(p=>{

if(!p.classYear) return;

counts[p.classYear]=(counts[p.classYear]||0)+1;

});

return counts;

}

const classCounts=getClassCount();

return(

<div style={{
background:GREEN,
minHeight:"100vh",
padding:30,
color:"#000",
fontFamily:"Arial"
}}>

<h1 style={{
color:GOLD,
textAlign:"center",
marginBottom:30
}}>
Ghost Roster
</h1>

<div style={{display:"flex",gap:30}}>

{/* Roster grid */}

<div style={{
background:"#ddd",
padding:20,
flex:3
}}>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(6,1fr)",
gap:10
}}>

{["LW","C","RW","LD","RD","G"].map(pos=>(

<div key={pos}>

<div style={{
background:"#000",
color:"#fff",
textAlign:"center",
padding:5,
fontWeight:"bold"
}}>
{pos}
</div>

{roster[pos].map((player,i)=>(

<input
key={i}
value={player}
placeholder="Player"
onChange={e=>updateSlot(pos,i,e.target.value)}
style={{
width:"100%",
padding:6,
border:"1px solid #999"
}}
/>

))}

</div>

))}

</div>

</div>

{/* Right side panel */}

<div style={{
background:"#ddd",
padding:20,
flex:1
}}>

<div style={{marginBottom:20}}>

<h3>Scholarship Count</h3>

<div style={{
background:"#fff",
padding:10,
fontSize:18,
fontWeight:"bold"
}}>
{getTotalScholarships().toFixed(2)}
</div>

</div>

<div style={{marginBottom:20}}>

<h3>Money Remaining</h3>

<div style={{
background:"#fff",
padding:10,
fontSize:18,
fontWeight:"bold"
}}>
{getRemaining()}
</div>

</div>

<div style={{marginBottom:20}}>

<h3>Roster Count</h3>

<div style={{
background:"#fff",
padding:10,
fontSize:18,
fontWeight:"bold"
}}>
{players.length}
</div>

</div>

<div style={{marginBottom:20}}>

<h3>Class Count</h3>

<div>SR = {classCounts.SR}</div>
<div>JR = {classCounts.JR}</div>
<div>SO = {classCounts.SO}</div>
<div>FR = {classCounts.FR}</div>

</div>

<h3>Scholarship Money</h3>

<div style={{maxHeight:300,overflow:"auto"}}>

{players.map(p=>(

<div key={p.id} style={{
display:"flex",
justifyContent:"space-between",
marginBottom:5
}}>

<div>{p.name}</div>

<input
type="number"
step="0.01"
value={scholarships[p.name]||""}
onChange={e=>updateScholarship(p.name,e.target.value)}
style={{width:70}}
/>

</div>

))}

</div>

<div style={{
marginTop:20,
fontWeight:"bold"
}}>
TOTAL: ${(getTotalScholarships()*1400).toLocaleString()}
</div>

</div>

</div>

</div>

);

}
