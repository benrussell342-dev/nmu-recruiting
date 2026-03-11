"use client";

import { useEffect, useState } from "react";
import { db } from "../lib/firebase";
import {
collection,
onSnapshot,
deleteDoc,
doc
} from "firebase/firestore";

import PlayerProfile from "./PlayerProfile";
import AddPlayerModal from "./AddPlayerModal";

const GREEN = "#00563F";
const GOLD = "#CFB53B";

export default function RecruitBoard(){

const [players,setPlayers] = useState([]);
const [selected,setSelected] = useState(null);
const [showAdd,setShowAdd] = useState(false);
const [search,setSearch] = useState("");
const [sort,setSort] = useState("");
const [showArchive,setShowArchive] = useState(false);

/* FIREBASE LISTENER */

useEffect(()=>{

const unsub = onSnapshot(collection(db,"players"),(snap)=>{

const data = snap.docs.map(d=>({
id:d.id,
...d.data()
}));

setPlayers(data);

});

return ()=>unsub();

},[]);

/* LAST CONTACT HELPER */

function getLastContact(player){

if(!player.contacts || player.contacts.length===0) return "—";

const latest=[...player.contacts]
.sort((a,b)=>new Date(b.date)-new Date(a.date))[0];

return latest.date;

}

/* DELETE PLAYER */

async function deletePlayer(id){

if(!confirm("Delete this player?")) return;

await deleteDoc(doc(db,"players",id));

}

/* FILTER */

let filtered = players.filter(p=>{

if(showArchive && !p.archived) return false;
if(!showArchive && p.archived) return false;

return p.name?.toLowerCase().includes(search.toLowerCase());

});

/* SORT */

if(sort==="birthyear"){
filtered.sort((a,b)=>a.birthYear-b.birthYear);
}

if(sort==="position"){
filtered.sort((a,b)=>a.position.localeCompare(b.position));
}

/* HIGHLIGHT */

function toggleHighlight(e,player){

e.preventDefault();

player.highlight = !player.highlight;

setPlayers([...players]);

}

/* DRAG DROP */

function onDragStart(e,id){
e.dataTransfer.setData("id",id);
}

function onDrop(e){
const id=e.dataTransfer.getData("id");
}

return(

<div>

{/* HEADER */}

<div style={{
background:GREEN,
padding:20,
display:"flex",
alignItems:"center",
justifyContent:"space-between"
}}>

<div style={{display:"flex",alignItems:"center",gap:15}}>

<img src="/wildcat.png" style={{height:40}}/>

<h2 style={{color:GOLD}}>NMU Recruiting Board</h2>

</div>

<div style={{display:"flex",gap:10}}>

<input
placeholder="Search Player"
value={search}
onChange={e=>setSearch(e.target.value)}
/>

<select
value={sort}
onChange={e=>setSort(e.target.value)}

>

<option value="">Sort</option>
<option value="birthyear">Birthyear</option>
<option value="position">Position</option>

</select>

<button onClick={()=>setShowArchive(!showArchive)}>
{showArchive ? "Back to Board" : "Archive"} </button>

<button onClick={()=>setShowAdd(true)}>
Add Player </button>

</div>

</div>

{/* BOARD */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(auto-fill,250px)",
gap:20,
padding:30
}}>

{filtered.map(player=>(

<div
key={player.id}
draggable
onDragStart={(e)=>onDragStart(e,player.id)}
onContextMenu={(e)=>toggleHighlight(e,player)}
onClick={()=>setSelected(player)}
style={{
background: player.highlight ? "#fff3a0" : "#fff",
border:"1px solid #ddd",
borderRadius:6,
padding:15,
cursor:"pointer",
position:"relative"
}}
>

<b>{player.name}</b>

<div style={{fontSize:14,marginTop:5}}>
{player.position} | {player.birthYear}
</div>

<div style={{fontSize:12,color:"#666",marginTop:6}}>
Last Contact: {getLastContact(player)}
</div>

{/* DELETE ICON */}

<div
onClick={(e)=>{
e.stopPropagation();
deletePlayer(player.id);
}}
style={{
position:"absolute",
bottom:6,
right:8,
cursor:"pointer"
}}
>
🗑️
</div>

</div>

))}

</div>

{/* PLAYER PROFILE */}

{selected && (

<PlayerProfile
player={selected}
onClose={()=>setSelected(null)}
/>

)}

{/* ADD PLAYER */}

{showAdd && (

<AddPlayerModal
onClose={()=>setShowAdd(false)}
/>

)}

</div>

);

}
