"use client";

import { useState } from "react";
import { db } from "../lib/firebase";
import { updateDoc,doc } from "firebase/firestore";

const GREEN="#00563F";
const GOLD="#CFB53B";

export default function PlayerProfile({player,onClose}){

const [scholarship,setScholarship]=useState(player.scholarship||0);
const [matriculation,setMatriculation]=useState(player.matriculation||"");

const [reports,setReports]=useState(player.reports||[]);
const [notes,setNotes]=useState(player.notes||[]);
const [contacts,setContacts]=useState(player.contacts||[]);

async function savePlayer(){

await updateDoc(doc(db,"players",player.id),{

scholarship,
matriculation,
reports,
notes,
contacts

});

alert("Saved");

}

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

<h2 style={{color:GOLD}}>
Player Profile
</h2>

</div>

<div style={{padding:40}}>

<button onClick={onClose}>Back</button>

<h1 style={{color:GREEN}}>
{player.name}
</h1>

<div style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:40,
marginTop:30
}}>

{/* LEFT COLUMN */}

<div>

<h3 style={{color:GOLD}}>Player Information</h3>

<p><b>Team:</b> {player.team}</p>
<p><b>League:</b> {player.league}</p>
<p><b>Position:</b> {player.position}</p>
<p><b>Height:</b> {player.height}</p>
<p><b>Weight:</b> {player.weight}</p>

<p>

<b>Matriculation Year:</b>

<input
value={matriculation}
onChange={e=>setMatriculation(e.target.value)}
/>

</p>

<p>

<b>Scholarship %:</b>

<input
value={scholarship}
onChange={e=>setScholarship(e.target.value)}
/>

</p>

<a href={player.epLink} target="_blank">
EliteProspects
</a>

<h3 style={{color:GOLD,marginTop:30}}>Scout Notes</h3>

<textarea
placeholder="Add note"
onBlur={e=>setNotes([...notes,{
text:e.target.value,
date:new Date().toLocaleDateString()
}])}
/>

{notes.map((n,i)=>(
<div key={i}>
<b>{n.date}</b>
<div>{n.text}</div>
</div>
))}

</div>

{/* RIGHT COLUMN */}

<div>

<h3 style={{color:GOLD}}>Game Reports</h3>

<textarea
placeholder="Game report"
onBlur={e=>setReports([...reports,{
text:e.target.value,
date:new Date().toLocaleDateString()
}])}
/>

{reports.map((r,i)=>(
<div key={i}>
<b>{r.date}</b>
<div>{r.text}</div>
</div>
))}

<h3 style={{color:GOLD,marginTop:30}}>Contact Log</h3>

<textarea
placeholder="Contact log"
onBlur={e=>setContacts([...contacts,{
text:e.target.value,
date:new Date().toLocaleDateString()
}])}
/>

{contacts.map((c,i)=>(
<div key={i}>
<b>{c.date}</b>
<div>{c.text}</div>
</div>
))}

</div>

</div>

<button
style={{marginTop:30}}
onClick={savePlayer}
>
Save Player Data
</button>

</div>

</div>

);

}
