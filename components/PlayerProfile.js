"use client";

import { useState } from "react";
import { db } from "../lib/firebase";
import { updateDoc, doc } from "firebase/firestore";
import { auth } from "../lib/firebase";

const GREEN="#00563F";
const GOLD="#CFB53B";

function getInitials(){

const email = auth.currentUser?.email;

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

const [showReports,setShowReports]=useState(true);
const [showNotes,setShowNotes]=useState(true);
const [showContacts,setShowContacts]=useState(true);
const [showTimeline,setShowTimeline]=useState(true);

async function save(){

await updateDoc(doc(db,"players",player.id),{

reports,
notes,
contacts

});

alert("Saved");

}

function addNote(text){

setNotes([...notes,{
text,
date:new Date().toLocaleDateString(),
initials:getInitials()
}]);

}

function addReport(text){

setReports([...reports,{
text,
date:new Date().toLocaleDateString(),
initials:getInitials()
}]);

}

function addContact(text){

setContacts([...contacts,{
text,
date:new Date().toLocaleDateString(),
initials:getInitials()
}]);

}

function deleteEntry(list,setList,index){

const copy=[...list];
copy.splice(index,1);
setList(copy);

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

<h2 style={{color:GOLD}}>
Player Profile
</h2>

</div>

<div style={{padding:40}}>

<button onClick={onClose}>Back</button>

<h1 style={{color:GREEN}}>
{player.name}
</h1>

{/* Activity Timeline */}

<h3 onClick={()=>setShowTimeline(!showTimeline)}
style={{cursor:"pointer",color:GOLD}}>
Activity Timeline
</h3>

{showTimeline && (

<div>

{timeline.map((t,i)=>(

<div key={i} style={{
border:"1px solid #ddd",
padding:10,
marginTop:8,
background:"#fff"
}}>

<b>{t.date} ({t.initials})</b>

<div style={{fontWeight:"bold"}}>
{t.type}
</div>

<div>{t.text}</div>

</div>

))}

</div>

)}

{/* Scout Notes */}

<h3 onClick={()=>setShowNotes(!showNotes)}
style={{cursor:"pointer",color:GOLD}}>
Scout Notes
</h3>

{showNotes && (

<div>

<textarea
placeholder="Add scout note"
onBlur={e=>addNote(e.target.value)}
/>

{notes.map((n,i)=>(

<div key={i} style={{marginTop:10}}>

<b>{n.date} ({n.initials})</b>

<div>{n.text}</div>

<button onClick={()=>deleteEntry(notes,setNotes,i)}>
Delete
</button>

</div>

))}

</div>

)}

{/* Game Reports */}

<h3 onClick={()=>setShowReports(!showReports)}
style={{cursor:"pointer",color:GOLD}}>
Game Reports
</h3>

{showReports && (

<div>

<textarea
placeholder="Add report"
onBlur={e=>addReport(e.target.value)}
/>

{reports.map((r,i)=>(

<div key={i} style={{marginTop:10}}>

<b>{r.date} ({r.initials})</b>

<div>{r.text}</div>

<button onClick={()=>deleteEntry(reports,setReports,i)}>
Delete
</button>

</div>

))}

</div>

)}

{/* Contact Log */}

<h3 onClick={()=>setShowContacts(!showContacts)}
style={{cursor:"pointer",color:GOLD}}>
Contact Log
</h3>

{showContacts && (

<div>

<textarea
placeholder="Add contact"
onBlur={e=>addContact(e.target.value)}
/>

{contacts.map((c,i)=>(

<div key={i} style={{marginTop:10}}>

<b>{c.date} ({c.initials})</b>

<div>{c.text}</div>

<button onClick={()=>deleteEntry(contacts,setContacts,i)}>
Delete
</button>

</div>

))}

</div>

)}

<button
style={{marginTop:30}}
onClick={save}
>

Save Changes

</button>

</div>

</div>

);

}
