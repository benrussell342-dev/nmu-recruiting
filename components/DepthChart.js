"use client";

import { useState } from "react";

const GREEN="#00563F";
const GOLD="#CFB53B";

export default function DepthChart({players,onClose}){

const seasons=[2025,2026,2027,2028];

const [season,setSeason]=useState(seasons[0]);

const eligible=players.filter(p=>p.matriculation);

return(

<div style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"#f4f6f7"
}}>

<div style={{
background:GREEN,
padding:20,
display:"flex",
alignItems:"center",
gap:15
}}>

<img src="/wildcat.png" style={{height:45}}/>

<h2 style={{color:GOLD}}>
Depth Chart
</h2>

</div>

<div style={{padding:40}}>

<button onClick={onClose}>Back</button>

<h3>Season</h3>

<select
value={season}
onChange={e=>setSeason(e.target.value)}

>

{seasons.map(s=>(

<option key={s}>{s}</option>
))}

</select>

<h2 style={{marginTop:30}}>Forwards</h2>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(3,1fr)",
gap:10
}}>

{["LW","C","RW"].map(pos=>(

<div key={pos} style={{
background:"#fff",
padding:10,
borderRadius:8
}}>

<b>{pos}</b>

{eligible
.filter(p=>p.position===pos)
.map(p=>(

<div key={p.id}>
{p.name}
</div>
))}

</div>

))}

</div>

<h2 style={{marginTop:30}}>Defense</h2>

<div style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:10
}}>

{["LD","RD"].map(pos=>(

<div key={pos} style={{
background:"#fff",
padding:10,
borderRadius:8
}}>

<b>{pos}</b>

{eligible
.filter(p=>p.position===pos)
.map(p=>(

<div key={p.id}>
{p.name}
</div>
))}

</div>

))}

</div>

<h2 style={{marginTop:30}}>Goalies</h2>

<div style={{
background:"#fff",
padding:10,
borderRadius:8
}}>

{eligible
.filter(p=>p.position==="G")
.map(p=>(

<div key={p.id}>
{p.name}
</div>
))}

</div>

</div>

</div>
);
}
