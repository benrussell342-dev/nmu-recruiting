"use client";

import { useState,useEffect } from "react";
import { db } from "../lib/firebase";
import { doc,setDoc,getDoc } from "firebase/firestore";

const GREEN="#00563F";
const GOLD="#CFB53B";

const COLORS={
NEED:"#ff00ff",
FR:"#00ff00",
SO:"#4f83cc",
JR:"#ffff00",
SR:"#ff0000"
};

const POSITIONS=["LW","C","RW","LD","RD","G"];

const SEASONS=[
"2026-27",
"2027-28",
"2028-29",
"2029-30"
];

function emptyRoster(){

return{
LW:Array(6).fill().map(()=>({name:"",scholarship:"",color:"NEED"})),
C:Array(6).fill().map(()=>({name:"",scholarship:"",color:"NEED"})),
RW:Array(6).fill().map(()=>({name:"",scholarship:"",color:"NEED"})),
LD:Array(6).fill().map(()=>({name:"",scholarship:"",color:"NEED"})),
RD:Array(6).fill().map(()=>({name:"",scholarship:"",color:"NEED"})),
G:Array(4).fill().map(()=>({name:"",scholarship:"",color:"NEED"}))
};

}

export default function GhostRoster({onClose}){

const [season,setSeason]=useState(SEASONS[0]);
const [rosters,setRosters]=useState({});
const [money,setMoney]=useState([]);
const [dragData,setDragData]=useState(null);

useEffect(()=>{

async function load(){

const ref=doc(db,"ghostRosters","main");

const snap=await getDoc(ref);

if(snap.exists()){

let data=snap.data();

let updatedRosters=data.rosters||{};

/* ensure all seasons + 4 goalie slots */

SEASONS.forEach(s=>{

if(!updatedRosters[s]) updatedRosters[s]=emptyRoster();

if(updatedRosters[s].G.length<4){

while(updatedRosters[s].G.length<4){

updatedRosters[s].G.push({
name:"",
scholarship:"",
color:"NEED"
});

}

}

});

setRosters(updatedRosters);
setMoney(data.money||[]);

}else{

const start={};

SEASONS.forEach(s=>{
start[s]=emptyRoster();
});

setRosters(start);

}

}

load();

},[]);

async function save(updatedRosters,updatedMoney){

setRosters(updatedRosters);
setMoney(updatedMoney);

await setDoc(doc(db,"ghostRosters","main"),{
rosters:updatedRosters,
money:updatedMoney
});

}

const roster=rosters[season]||emptyRoster();

function updateSlot(position,index,field,value){

const updated={...rosters};

updated[season][position][index]={
...updated[season][position][index],
[field]:value
};

save(updated,money);

}

function handleDragStart(position,index){

setDragData({position,index});

}

function handleDrop(position,index){

if(!dragData) return;

const updated={...rosters};

const temp=updated[season][position][index];

updated[season][position][index]=
updated[season][dragData.position][dragData.index];

updated[season][dragData.position][dragData.index]=temp;

save(updated,money);

}

function scholarshipTotal(){

let total=0;

Object.values(roster).forEach(group=>{
group.forEach(p=>{
total+=parseFloat(p.scholarship)||0;
});
});

return total;

}

function scholarshipRemaining(){

return (18-scholarshipTotal()).toFixed(2);

}

function classCounts(){

const counts={SR:0,JR:0,SO:0,FR:0};

Object.values(roster).forEach(group=>{
group.forEach(p=>{
if(p.color==="SR") counts.SR++;
if(p.color==="JR") counts.JR++;
if(p.color==="SO") counts.SO++;
if(p.color==="FR") counts.FR++;
});
});

return counts;

}

function moneyTotal(){

return money.reduce((a,b)=>a+(b.amount||0),0);

}

const counts=classCounts();

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
alignItems:"center"
}}>

<h1 style={{color:GOLD}}>Ghost Rosters</h1>

<div>

<select
value={season}
onChange={e=>setSeason(e.target.value)}
>

{SEASONS.map(s=>(
<option key={s}>{s}</option>
))}

</select>

<button onClick={onClose} style={{marginLeft:10}}>
Back
</button>

</div>

</div>

<div style={{display:"flex",gap:30,marginTop:20}}>

{/* ROSTER GRID */}

<div style={{
background:"#ccc",
padding:10,
flex:3
}}>

<div style={{
display:"grid",
gridTemplateColumns:"1fr 1fr 1fr 40px 1fr 1fr 40px 1fr",
gap:4
}}>

{POSITIONS.map((pos,i)=>(
<>
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

{roster[pos].map((p,i)=>(

<div
key={i}
draggable
onDragStart={()=>handleDragStart(pos,i)}
onDragOver={e=>e.preventDefault()}
onDrop={()=>handleDrop(pos,i)}
style={{
border:"1px solid #222",
marginBottom:2
}}
>

<input
value={p.name}
placeholder="Player"
onChange={e=>updateSlot(pos,i,"name",e.target.value)}
style={{
width:"100%",
background:COLORS[p.color],
border:"none",
textAlign:"center",
fontWeight:"bold"
}}
/>

<input
value={p.scholarship}
placeholder="0.00"
onChange={e=>updateSlot(pos,i,"scholarship",e.target.value)}
style={{
width:"100%",
border:"none",
textAlign:"center"
}}
/>

<select
value={p.color}
onChange={e=>updateSlot(pos,i,"color",e.target.value)}
style={{width:"100%"}}
>

<option value="NEED">Need</option>
<option value="FR">FR</option>
<option value="SO">SO</option>
<option value="JR">JR</option>
<option value="SR">SR</option>

</select>

</div>

))}

</div>

{/* spacer after forwards */}
{i===2 && <div></div>}

{/* spacer after defense */}
{i===4 && <div></div>}

</>
))}

</div>

</div>

{/* SIDE PANEL */}

<div style={{
background:"#ccc",
padding:10,
width:350
}}>

<h3>Scholarship Count</h3>

<div style={{
background:"#fff",
padding:10,
fontWeight:"bold"
}}>
{scholarshipTotal().toFixed(2)}
</div>

<h3 style={{marginTop:10}}>Scholarship Remaining</h3>

<div style={{
background:"#fff",
padding:10,
fontWeight:"bold"
}}>
{scholarshipRemaining()}
</div>

<h3 style={{marginTop:20}}>Class Count</h3>

<div style={{background:"#ff0000",padding:5}}>SR = {counts.SR}</div>
<div style={{background:"#ffff00",padding:5}}>JR = {counts.JR}</div>
<div style={{background:"#4f83cc",padding:5}}>SO = {counts.SO}</div>
<div style={{background:"#00ff00",padding:5}}>FR = {counts.FR}</div>

<h3 style={{marginTop:20}}>Money</h3>

{money.map((m,i)=>(

<div key={i} style={{display:"flex",gap:5}}>

<input
placeholder="Player"
value={m.name}
onChange={e=>{

const updated=[...money];
updated[i].name=e.target.value;

save(rosters,updated);

}}
/>

<input
placeholder="Amount"
value={m.amount}
onChange={e=>{

const updated=[...money];
updated[i].amount=parseInt(e.target.value)||0;

save(rosters,updated);

}}
style={{width:80}}
/>

</div>

))}

<button onClick={()=>save(rosters,[...money,{name:"",amount:0}])}>
Add Player
</button>

<div style={{marginTop:10,fontWeight:"bold"}}>
TOTAL ${moneyTotal().toLocaleString()}
</div>

</div>

</div>

</div>

);

}
