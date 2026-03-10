"use client";

import { useState } from "react";
import { db } from "../lib/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { auth } from "../lib/firebase";

const GREEN="#00563F";
const GOLD="#CFB53B";

function getInitials(){

const email=auth.currentUser?.email?.toLowerCase();

if(email==="[dshyiak@nmu.edu](mailto:dshyiak@nmu.edu)") return "DS";
if(email==="[acontois@nmu.edu](mailto:acontois@nmu.edu)") return "AC";
if(email==="[pfox@nmu.edu](mailto:pfox@nmu.edu)") return "PF";
if(email==="[cbabiak@nmu.edu](mailto:cbabiak@nmu.edu)") return "CB";
if(email==="[berussel@nmu.edu](mailto:berussel@nmu.edu)") return "BR";

return "NA";

}

export default function PlayerProfile({player,onClose}){

const [reports,setReports]=useState(player.reports||[]);
const [notes,setNotes]=useState(player.notes||[]);
const [contacts,setContacts]=useState(player.contacts||[]);

const [showTimeline,setShowTimeline]=useState(true);
const [showReports,setShowReports]=useState(true);
const [showNotes,setShowNotes]=useState(true);
const [showContacts,setShowContacts]=useState(true);

const [reportForm,setReportForm]=useState({
date:"",
opponent:"",
score:"",
rating:3,
notes:""
});

const [noteForm,setNoteForm]=useState({
date:"",
notes:""
});

const [contactForm,setContactForm]=useState({
date:"",
type:"Call",
notes:""
});

async function save(){

await updateDoc(doc(db,"players",player.id),{
reports,
notes,
contacts
});

alert("Saved");

}

function addReport(){

setReports([...reports,{
...reportForm,
initials:getInitials()
}]);

setReportForm({
date:"",
opponent:"",
score:"",
rating:3,
notes:""
});

}

function addNote(){

setNotes([...notes,{
...noteForm,
initials:getInitials()
}]);

setNoteForm({date:"",notes:""});

}

function addContact(){

setContacts([...contacts,{
...contactForm,
initials:getInitials()
}]);

setContactForm({date:"",type:"Call",notes:""});

}

const timeline=[

...reports.map(r=>({...r,type:"Game Report"})),
...notes.map(n=>({...n,type:"Scout Note"})),
...contacts.map(c=>({...c,type:"Contact"}))

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

<div style={{
display:"grid",
gridTemplateColumns:"1fr 1.2fr",
gap:40,
padding:40
}}>

{/* LEFT COLUMN */}

<div>

<h2 style={{color:GREEN}}>{player.name}</h2>

<div style={{marginTop:20,lineHeight:1.8}}>

<p><b>Team:</b> {player.team}</p>
<p><b>League:</b> {player.league}</p>
<p><b>Position:</b> {player.position}</p>
<p><b>Height:</b> {player.height}</p>
<p><b>Weight:</b> {player.weight}</p>
<p><b>Hand:</b> {player.hand}</p>
<p><b>Agent:</b> {player.agent}</p>

<p><b>EP Link:</b> 
<a href={player.epLink} target="_blank"> View Profile</a></p>

<p><b>InStat:</b> 
<a href={player.instatLink} target="_blank"> View Video</a></p>

</div>

<button
style={{marginTop:30}}
onClick={onClose}

>

Back </button>

</div>

{/* RIGHT COLUMN */}

<div>

{/* TIMELINE */}

<h3
style={{color:GOLD,cursor:"pointer"}}
onClick={()=>setShowTimeline(!showTimeline)}
>
Activity Timeline
</h3>

{showTimeline && timeline.map((t,i)=>(

<div key={i}
style={{
background:"#fff",
border:"1px solid #ddd",
padding:12,
marginTop:8
}}>
<b>{t.date} ({t.initials})</b>
<div>{t.type}</div>
<div>{t.notes||t.score||""}</div>
</div>
))}

{/* GAME REPORTS */}

<h3
style={{color:GOLD,cursor:"pointer",marginTop:30}}
onClick={()=>setShowReports(!showReports)}
>
Game Reports
</h3>

{showReports && (

<div style={{background:"#fff",padding:15}}>

<input
type="date"
value={reportForm.date}
onChange={e=>setReportForm({...reportForm,date:e.target.value})}
/>

<input
placeholder="Opponent"
value={reportForm.opponent}
onChange={e=>setReportForm({...reportForm,opponent:e.target.value})}
/>

<input
placeholder="Final Score"
value={reportForm.score}
onChange={e=>setReportForm({...reportForm,score:e.target.value})}
/>

<select
value={reportForm.rating}
onChange={e=>setReportForm({...reportForm,rating:e.target.value})}

>

<option value="1">★☆☆☆☆</option>
<option value="2">★★☆☆☆</option>
<option value="3">★★★☆☆</option>
<option value="4">★★★★☆</option>
<option value="5">★★★★★</option>

</select>

<textarea
placeholder="Game Notes"
value={reportForm.notes}
onChange={e=>setReportForm({...reportForm,notes:e.target.value})}
/>

<button onClick={addReport}>Add Report</button>

</div>

)}

{/* SCOUT NOTES */}

<h3
style={{color:GOLD,cursor:"pointer",marginTop:30}}
onClick={()=>setShowNotes(!showNotes)}
>
Scout Notes
</h3>

{showNotes && (

<div style={{background:"#fff",padding:15}}>

<input
type="date"
value={noteForm.date}
onChange={e=>setNoteForm({...noteForm,date:e.target.value})}
/>

<textarea
placeholder="Scout Notes"
value={noteForm.notes}
onChange={e=>setNoteForm({...noteForm,notes:e.target.value})}
/>

<button onClick={addNote}>Add Note</button>

</div>

)}

{/* CONTACT LOG */}

<h3
style={{color:GOLD,cursor:"pointer",marginTop:30}}
onClick={()=>setShowContacts(!showContacts)}
>
Contact Log
</h3>

{showContacts && (

<div style={{background:"#fff",padding:15}}>

<input
type="date"
value={contactForm.date}
onChange={e=>setContactForm({...contactForm,date:e.target.value})}
/>

<select
value={contactForm.type}
onChange={e=>setContactForm({...contactForm,type:e.target.value})}
>

<option>Call</option>
<option>Text</option>
<option>Email</option>
<option>Zoom</option>
<option>Visit</option>

</select>

<textarea
placeholder="Contact Notes"
value={contactForm.notes}
onChange={e=>setContactForm({...contactForm,notes:e.target.value})}
/>

<button onClick={addContact}>Add Contact</button>

</div>

)}

<button
style={{marginTop:40}}
onClick={save}
>
Save Changes
</button>

</div>

</div>

</div>

);

}
