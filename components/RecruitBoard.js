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
const [search,setSearch]=useState("");

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

async function deletePlayer(id){

if(!confirm("Delete player?")) return;

await deleteDoc(doc(db,"players",id));

}

async function archivePlayer(id){

await updateDoc(doc(db,"players",id),{
archived:true
});

}

async function toggleHighlight(e,p){

e.preventDefault();

await updateDoc(doc(db,"players",p.id),{
highlight:!p.highlight
});

}

const filtered=players.filter(p=>
p.name?.toLowerCase().includes(search.toLowerCase())
);

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

<div style={{display:"flex",gap:15}}>

<input
placeholder="Search player"
onChange={e=>setSearch(e.target.value)}
/>

<button onClick={()=>setShowAdd(true)}>
Add Player </button>

</div>

</div>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(6,1fr)",
gap:20
}}>

{LISTS.map(status=>(

<div key={status}
style={{
background:"#ffffff",
borderRadius:8,
padding:10,
minHeight:350
}}>

<h3 style={{borderBottom:`2px solid ${GOLD}`}}>
{status}
</h3>

{filtered
.filter(p=>p.status===status && !p.archived)
.map(p=>(

<div key={p.id}

onClick={()=>setSelected(p)}

onContextMenu={(e)=>toggleHighlight(e,p)}

style={{
border:"1px solid #ddd",
padding:10,
marginTop:8,
borderRadius:6,
cursor:"pointer",
background:p.highlight?"#FFF176":"#fff",
position:"relative"
}}

>

<b>{p.name}</b>

<div style={{fontSize:13}}>
{p.position} • {p.birthYear}
</div>

<div style={{
position:"absolute",
bottom:5,
right:8,
display:"flex",
gap:8
}}>

<span
onClick={(e)=>{
e.stopPropagation();
archivePlayer(p.id);
}}
style={{cursor:"pointer"}}

>

📦 </span>

<span
onClick={(e)=>{
e.stopPropagation();
deletePlayer(p.id);
}}
style={{cursor:"pointer"}}

>

🗑 </span>

</div>

</div>

))}

</div>

))}

</div>

{showAdd && <AddPlayerModal onClose={()=>setShowAdd(false)} />}

{selected && <PlayerProfile player={selected} onClose={()=>setSelected(null)} />}

</div>

);

}
