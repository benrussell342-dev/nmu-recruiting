"use client";

import { useEffect,useState } from "react";
import { db } from "../lib/firebase";
import { collection,onSnapshot,updateDoc,doc,deleteDoc } from "firebase/firestore";

import AddPlayerModal from "./AddPlayerModal";
import PlayerProfile from "./PlayerProfile";

const GREEN="#00563F";
const GOLD="#CFB53B";

const LISTS=[
"Hot List",
"Player of Interest",
"Tracking",
"Contacted NMU",
"Committed",
"Transfer Portal"
];

export default function RecruitBoard(){

const [players,setPlayers]=useState([]);
const [showAdd,setShowAdd]=useState(false);
const [selected,setSelected]=useState(null);
const [dragPlayer,setDragPlayer]=useState(null);

useEffect(()=>{

const unsub=onSnapshot(collection(db,"players"),(snapshot)=>{

const list=snapshot.docs.map(doc=>({
id:doc.id,
...doc.data()
}));

setPlayers(list);

});

return ()=>unsub();

},[]);

async function movePlayer(id,newStatus){

await updateDoc(doc(db,"players",id),{
status:newStatus
});

}

async function deletePlayer(id){

if(!confirm("Delete player?")) return;

await deleteDoc(doc(db,"players",id));

}

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
marginBottom:30
}}>

<div style={{display:"flex",alignItems:"center",gap:15}}>
<img src="/wildcat.png" style={{height:50}}/>

<h1 style={{color:GOLD}}>
NMU Hockey Recruiting Board
</h1>
</div>

<button onClick={()=>setShowAdd(true)}>
Add Player </button>

</div>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(6,1fr)",
gap:20
}}>

{LISTS.map(status=>(

<div key={status}

onDragOver={e=>e.preventDefault()}

onDrop={()=>movePlayer(dragPlayer?.id,status)}

style={{
background:"#ffffff",
borderRadius:8,
padding:10,
minHeight:350
}}>

<h3 style={{borderBottom:`2px solid ${GOLD}`}}>
{status}
</h3>

{players.filter(p=>p.status===status).map(p=>(

<div key={p.id}

draggable

onDragStart={()=>setDragPlayer(p)}

onClick={()=>setSelected(p)}

style={{
border:"1px solid #ddd",
padding:8,
marginTop:8,
borderRadius:6,
cursor:"pointer",
position:"relative"
}}>

<b>{p.name}</b>

<div>{p.position}</div>

<div

onClick={(e)=>{
e.stopPropagation();
deletePlayer(p.id);
}}

style={{
position:"absolute",
bottom:5,
right:5,
fontSize:18,
cursor:"pointer"
}}

>

🗑

</div>

</div>

))}

</div>

))}

</div>

{showAdd &&
<AddPlayerModal onClose={()=>setShowAdd(false)} />
}

{selected &&
<PlayerProfile player={selected} onClose={()=>setSelected(null)} />
}

</div>

);

}
