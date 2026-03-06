"use client";

import { useState } from "react";
import { db } from "../lib/firebase";
import { updateDoc, doc } from "firebase/firestore";

const GREEN = "#00563F";
const GOLD = "#CFB53B";

export default function PlayerProfile({ player, onClose }) {

const [matriculation,setMatriculation] = useState(player.matriculation || "");
const [scholarship,setScholarship] = useState(player.scholarship || 0);

const [reports,setReports] = useState(player.reports || []);
const [notes,setNotes] = useState(player.notes || []);
const [contacts,setContacts] = useState(player.contacts || []);

const [report,setReport] = useState({
opponent:"",
date:"",
score:"",
rating:3,
notes:""
});

const [contact,setContact] = useState({
type:"Call",
notes:""
});

async function savePlayer(){

await updateDoc(doc(db,"players",player.id),{

matriculation,
scholarship,
reports,
notes,
contacts

});

alert("Player saved");

}

function addReport(){

setReports([
...reports,
report
]);

setReport({
opponent:"",
date:"",
score:"",
rating:3,
notes:""
});

}

function addNote(text){

setNotes([
...notes,
{
text,
date:new Date().toLocaleDateString()
}
]);

}

function addContact(){

setContacts([
...contacts,
{
type:contact.type,
notes:contact.notes,
date:new Date().toLocaleDateString()
}
]);

setContact({
type:"Call",
notes:""
});

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

{/* HEADER */}

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

<b>Matriculation Year</b>

<input
value={matriculation}
onChange={e=>setMatriculation(e.target.value)}
style={{marginLeft:10}}
/>

</p>

<p>

<b>Scholarship %</b>

<input
type="number"
value={scholarship}
onChange={e=>setScholarship(e.target.value)}
style={{marginLeft:10}}
/>

</p>

<a href={player.epLink} target="_blank">
EliteProspects Profile
</a>

<h3 style={{color:GOLD,marginTop:30}}>
Scout Notes
</h3>

<textarea
placeholder="Add scout note"
onBlur={e=>addNote(e.target.value)}
style={{width:"100%",height:60}}
/>

{notes.map((n,i)=>(

<div key={i} style={{marginTop:8}}>
<b>{n.date}</b>
<div>{n.text}</div>
</div>

))}

</div>

{/* RIGHT COLUMN */}

<div>

<h3 style={{color:GOLD}}>
Game Reports
</h3>

<input
placeholder="Opponent"
value={report.opponent}
onChange={e=>setReport({...report,opponent:e.target.value})}
/>

<input
type="date"
value={report.date}
onChange={e=>setReport({...report,date:e.target.value})}
/>

<input
placeholder="Score"
value={report.score}
onChange={e=>setReport({...report,score:e.target.value})}
/>

<select
value={report.rating}
onChange={e=>setReport({...report,rating:e.target.value})}
>

<option value="1">★</option>
<option value="2">★★</option>
<option value="3">★★★</option>
<option value="4">★★★★</option>
<option value="5">★★★★★</option>

</select>

<textarea
placeholder="Game Notes"
value={report.notes}
onChange={e=>setReport({...report,notes:e.target.value})}
/>

<button onClick={addReport}>
Add Game Report
</button>

{reports.map((r,i)=>(

<div key={i} style={{marginTop:10}}>
<b>{r.opponent}</b> ({r.score})
<div>{r.notes}</div>
</div>

))}

<h3 style={{color:GOLD,marginTop:30}}>
Contact Log
</h3>

<select
value={contact.type}
onChange={e=>setContact({...contact,type:e.target.value})}
>

<option>Call</option>
<option>Text</option>
<option>Email</option>
<option>Zoom</option>
<option>In Person</option>

</select>

<textarea
placeholder="Contact notes"
value={contact.notes}
onChange={e=>setContact({...contact,notes:e.target.value})}
/>

<button onClick={addContact}>
Add Contact
</button>

{contacts.map((c,i)=>(

<div key={i}>
<b>{c.date}</b> — {c.type}
<div>{c.notes}</div>
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
