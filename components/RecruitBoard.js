"use client";

import { useEffect,useState } from "react";
import { db } from "../lib/firebase";
import { collection,onSnapshot,updateDoc,doc,deleteDoc } from "firebase/firestore";

import AddPlayerModal from "./AddPlayerModal";
import PlayerProfile from "./PlayerProfile";
import GhostRoster from "./GhostRoster";

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
const [search,setSearch]=useState("");
const [showArchive,setShowArchive]=useState(false);
const [sort,setSort]=useState("");
const [showGhost,setShowGhost]=useState(false);
       
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

async function archivePlayer(id){

await updateDoc(doc(db,"players",id),{
archived:true
});

}

async function restorePlayer(id){

await updateDoc(doc(db,"players",id),{
archived:false
});

}

async function toggleHighlight(e,p){

e.preventDefault();

await updateDoc(doc(db,"players",p.id),{
highlight:!p.highlight
});

}

function sortPlayers(list){

if(sort==="birthYear"){
return [...list].sort((a,b)=>(a.birthYear||0)-(b.birthYear||0));
}

if(sort==="position"){
return [...list].sort((a,b)=>(a.position||"").localeCompare(b.position||""));
}

if(sort==="lastContact"){

return [...list].sort((a,b)=>{

const aDate=a.contacts?.length
? new Date(a.contacts[a.contacts.length-1].date)
: new Date(0);

const bDate=b.contacts?.length
? new Date(b.contacts[b.contacts.length-1].date)
: new Date(0);

return bDate-aDate;

});

}

return list;

}

function getLastContact(player){

if(!player.contacts || player.contacts.length===0) return "—";

const latest=[...player.contacts]
.sort((a,b)=>new Date(b.date)-new Date(a.date))[0];

const d = new Date(latest.date);
return (d.getMonth()+1).toString().padStart(2,"0") + "/" + 
       d.getDate().toString().padStart(2,"0");

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
<h1 style={{color:GOLD}}>NMU Hockey Recruiting Board</h1>
</div>

<div style={{display:"flex",gap:15}}>

<input
placeholder="Search player"
onChange={e=>setSearch(e.target.value)}
/>

<select onChange={e=>setSort(e.target.value)}>

<option value="">Sort</option>
<option value="birthYear">BirthYear</option>
<option value="position">Position</option>
<option value="lastContact">Last Contact</option>

</select>

<button onClick={()=>setShowArchive(!showArchive)}>
Archive </button>

<button onClick={()=>setShowGhost(true)}>
Ghost Roster
</button>
       
<button onClick={()=>setShowAdd(true)}>
Add Player </button>

</div>

</div>

{showArchive && (

<div style={{background:"#fff",padding:20,marginBottom:30}}>
<h2>Archived Players</h2>

{players.filter(p=>p.archived).map(p=>(

<div key={p.id}>

{p.name}

<button onClick={()=>restorePlayer(p.id)}>
Restore </button>

</div>

))}

</div>

)}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(6,1fr)",
gap:20
}}>

{LISTS.map(status=>(

<div key={status}

onDragOver={(e)=>e.preventDefault()}

onDrop={()=>movePlayer(dragPlayer?.id,status)}

style={{
background:"#fff",
borderRadius:8,
padding:10,
minHeight:350
}}>

<h3 style={{borderBottom:`2px solid ${GOLD}`}}>
{status}
</h3>

{sortPlayers(
filtered.filter(p=>p.status===status && !p.archived)
).map(p=>(

<div key={p.id}

draggable

onDragStart={()=>setDragPlayer(p)}

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

<div style={{fontSize:12,color:"#666"}}>
Last Contact: {getLastContact(p)}
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

{showGhost && 
  <GhostRoster onClose={()=>setShowGhost(false)} />
}

{showAdd && <AddPlayerModal onClose={()=>setShowAdd(false)} />}

{selected && <PlayerProfile player={selected} onClose={()=>setSelected(null)} />}

</div>

);

}




