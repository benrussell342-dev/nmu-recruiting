"use client";

import { useState } from "react";

export default function PlayerProfile({player,onClose,onDelete}){

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
setNotes([...notes,{text,date:new Date().toLocaleDateString()}]);
}

function addContact(type,notes){
setContacts([...contacts,{
type,
notes,
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
background:"#ffffff",
overflow:"auto",
padding:40
}}>

<button onClick={onClose}>Back</button> <button onClick={onDelete}>Delete Player</button>

<h1>{player.name}</h1>

<div style={{
display:"grid",
gridTemplateColumns:"1fr 1fr",
gap:30
}}>

{/* LEFT COLUMN */}

<div>

<h3>Player Info</h3>

<p>Team: {player.team}</p>
<p>League: {player.league}</p>
<p>Position: {player.position}</p>
<p>Height: {player.height}</p>
<p>Weight: {player.weight}</p>
<p>Hand: {player.hand}</p>
<p>Agent: {player.agent}</p>

<a href={player.epLink} target="_blank">
EliteProspects
</a>

<br/>

<a href={player.instatLink} target="_blank">
InStat
</a>

</div>

{/* RIGHT COLUMN */}

<div>

<h3>Game Reports</h3>

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

<textarea placeholder="Notes"
onChange={e=>setReport({...report,notes:e.target.value})}/>

<button onClick={addReport}>
Add Game Report
</button>

{gameReports.map((r,i)=>(
<div key={i}>
<b>{r.opponent}</b>
<div>{r.score}</div>
<div>{r.notes}</div>
</div>
))}

</div>

</div>

</div>
);
}
