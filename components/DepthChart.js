"use client";

import { useState } from "react";

const GREEN="#00563F";
const GOLD="#CFB53B";

export default function DepthChart({players,onClose}){

const [lines,setLines]=useState([
{LW:null,C:null,RW:null},
{LW:null,C:null,RW:null},
{LW:null,C:null,RW:null},
{LW:null,C:null,RW:null}
]);

const [pairs,setPairs]=useState([
{LD:null,RD:null},
{LD:null,RD:null},
{LD:null,RD:null}
]);

const [goalies,setGoalies]=useState([null,null]);

function assignForward(i,pos,player){
const copy=[...lines];
copy[i][pos]=player;
setLines(copy);
}

function assignPair(i,pos,player){
const copy=[...pairs];
copy[i][pos]=player;
setPairs(copy);
}

function assignGoalie(i,player){
const copy=[...goalies];
copy[i]=player;
setGoalies(copy);
}

return(

<div style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"#fff",
overflow:"auto",
padding:40
}}>

<button onClick={onClose}>Back</button>

<h1 style={{color:GREEN}}>NMU Depth Chart</h1>

{/* FORWARDS */}

<h2 style={{color:GOLD}}>Forward Lines</h2>

{lines.map((line,i)=>(

<div key={i} style={{
display:"grid",
gridTemplateColumns:"1fr 1fr 1fr",
gap:10,
marginBottom:15
}}>

{["LW","C","RW"].map(pos=>(
<select
key={pos}
value={line[pos]?.id||""}
onChange={e=>{

const p=players.find(x=>x.id===e.target.value);
assignForward(i,pos,p);

}}>

<option value="">Select {pos}</option>

{players.map(p=>(

<option key={p.id} value={p.id}>
{p.name} ({p.position})
</option>
))}

</select>
))}

</div>
))}

{/* DEFENSE */}

<h2 style={{color:GOLD}}>Defense Pairs</h2>

{pairs.map((pair,i)=>(

<div key={i} style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:10,
marginBottom:15
}}>

{["LD","RD"].map(pos=>(
<select
key={pos}
value={pair[pos]?.id||""}
onChange={e=>{
const p=players.find(x=>x.id===e.target.value);
assignPair(i,pos,p);
}}>

<option value="">Select {pos}</option>

{players.map(p=>(

<option key={p.id} value={p.id}>
{p.name}
</option>
))}

</select>
))}

</div>
))}

{/* GOALIES */}

<h2 style={{color:GOLD}}>Goalies</h2>

{goalies.map((g,i)=>(

<select key={i}
value={g?.id||""}
onChange={e=>{
const p=players.find(x=>x.id===e.target.value);
assignGoalie(i,p);
}}
style={{display:"block",marginBottom:10}}>

<option value="">Select Goalie</option>

{players.map(p=>(

<option key={p.id} value={p.id}>
{p.name}
</option>
))}

</select>

))}

</div>
);
}
