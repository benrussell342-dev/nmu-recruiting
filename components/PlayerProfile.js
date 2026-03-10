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

const [showTimeline,setShowTimeline]=useState(true);

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
type:"Call",
date:"",
notes:""
});

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

alert("Saved");

}

function addReport(){

setReports([...reports,{
type:"Game Report",
...reportForm
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
type:"Scout Note",
...noteForm
}]);

setNoteForm({
coach:"",
date:"",
notes:""
});

}

function addContact(){

setContacts([...contacts,{
type:"Contact Log",
...contactForm
}]);

setContactForm({
type:"Call",
date:"",
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

<div style={{display:"flex",alignItems:"center",gap:10}}>

<h2 style={{color:GREEN}}>{playerData.name}</h2>

<span
onClick={()=>setEdit(true)}
style={{cursor:"pointer"}}

>

✏️ </span>

</div>

<div style={{marginTop:15,lineHeight:1.5}}>

{[
["Team","team"],
["League","league"],
["Position","position"],
["Birthyear","birthYear"],
["Height","height"],
["Weight","weight"],
["Hand","hand"],
["Agent","agent"]
].map(([label,key])=>(

<div key={key} style={{marginBottom:6}}>

<b>{label}</b>

{edit
?
<input
value={playerData[key]||""}
onChange={e=>setPlayerData({...playerData,[key]:e.target.value})}
/>
:

<p>{playerData[key]}</p>
}

</div>

))}

<div style={{marginBottom:6}}>
<b>EP Profile</b>
<a href={playerData.epLink} target="_blank">
{playerData.epLink}
</a>
</div>

<div style={{marginBottom:6}}>
<b>InStat</b>
<a href={playerData.instatLink} target="_blank">
{playerData.instatLink}
</a>
</div>

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

<div>{t.notes || t.score}</div>

</div>

))}

{/* GAME REPORTS */}

<h3 style={{color:GOLD,marginTop:30}}>Game Reports</h3>

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
placeholder="Report Notes"
value={reportForm.notes}
onChange={e=>setReportForm({...reportForm,notes:e.target.value})}
/>

<button onClick={addReport}>Add Report</button>

</div>

{/* SCOUT NOTES */}

<h3 style={{color:GOLD,marginTop:30}}>Scout Notes</h3>

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
placeholder="Notes"
value={noteForm.notes}
onChange={e=>setNoteForm({...noteForm,notes:e.target.value})}
/>

<button onClick={addNote}>Add Note</button>

</div>

{/* CONTACT LOG */}

<h3 style={{color:GOLD,marginTop:30}}>Contact Log</h3>

<div style={{background:"#fff",padding:15}}>

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

<input
type="date"
value={contactForm.date}
onChange={e=>setContactForm({...contactForm,date:e.target.value})}
/>

<textarea
placeholder="Notes"
value={contactForm.notes}
onChange={e=>setContactForm({...contactForm,notes:e.target.value})}
/>

<button onClick={addContact}>Add Contact</button>

</div>

<button
style={{marginTop:30}}
onClick={saveSections}
>
Save Updates
</button>

</div>

</div>

</div>

);

}
