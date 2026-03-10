"use client";

import { useState } from "react";
import { db } from "../lib/firebase";
import { updateDoc, doc } from "firebase/firestore";

const GREEN="#00563F";
const GOLD="#CFB53B";

export default function PlayerProfile({player,onClose}){

const [edit,setEdit]=useState(false);

const [playerData,setPlayerData]=useState({...player});

const [reports,setReports]=useState(player.reports||[]);
const [notes,setNotes]=useState(player.notes||[]);
const [contacts,setContacts]=useState(player.contacts||[]);

async function saveProfile(){

await updateDoc(doc(db,"players",player.id),playerData);

setEdit(false);

}

async function saveSections(){

await updateDoc(doc(db,"players",player.id),{
reports,
notes,
contacts
});

}

const timeline=[...reports,...notes,...contacts]
.sort((a,b)=>new Date(b.date)-new Date(a.date));

return(

<div style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"#f4f6f7",
overflow:"auto"
}}>

<div style={{
background:GREEN,
padding:20,
display:"flex",
alignItems:"center",
gap:15
}}>

<img src="/wildcat.png" style={{height:45}}/>

<h2 style={{color:GOLD}}>Player Profile</h2>

</div>

<div style={{
display:"grid",
gridTemplateColumns:"1fr 1.2fr",
gap:40,
padding:40
}}>

{/* LEFT COLUMN */}

<div>

<div style={{display:"flex",alignItems:"center",gap:10}}>

<h2 style={{color:GREEN}}>{playerData.name}</h2>

<span
onClick={()=>setEdit(true)}
style={{cursor:"pointer"}}

>

✏️ </span>

</div>

<div style={{marginTop:20,lineHeight:2}}>

{["team","league","position","birthYear","height","weight","hand","agent"].map(field=>(

<div key={field}>

<b>{field}</b>

{edit
?
<input
value={playerData[field]||""}
onChange={e=>setPlayerData({...playerData,[field]:e.target.value})}
/>
:

<p>{playerData[field]}</p>
}

</div>

))}

<b>EliteProspects</b>

<a href={playerData.epLink} target="_blank">
{playerData.epLink}
</a>

<b>InStat</b>

<a href={playerData.instatLink} target="_blank">
{playerData.instatLink}
</a>

</div>

{edit && (

<button onClick={saveProfile}>
Save Profile
</button>

)}

<button style={{marginTop:20}} onClick={onClose}>
Back
</button>

</div>

{/* RIGHT COLUMN */}

<div>

<h3 style={{color:GOLD}}>Activity Timeline</h3>

{timeline.map((t,i)=>(

<div key={i}
style={{
background:"#fff",
border:"1px solid #ddd",
padding:12,
marginTop:8
}}>

<b>{t.coach} — {t.date}</b>

<div><b>{t.type}</b></div>

<div>{t.notes}</div>

</div>

))}

<h3 style={{color:GOLD,marginTop:30}}>Game Reports</h3>

<button onClick={()=>setReports([...reports,{type:"Game Report"}])}>
Add Report </button>

<h3 style={{color:GOLD,marginTop:30}}>Scout Notes</h3>

<button onClick={()=>setNotes([...notes,{type:"Scout Note"}])}>
Add Note </button>

<h3 style={{color:GOLD,marginTop:30}}>Contact Log</h3>

<button onClick={()=>setContacts([...contacts,{type:"Contact Log"}])}>
Add Contact </button>

<button
style={{marginTop:30}}
onClick={saveSections}

>

Save Updates </button>

</div>

</div>

</div>

);

}
