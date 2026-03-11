"use client";

import { useState,useEffect } from "react";
import { db } from "../lib/firebase";
import { collection,onSnapshot } from "firebase/firestore";

const GREEN="#00563F";
const GOLD="#CFB53B";

const CLASS_COLORS={
FR:"#00ff00",
SO:"#4f83cc",
JR:"#ffff00",
SR:"#ff0000",
NEED:"#ff00ff"
};

export default function GhostRoster({onClose}){

const [players,setPlayers]=useState([]);

const [slots,setSlots]=useState({
LW:["","","","",""],
C:["","","","",""],
RW:["","","","",""],
LD:["","","","",""],
RD:["","","","",""],
G:["","","",""]
});

const [scholarships,setScholarships]=useState({});
const [money,setMoney]=useState({});

useEffect(()=>{

const unsub=onSnapshot(collection(db,"players"),(snap)=>{

setPlayers(
snap.docs.map(doc=>({
id:doc.id,
...doc.data()
}))
);

});

return ()=>unsub();

},[]);

function updateSlot(position,index,value){

const updated={...slots};
updated[position][index]=value;

setSlots(updated);

}

function updateScholarship(name,value){

setScholarships({
...scholarships,
[name]:parseFloat(value)||0
});

}

function updateMoney(name,value){

setMoney({
...money,
[name]:parseInt(value)||0
});

}

function getScholarshipTotal(){

return Object.values(scholarships)
.reduce((a,b)=>a+b,0);

}

function getRosterCount(){

let count=0;

Object.values(slots).forEach(arr=>{
arr.forEach(p=>{
if(p) count++;
});
});

return count;

}

function getClassCount(){

const counts={SR:0,JR:0,SO:0,FR:0};

players.forEach(p=>{
if(!p.classYear) return;
counts[p.classYear]=(counts[p.classYear]||0)+1;
});

return counts;

}

function getColor(name){

const p=players.find(pl=>pl.name===name);

if(!p) return CLASS_COLORS.NEED;

return CLASS_COLORS[p.classYear]||"#ccc";

}

const classCounts=getClassCount();

return(

<div style={{
background:GREEN,
minHeight:"100vh",
padding:30,
fontFamily:"Arial"
}}>

<div style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:20
}}>

<h1 style={{color:GOLD}}>Ghost Roster</h1>

<button onClick={onClose}>Back</button>

</div>

<div style={{display:"flex",gap:30}}>

{/* ROSTER GRID */}

<div style={{background:"#ddd",padding:20,flex:3}}>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(6,1fr)",
gap:5
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

{slots[pos].map((name,i)=>(

<div key={i} style={{border:"1px solid #222"}}>

<input
value={name}
placeholder="Player"
onChange={e=>updateSlot(pos,i,e.target.value)}
style={{
width:"100%",
border:"none",
padding:5,
background:getColor(name),
fontWeight:"bold",
textAlign:"center"
}}
/>

<input
placeholder="Scholarship"
value={scholarships[name]||""}
onChange={e=>updateScholarship(name,e.target.value)}
style={{
width:"100%",
border:"none",
textAlign:"center",
background:"#eee"
}}
/>

</div>

))}

</div>

))}

</div>

</div>

{/* RIGHT PANEL */}

<div style={{background:"#ddd",padding:20,width:350}}>

<div style={{marginBottom:20}}>

<h3>Scholarship Count</h3>

<div style={{
background:"#fff",
padding:10,
fontSize:18,
fontWeight:"bold"
}}>
{getScholarshipTotal().toFixed(2)}
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
{getRosterCount()}
</div>

</div>

<div style={{marginBottom:20}}>

<h3>Class Count</h3>

<div style={{background:"#ff0000",padding:5}}>SR = {classCounts.SR}</div>
<div style={{background:"#ffff00",padding:5}}>JR = {classCounts.JR}</div>
<div style={{background:"#4f83cc",padding:5}}>SO = {classCounts.SO}</div>
<div style={{background:"#00ff00",padding:5}}>FR = {classCounts.FR}</div>

</div>

<h3>Money</h3>

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
value={money[p.name]||""}
onChange={e=>updateMoney(p.name,e.target.value)}
style={{width:80}}
/>

</div>

))}

</div>

<div style={{
marginTop:10,
fontWeight:"bold"
}}>

TOTAL ${Object.values(money).reduce((a,b)=>a+b,0).toLocaleString()}

</div>

</div>

</div>

</div>

);

}
