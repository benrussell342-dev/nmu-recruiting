"use client";

import { useState } from "react";

const GREEN = "#00563F";
const GOLD = "#CFB53B";

export default function DepthChart({ players, onClose }){

const seasons=[2025,2026,2027,2028,2029];

const [season,setSeason]=useState(seasons[0]);

const eligible = players.filter(p=>{

if(!p.matriculation) return false;

return Number(p.matriculation) <= season;

});

const scholarshipUsed = eligible.reduce((sum,p)=>{

return sum + (Number(p.scholarship)||0)/100;

},0);

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
onChange={e=>setSeason(Number(e.target.value))}

>

{seasons.map(s=>(

<option key={s}>{s}</option>
))}

</select>

<h3 style={{marginTop:20}}>

Scholarships Used: {scholarshipUsed.toFixed(2)} / 18

</h3>

<h2 style={{marginTop:30}}>Eligible Players</h2>

{eligible.map(p=>(

<div key={p.id}
style={{
border:"1px solid #ccc",
padding:8,
marginTop:6,
background:"#fff"
}}>

{p.name} ({p.position})

</div>

))}

</div>

</div>

);

}
