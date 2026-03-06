"use client";

import { useState } from "react";

const GREEN="#00563F";
const GOLD="#CFB53B";

export default function PlayerProfile({player,onClose,onDelete}){

const [scholarship,setScholarship]=useState("");
const [gameReports,setGameReports]=useState([]);
const [notes,setNotes]=useState([]);
const [contacts,setContacts]=useState([]);

const [report,setReport]=useState({
opponent:"",
date:"",
score:"",
rating:3,
notes:""
});

function addReport(){
setGameReports([...gameReports,report]);
}

function addNote(text){
setNotes([...notes,{
text,
date:new Date().toLocaleDateString()
}]);
}

function addContact(type,notesText){
setContacts([...contacts,{
type,
notes:notesText,
date:new Date().toLocaleDateString()
}]);
}

return(

<div style={{
position:"fixed",
top:0,
left:0,
width:"100%",
height:"100%",
background:"#fff",
overflow:"auto",
padding:40
}}>

<button onClick={onClose}>Back</button> <button onClick={onDelete}>Delete Player</button>

<h1 style={{color:GREEN}}>{player.name}</h1>

<div style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:40,
marginTop:30
}}>

{/* LEFT COLUMN */}

<div>

<h3 style={{color:GOLD}}>Player Info</h3>

<p><b>Team:</b> {player.team}</p>
<p><b>League:</b> {player.league}</p>
<p><b>Position:</b> {player.position}</p>
<p><b>Height:</b> {player.height}</p>
<p><b>Weight:</b> {player.weight}</p>
<p><b>Hand:</b> {player.hand}</p>

<p>
<b>Scholarship %</b>
<input
type="number"
value={scholarship}
onChange={e=>setScholarship(e.target.value)}
style={{marginLeft:10,width:80}}
/>
</p>

<a href={player.epLink} target="_blank">EliteProspects</a> <br/> <a href={player.instatLink} target="_blank">InStat</a>

{/* SCOUT NOTES */}

<h3 style={{color:GOLD,marginTop:30}}>Scout Notes</h3>

<textarea
placeholder="Add scout note"
onBlur={e=>addNote(e.target.value)}
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

<input placeholder="Opponent"
onChange={e=>setReport({...report,opponent:e.target.value})}/>

<input type="date"
onChange={e=>setReport({...report,date:e.target.value})}/>

<input placeholder="Score"
onChange={e=>setReport({...report,score:e.target.value})}/>

<select
onChange={e=>setReport({...report,rating:e.target.value})}>

<option value="1">★</option>
<option value="2">★★</option>
<option value="3">★★★</option>
<option value="4">★★★★</option>
<option value="5">★★★★★</option>

</select>

<textarea placeholder="Game notes"
onChange={e=>setReport({...report,notes:e.target.value})}/>

<button onClick={addReport}>Add Report</button>

{gameReports.map((r,i)=>(
<div key={i} style={{marginTop:10}}>
<b>{r.opponent}</b> ({r.score})
<div>{r.notes}</div>
</div>
))}

{/* CONTACT LOG */}

<h3 style={{color:GOLD,marginTop:30}}>Contact Log</h3>

<select id="contactType">
<option>Call</option>
<option>Text</option>
<option>Email</option>
<option>Zoom</option>
<option>In Person</option>
</select>

<textarea id="contactNotes"
placeholder="Contact notes"
/>

<button
onClick={()=>{

const type=document.getElementById("contactType").value;
const notes=document.getElementById("contactNotes").value;

addContact(type,notes);

}}
>

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

</div>
);
}
