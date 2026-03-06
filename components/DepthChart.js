"use client";

export default function DepthChart({players,onClose}){

const committed = players.filter(p=>p.status==="Committed");

return(

<div style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"#fff",
padding:40
}}>

<button onClick={onClose}>Back</button>

<h1>Depth Chart</h1>

<h3>Forwards</h3>
{committed.filter(p=>["C","LW","RW"].includes(p.position))
.map(p=>(<div key={p.id}>{p.name}</div>))}

<h3>Defense</h3>
{committed.filter(p=>["LD","RD"].includes(p.position))
.map(p=>(<div key={p.id}>{p.name}</div>))}

<h3>Goalies</h3>
{committed.filter(p=>p.position==="G")
.map(p=>(<div key={p.id}>{p.name}</div>))}

</div>

);
}
