"use client";

import { useEffect,useState } from "react";
import { db } from "../lib/firebase";
import { collection,onSnapshot,updateDoc,doc } from "firebase/firestore";

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

export default function RecruitBoard(){

const [players,setPlayers] = useState([]);
const [showAdd,setShowAdd] = useState(false);
const [selected,setSelected] = useState(null);
const [showDepth,setShowDepth] = useState(false);
const [dragPlayer,setDragPlayer] = useState(null);

useEffect(()=>{

const unsub = onSnapshot(collection(db,"players"),(snapshot)=>{

const data = snapshot.docs.map(doc=>({

id:doc.id,
...doc.data()

}));

setPlayers(data);

});

return ()=>unsub();

},[]);

async function movePlayer(id,newStatus){

await updateDoc(doc(db,"players",id),{
status:newStatus
});

}

return(

<div style={{padding:30}}>

<h1>NMU Recruiting Board</h1>

<button onClick={()=>setShowAdd(true)}>
Add Player </button>

<button onClick={()=>setShowDepth(true)}>
Depth Chart </button>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(6,1fr)",
gap:20,
marginTop:20
}}>

{LISTS.map(status=>(

<div key={status}
onDragOver={(e)=>e.preventDefault()}
onDrop={()=>movePlayer(dragPlayer.id,status)}
style={{
border:"1px solid #ccc",
padding:10,
minHeight:300
}}>

<h3>{status}</h3>

{players
.filter(p=>p.status===status)
.map(p=>(

<div key={p.id}
draggable
onDragStart={()=>setDragPlayer(p)}
onClick={()=>setSelected(p)}
style={{
border:"1px solid #ddd",
padding:6,
marginTop:6,
cursor:"pointer"
}}>

<b>{p.name}</b>

<div>{p.position}</div>

</div>

))}

</div>

))}

</div>

{showAdd && <AddPlayerModal onClose={()=>setShowAdd(false)} />}

{selected && (
<PlayerProfile
player={selected}
onClose={()=>setSelected(null)}
/>
)}

{showDepth && (
<DepthChart
players={players}
onClose={()=>setShowDepth(false)}
/>
)}

</div>

);

}
