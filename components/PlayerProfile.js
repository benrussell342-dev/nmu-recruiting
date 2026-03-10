"use client";

import { useState } from "react";
import { db } from "../lib/firebase";
import { updateDoc, doc } from "firebase/firestore";

const GREEN = "#00563F";
const GOLD = "#CFB53B";

export default function PlayerProfile({ player, onClose }) {

const [reports,setReports]=useState(player.reports||[]);
const [notes,setNotes]=useState(player.notes||[]);
const [contacts,setContacts]=useState(player.contacts||[]);

const [showTimeline,setShowTimeline]=useState(true);
const [showReports,setShowReports]=useState(true);
const [showNotes,setShowNotes]=useState(true);
const [showContacts,setShowContacts]=useState(true);

const [reportForm,setReportForm]=useState({
coach:"",
date:"",
opponent:"",
score:"",
rating:3,
notes:""
});

const [noteForm,setNoteForm]=useState({
coach:"",
date:"",
notes:""
});

const [contactForm,setContactForm]=useState({
coach:"",
date:"",
type:"Call",
notes:""
});

async function saveSections(){

await updateDoc(doc(db,"players",player.id),{
reports,
notes,
contacts
});

alert("Saved");

}

async function updateField(field,value){

await updateDoc(doc(db,"players",player.id),{
[field]:value
});

}

function addReport(){

setReports([...reports,{
...reportForm,
type:"Game Report"
}]);

setReportForm({
coach:"",
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
type:"Scout Note"
}]);

setNoteForm({
coach:"",
date:"",
notes:""
});

}

function addContact(){

setContacts([...contacts,{
...contactForm,
type:"Contact Log"
}]);

setContactForm({
coach:"",
date:"",
type:"Call",
notes:""
});

}

const timeline=[

...reports,
...notes,
...contacts

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

<div style={{marginTop:20,lineHeight:2}}>

<label>Team</label>
<input
value={player.team||""}
onChange={e=>updateField("team",e.target.value)}
/>

<label>League</label>
<input
value={player.league||""}
onChange={e=>updateField("league",e.target.value)}
/>

<label>Position</label>
<input
value={player.position||""}
onChange={e=>updateField("position",e.target.value)}
/>

<label>BirthYear</label>
<input
value={player.birthYear||""}
onChange={e=>updateField("birthYear",e.target.value)}
/>

<label>Height</label>
<input
value={player.height||""}
onChange={e=>updateField("height",e.target.value)}
/>

<label>Weight</label>
<input
value={player.weight||""}
onChange={e=>updateField("weight",e.target.value)}
/>

<label>Hand</label>
<input
value={player.hand||""}
onChange={e=>updateField("hand",e.target.value)}
/>

<label>Agent</label>
<input
value={player.agent||""}
onChange={e=>updateField("agent",e.target.value)}
/>

<label>EliteProspects Link</label>
<input
value={player.epLink||""}
onChange={e=>updateField("epLink",e.target.value)}
/>

<label>InStat Link</label>
<input
value={player.instatLink||""}
onChange={e=>updateField("instatLink",e.target.value)}
/>

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
<b>{t.coach} — {t.date}</b>
<div><b>{t.type}</b></div>
<div>{t.notes || t.score || ""}</div>
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
placeholder="Coach"
value={reportForm.coach}
onChange={e=>setReportForm({...reportForm,coach:e.target.value})}
/>

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
placeholder="Game Report Notes"
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
placeholder="Coach"
value={noteForm.coach}
onChange={e=>setNoteForm({...noteForm,coach:e.target.value})}
/>

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
placeholder="Coach"
value={contactForm.coach}
onChange={e=>setContactForm({...contactForm,coach:e.target.value})}
/>

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
onClick={saveSections}
>
Save Changes
</button>

</div>

</div>

</div>

);

}
