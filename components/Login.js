"use client";

import { useState } from "react";

import { signInWithEmailAndPassword } from "firebase/auth";

import { auth } from "../lib/firebase";

export default function Login({setUser}){

const [email,setEmail] = useState("");

const [password,setPassword] = useState("");

async function login(){

try{

const result = await signInWithEmailAndPassword(
auth,
email,
password
);

setUser(result.user);

}catch(err){

alert("Login failed");

}

}

return(

<div style={{padding:40}}>

<h2>NMU Recruiting Login</h2>

<input
placeholder="Email"
onChange={(e)=>setEmail(e.target.value)}
/>

<input
type="password"
placeholder="Password"
onChange={(e)=>setPassword(e.target.value)}
/>

<button onClick={login}>
Login
</button>

</div>

);

}
