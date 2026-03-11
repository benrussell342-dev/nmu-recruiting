"use client";

import { useState,useEffect } from "react";
import { db } from "../lib/firebase";
import { doc,setDoc,getDoc } from "firebase/firestore";

const GREEN="#00563F";
const GOLD="#CFB53B";

const COACHES=[
"Dave Shyiak",
"Andy Contois",
"Phil Fox",
"Ben Russell"
];

const MONTHS=[
"January","February","March","April",
"May","June","July","August",
"September","October","November","December"
];

export default function RecruitingCalendar({onClose}){

const [month,setMonth]=useState(new Date().getMonth());
const [year,setYear]=useState(new Date().getFullYear());
const [trips,setTrips]=useState({});
const [selected,setSelected]=useState(null);

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

async function save(updated){

setTrips(updated);

await setDoc(doc(db,"calendar","recruiting"),{
trips:updated
});

}

function addTrip(day){

const key=`${year}-${month}-${day}`;

const updated={...trips};

updated[key]={
coach:"",
location:"",
games:[]
};

save(updated);

}

function addGame(){

const updated={...trips};

updated[selected].games.push({
date:"",
home:"",
away:""
});

save(updated);

}

const daysInMonth=new Date(year,month+1,0).getDate();

return(

<div style={{
background:GREEN,
minHeight:"100vh",
padding:30,
fontFamily:"Arial"
}}>

<div style={{
display:"flex",
justifyContent:"space-between",
alignItems:"center"
}}>

<h1 style={{color:GOLD}}>Recruiting Calendar</h1>

<button onClick={onClose}>Back</button>

</div>

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

<div style={{
display:"grid",
gridTemplateColumns:"repeat(7,1fr)",
gap:10,
marginTop:30
}}>

{Array.from({length:daysInMonth}).map((_,i)=>{

const day=i+1;

const key=`${year}-${month}-${day}`;

const trip=trips[key];

return(

<div
key={day}
style={{
background:"#fff",
minHeight:100,
padding:8,
borderRadius:6
}}
>

<b>{day}</b>

{trip ? (

<div
onClick={()=>setSelected(key)}
style={{
marginTop:5,
background:GOLD,
padding:4,
cursor:"pointer"
}}
>

{trip.coach}

</div>

):(

<button
onClick={()=>addTrip(day)}
style={{marginTop:5}}
>

Add Trip

</button>

)}

</div>

);

})}

</div>

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
width:500
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

{COACHES.map(c=>(
<option key={c}>{c}</option>
))}

</select>

<input
placeholder="Location"
value={trips[selected].location}
onChange={e=>{

const updated={...trips};

updated[selected].location=e.target.value;

save(updated);

}}
style={{display:"block",marginTop:10}}
/>

<h3 style={{marginTop:20}}>Games</h3>

{trips[selected].games.map((g,i)=>(

<div key={i} style={{marginBottom:10}}>

<input
placeholder="Date"
value={g.date}
onChange={e=>{

const updated={...trips};

updated[selected].games[i].date=e.target.value;

save(updated);

}}
/>

<input
placeholder="Away"
value={g.away}
onChange={e=>{

const updated={...trips};

updated[selected].games[i].away=e.target.value;

save(updated);

}}
/>

<input
placeholder="Home"
value={g.home}
onChange={e=>{

const updated={...trips};

updated[selected].games[i].home=e.target.value;

save(updated);

}}
/>

</div>

))}

<button onClick={addGame}>Add Game</button>

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
