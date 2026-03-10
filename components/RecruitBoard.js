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
const [sort,setSort]=useState("birthYear");
const [showArchive,setShowArchive]=useState(false);

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

await updateDoc(doc(db,"players",id),{status:newStatus});

}

async function toggleHighlight(p){

await updateDoc(doc(db,"players",p.id),{
highlight:!p.highlight
});

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

function sortPlayers(list){

if(sort==="birthYear"){

return list.sort((a,b)=>a.birthYear-b.birthYear);

}

if(sort==="position"){

return list.sort((a,b)=>a.position.localeCompare(b.position));

}

return list;

}

const filtered=players.filter(p=>
p.name?.toLowerCase().includes(search.toLowerCase())
);

return(

<div style={{
background:GREEN,
minHeight:"100vh",
padding:30
}}>

<div style={{display:"flex",gap:20}}>

<input
placeholder="Search player"
onChange={e=>setSearch(e.target.value)}
/>

<select onChange={e=>setSort(e.target.value)}>

<option value="birthYear">Sort by BirthYear</option>
<option value="position">Sort by Position</option>
</select>

<button onClick={()=>setShowArchive(!showArchive)}>
Archive </button>

<button onClick={()=>setShowAdd(true)}>
Add Player </button>

</div>

<div style={{
display:"grid",
gridTemplateColumns:"repeat(6,1fr)",
gap:20,
marginTop:30
}}>

{LISTS.map(status=>(

<div key={status} style={{background:"#fff",padding:10}}>

<h3>{status}</h3>

{sortPlayers(
filtered.filter(p=>p.status===status && !p.archived)
).map(p=>(

<div key={p.id}

onClick={()=>setSelected(p)}

onDoubleClick={()=>toggleHighlight(p)}

style={{
border:"1px solid #ddd",
padding:8,
marginTop:8,
background:p.highlight?"yellow":"white"
}}

>

<b>{p.name}</b>

<div>{p.position} • {p.birthYear}</div>

<button
onClick={(e)=>{
e.stopPropagation();
archivePlayer(p.id);
}}

>

Archive </button>

</div>

))}

</div>

))}

</div>

{showArchive && (

<div style={{marginTop:40,background:"#fff",padding:20}}>

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

{showAdd && <AddPlayerModal onClose={()=>setShowAdd(false)} />}

{selected && <PlayerProfile player={selected} onClose={()=>setSelected(null)} />}

</div>

);

}
