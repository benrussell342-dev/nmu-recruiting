"use client";

import { useState } from "react";

import RecruitBoard from "../components/RecruitBoard";

import Login from "../components/Login";

export default function Page(){

const [user,setUser] = useState(null);

if(!user){

return <Login setUser={setUser} />;

}

return <RecruitBoard />;

}
