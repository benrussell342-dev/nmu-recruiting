"use client";

import { useState,useEffect } from "react";
import { db } from "../lib/firebase";
import { doc,setDoc,getDoc } from "firebase/firestore";

const GREEN="#00563F";
const GOLD="#CFB53B";

/* coach colors */

const COACHES={
"Dave Shyiak":"#e74c3c",
"Andy Contois":"#3498db",
"Phil Fox":"#27ae60",
"Ben Russell":"#f1c40f"
};

const MONTHS=[
"January","February","March","April","May","June",
"July","August","September","October","November","December"
];

const WEEKDAYS=["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

export default function RecruitingCalendar({onClose}){

const today=new Date();

const [month,setMonth]=useState(today.getMonth());
const [year,setYear]=useState(today.getFullYear());

const [trips,setTrips]=useState({});
const [selected,setSelected]=useState(null);

/* load calendar */

useEffect(()=>{

async function load(){

const ref=doc(db,"calendar","recruiting");
const snap=await getDoc(ref);

if(snap.exists()){
setTrips(snap.data().trips||{});
}

}

load();

},[]);

/* save */

async function save(updated){

setTrips(updated);

await setDoc(doc(db,"calendar","recruiting"),{
trips:updated
});

}

/* helper to format YYYY-MM-DD */

function formatDate(d){

return d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");

}

/* add trip */

function addTrip(day){

const date = new Date(year,month,day);

const formatted =
date.getFullYear()+"-"+String(date.getMonth()+1).padStart(2,"0")+"-"+String(date.getDate()).padStart(2,"0");

const id = Date.now().toString();

const updated={...trips};

updated[id]={
coach:"",
start:formatted,
end:formatted,
games:[]
};

/* save trip */

save(updated);

/* open trip editor immediately */

setSelected(id);

}

/* delete trip */

function deleteTrip(id){

if(!confirm("Delete trip?")) return;

const updated={...trips};

delete updated[id];

save(updated);

setSelected(null);

}

/* add game */

function addGame(){

const updated={...trips};

updated[selected].games.push({
team1:"",
team2:"",
date:"",
time:"",
location:""
});

save(updated);

}

/* days in month */

const daysInMonth=new Date(year,month+1,0).getDate();

/* check trips for each day */

function tripsForDay(day){

const date=new Date(year,month,day);

return Object.entries(trips).filter(([id,t])=>{

const start=new Date(t.start);
const end=new Date(t.end);

return date>=start && date<=end;

});

}

return(

<div style={{
background:GREEN,
minHeight:"100vh",
padding:30,
fontFamily:"Arial"
}}>

{/* header */}

<div style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center"
}}>

<h1 style={{color:GOLD}}>Recruiting Calendar</h1>

<button onClick={onClose}>Back</button>

</div>

{/* month selector */}

<div style={{
display:"flex",
gap:20,
marginTop:20
}}>

<select
value={month}
onChange={e=>setMonth(parseInt(e.target.value))}
>

{MONTHS.map((m,i)=>(
<option value={i} key={i}>{m}</option>
))}

</select>

<input
value={year}
onChange={e=>setYear(e.target.value)}
style={{width:80}}
/>

</div>

{/* weekday header */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(7,1fr)",
marginTop:20,
color:"#fff",
fontWeight:"bold"
}}>

{WEEKDAYS.map(d=>(
<div key={d} style={{textAlign:"center"}}>
{d}
</div>
))}

</div>

{/* calendar grid */}

<div style={{
display:"grid",
gridTemplateColumns:"repeat(7,1fr)",
gap:10,
marginTop:10
}}>

{Array.from({length:daysInMonth}).map((_,i)=>{

const day=i+1;

const dayTrips=tripsForDay(day);

return(

<div
key={day}
style={{
background:"#fff",
minHeight:120,
padding:8,
borderRadius:6
}}
>

<b>{day}</b>

{dayTrips.map(([id,t])=>(

<div
key={id}
onClick={()=>setSelected(id)}
style={{
marginTop:6,
padding:4,
background:COACHES[t.coach]||"#ccc",
cursor:"pointer",
borderRadius:4,
color:"#fff"
}}
>

{t.coach || "Trip"}

</div>

))}

<button
onClick={(e)=>{
e.stopPropagation();
addTrip(day);
}}
style={{
marginTop:6,
fontSize:12
}}
>
Add Trip
</button>

</div>

);

})}

</div>

{/* trip editor */}

{selected && (

<div style={{
position:"fixed",
top:0,
left:0,
right:0,
bottom:0,
background:"#0008",
display:"flex",
justifyContent:"center",
alignItems:"center"
}}>

<div style={{
background:"#fff",
padding:30,
width:600
}}>

<h2>Trip Details</h2>

<select
value={trips[selected].coach}
onChange={e=>{

const updated={...trips};
updated[selected].coach=e.target.value;

save(updated);

}}
>

<option value="">Coach</option>

{Object.keys(COACHES).map(c=>(
<option key={c}>{c}</option>
))}

</select>

<div style={{marginTop:10}}>

Start Date

<input
type="date"
value={trips[selected].start}
onChange={e=>{

const updated={...trips};
updated[selected].start=e.target.value;

save(updated);

}}
/>

</div>

<div style={{marginTop:10}}>

End Date

<input
type="date"
value={trips[selected].end}
onChange={e=>{

const updated={...trips};
updated[selected].end=e.target.value;

save(updated);

}}
/>

</div>

<h3 style={{marginTop:20}}>Games</h3>

{trips[selected].games.map((g,i)=>(

<div key={i}

style={{
border:"1px solid #ddd",
padding:10,
marginBottom:10
}}

>

<input
placeholder="Team 1"
value={g.team1}
onChange={e=>{

const updated={...trips};
updated[selected].games[i].team1=e.target.value;

save(updated);

}}
/>

<input
placeholder="Team 2"
value={g.team2}
onChange={e=>{

const updated={...trips};
updated[selected].games[i].team2=e.target.value;

save(updated);

}}
/>

<input
type="date"
value={g.date}
onChange={e=>{

const updated={...trips};
updated[selected].games[i].date=e.target.value;

save(updated);

}}
/>

<input
type="time"
value={g.time}
onChange={e=>{

const updated={...trips};
updated[selected].games[i].time=e.target.value;

save(updated);

}}
/>

<input
placeholder="Location"
value={g.location}
onChange={e=>{

const updated={...trips};
updated[selected].games[i].location=e.target.value;

save(updated);

}}
/>

</div>

))}

<button onClick={addGame}>
Add Game
</button>

<button
onClick={()=>deleteTrip(selected)}
style={{marginLeft:10}}
>
Delete Trip
</button>

<button
onClick={()=>setSelected(null)}
style={{marginLeft:10}}
>
Close
</button>

</div>

</div>

)}

</div>

);

}
