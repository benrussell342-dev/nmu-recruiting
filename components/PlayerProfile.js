"use client";

import { useState } from "react";
import { db } from "../lib/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { auth } from "../lib/firebase";

const GREEN="#00563F";
const GOLD="#CFB53B";

function getInitials(){

const email=auth.currentUser?.email;

if(email==="[dshyiak@nmu.edu](mailto:dshyiak@nmu.edu)") return "DS";
if(email==="[acontois@nmu.edu](mailto:acontois@nmu.edu)") return "AC";
if(email==="[pfox@nmu.edu](mailto:pfox@nmu.edu)") return "PF";
if(email==="[cbabiak@nmu.edu](mailto:cbabiak@nmu.edu)") return "CB";
if(email==="[berussel@nmu.edu](mailto:berussel@nmu.edu)") return "BR";

return "??";

}

export default function PlayerProfile({player,onClose}){

const [reports,setReports]=useState(player.reports||[]);
const [notes,setNotes]=useState(player.notes||[]);
const [contacts,setContacts]=useState(player.contacts||[]);

async function save(){

await updateDoc(doc(db,"players",player.id),{
reports,
notes,
contacts
});

alert("Saved");

}

function addEntry(list,setList,text){

setList([...list,{
text,
date:new Date().toLocaleDateString(),
initials:getInitials()
}]);

}

const timeline=[

...reports.map(r=>({...r,type:"Game Report"})),
...notes.map(n=>({...n,type:"Scout Note"})),
...contacts.map(c=>({...c,type:"Contact Log"}))

].sort((a,b)=>new Date(b.date)-new Date(a.date));

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

<div style={{padding:40}}>

<button onClick={onClose}>Back</button>

<h1 style={{color:GREEN}}>{player.name}</h1>

<h3 style={{color:GOLD}}>Player Information</h3>

<p><b>Team:</b> {player.team}</p>
<p><b>League:</b> {player.league}</p>
<p><b>Position:</b> {player.position}</p>
<p><b>Height:</b> {player.height}</p>
<p><b>Weight:</b> {player.weight}</p>
<p><b>Hand:</b> {player.hand}</p>
<p><b>Agent:</b> {player.agent}</p>

<h3 style={{color:GOLD}}>Activity Timeline</h3>

{timeline.map((t,i)=>(

<div key={i}
style={{
border:"1px solid #ddd",
padding:10,
marginTop:8,
background:"#fff"
}}>

<b>{t.date} ({t.initials})</b>

<div style={{fontWeight:"bold"}}>{t.type}</div>

<div>{t.text}</div>

</div>

))}

<h3 style={{color:GOLD}}>Scout Notes</h3>

<textarea
placeholder="Add note"
onBlur={e=>addEntry(notes,setNotes,e.target.value)}
/>

<h3 style={{color:GOLD}}>Game Reports</h3>

<textarea
placeholder="Add report"
onBlur={e=>addEntry(reports,setReports,e.target.value)}
/>

<h3 style={{color:GOLD}}>Contact Log</h3>

<textarea
placeholder="Add contact"
onBlur={e=>addEntry(contacts,setContacts,e.target.value)}
/>

<button style={{marginTop:30}} onClick={save}>
Save Changes
</button>

</div>

</div>

);

}
