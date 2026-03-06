"use client";

import { updateDoc,doc } from "firebase/firestore";
import { db } from "../lib/firebase";

const STATUSES=[
"Hot List",
"Player of Interest",
"Tracking",
"Contacted NMU",
"Transfer Portal",
"Committed"
];

export default function RecruitBoard({players,setSelected,openAdd,openDepth}){

let dragPlayer=null;

function dropBoard(status){

if(!dragPlayer) return;

updateDoc(doc(db,"players",dragPlayer.id),{status});

}

return(

<div style={{fontFamily:"Arial"}}>

<div style={{
background:"#005A43",
color:"white",
padding:20,
display:"flex",
justifyContent:"space-between"
}}>

<div style={{display:"flex",alignItems:"center",gap:10}}>
<img src="/wildcat.png" width="40"/>
<h2>NMU Recruiting Board</h2>
</div>

<div>
<button onClick={openDepth}>Depth Chart</button>
<button onClick={openAdd}>Add Player</button>
</div>

</div>

<div style={{display:"flex",gap:20,padding:20}}>

{STATUSES.map(status=>(

<div key={status}
onDragOver={e=>e.preventDefault()}
onDrop={()=>dropBoard(status)}
style={{background:"white",padding:10,width:230}}
>

<b>{status}</b>

{players.filter(p=>p.status===status).map(p=>(

<div key={p.id}

draggable
onDragStart={()=>dragPlayer=p}
onClick={()=>setSelected(p)}

style={{
border:"1px solid #ccc",
padding:8,
marginTop:8,
cursor:"pointer"
}}

>

<b>{p.name}</b>

<div style={{fontSize:12}}>
{p.team} • {p.position}
</div>

</div>

))}

</div>

))}

</div>

</div>

);

}
