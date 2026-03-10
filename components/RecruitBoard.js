"use client";

import { useState } from "react";
import { db } from "../lib/firebase";
import { updateDoc, doc } from "firebase/firestore";

const GREEN="#00563F";
const GOLD="#CFB53B";

export default function PlayerProfile({player,onClose}){

const [edit,setEdit]=useState(false);

async function updateField(field,value){

await updateDoc(doc(db,"players",player.id),{
[field]:value
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

<h2 style={{color:GREEN}}>{player.name}</h2>

<span
onClick={()=>setEdit(!edit)}
style={{cursor:"pointer"}}

>

✏️ </span>

</div>

<div style={{marginTop:20,lineHeight:2}}>

<label>Team</label>

{edit
?
<input
defaultValue={player.team}
onBlur={e=>updateField("team",e.target.value)}
/>
:

<p>{player.team}</p>
}

<label>League</label>

{edit
?
<input
defaultValue={player.league}
onBlur={e=>updateField("league",e.target.value)}
/>
:

<p>{player.league}</p>
}

<label>Position</label>

{edit
?
<input
defaultValue={player.position}
onBlur={e=>updateField("position",e.target.value)}
/>
:

<p>{player.position}</p>
}

<label>BirthYear</label>

{edit
?
<input
defaultValue={player.birthYear}
onBlur={e=>updateField("birthYear",e.target.value)}
/>
:

<p>{player.birthYear}</p>
}

<label>Height</label>

{edit
?
<input
defaultValue={player.height}
onBlur={e=>updateField("height",e.target.value)}
/>
:

<p>{player.height}</p>
}

<label>Weight</label>

{edit
?
<input
defaultValue={player.weight}
onBlur={e=>updateField("weight",e.target.value)}
/>
:

<p>{player.weight}</p>
}

<label>Hand</label>

{edit
?
<input
defaultValue={player.hand}
onBlur={e=>updateField("hand",e.target.value)}
/>
:

<p>{player.hand}</p>
}

<label>Agent</label>

{edit
?
<input
defaultValue={player.agent}
onBlur={e=>updateField("agent",e.target.value)}
/>
:

<p>{player.agent}</p>
}

</div>

<button
style={{marginTop:30}}
onClick={onClose}

>

Back </button>

</div>

{/* RIGHT COLUMN remains unchanged (reports / notes / timeline etc.) */}

</div>

</div>

);

}
