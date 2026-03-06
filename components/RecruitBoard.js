"use client";

import { useState } from "react";
import AddPlayerModal from "./AddPlayerModal";
import PlayerProfile from "./PlayerProfile";
import DepthChart from "./DepthChart";

const LISTS = [
"Hot List",
"Player of Interest",
"Tracking",
"Contacted NMU",
"Committed",
"Transfer Portal"
];

export default function RecruitBoard() {

const [players,setPlayers] = useState([]);
const [showAdd,setShowAdd] = useState(false);
const [selected,setSelected] = useState(null);
const [showDepth,setShowDepth] = useState(false);

function addPlayer(player){
setPlayers(p=>[...p,{...player,id:crypto.randomUUID(),status:"Tracking"}]);
setShowAdd(false);
}

function movePlayer(id,newStatus){
setPlayers(players.map(p=>p.id===id?{...p,status:newStatus}:p));
}

function deletePlayer(id){
setPlayers(players.filter(p=>p.id!==id));
setSelected(null);
}

return (

<div style={{
background:"#00563F",
minHeight:"100vh",
padding:30,
fontFamily:"Arial"
}}>

{/* HEADER */}

<div style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center",
marginBottom:30
}}>

<div style={{display:"flex",alignItems:"center",gap:15}}>
<img src="/wildcat.png" style={{height:50}} />
<h1 style={{color:"#CFB53B"}}>
NMU Hockey Recruiting Board
</h1>
</div>

<div style={{display:"flex",gap:12}}>
<button onClick={()=>setShowAdd(true)}>Add Player</button>
<button onClick={()=>setShowDepth(true)}>Depth Chart</button>
</div>

</div>

{/* BOARD */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(6,1fr)",
gap:15
}}>

{LISTS.map(status=>(

<div key={status}
style={{
background:"#ffffff",
borderRadius:8,
padding:10,
minHeight:350
}}>

<h3 style={{borderBottom:"2px solid #CFB53B"}}>
{status}
</h3>

{players.filter(p=>p.status===status).map(p=>(

<div key={p.id}
style={{
border:"1px solid #ddd",
padding:8,
marginTop:8,
borderRadius:6,
cursor:"pointer"
}}
onClick={()=>setSelected(p)}>

<b>{p.name}</b>

<div>{p.position}</div>

<select
value={p.status}
onChange={e=>movePlayer(p.id,e.target.value)}
style={{marginTop:5}}>

{LISTS.map(s=>(

<option key={s}>{s}</option>
))}

</select>

</div>

))}

</div>

))}

</div>

{showAdd &&
<AddPlayerModal
onClose={()=>setShowAdd(false)}
onAdd={addPlayer}
/>
}

{selected &&
<PlayerProfile
player={selected}
onClose={()=>setSelected(null)}
onDelete={()=>deletePlayer(selected.id)}
/>
}

{showDepth &&
<DepthChart
players={players}
onClose={()=>setShowDepth(false)}
/>
}

</div>
);
}
