"use client";

import { useState,useEffect } from "react";
import { db } from "../lib/firebase";
import { collection,onSnapshot } from "firebase/firestore";

import RecruitBoard from "../components/RecruitBoard";
import AddPlayerModal from "../components/AddPlayerModal";
import PlayerProfile from "../components/PlayerProfile";
import DepthChart from "../components/DepthChart";

export default function Page(){

const [players,setPlayers]=useState([]);
const [selected,setSelected]=useState(null);
const [showAdd,setShowAdd]=useState(false);
const [showDepth,setShowDepth]=useState(false);

useEffect(()=>{

const unsub=onSnapshot(collection(db,"players"),snap=>{

setPlayers(
snap.docs.map(d=>({
id:d.id,
...d.data()
}))
);

});

return ()=>unsub();

},[]);

return(

<div>

<RecruitBoard
players={players}
setSelected={setSelected}
openAdd={()=>setShowAdd(true)}
openDepth={()=>setShowDepth(true)}
/>

{showAdd &&
<AddPlayerModal
close={()=>setShowAdd(false)}
/>
}

{selected &&
<PlayerProfile
player={selected}
close={()=>setSelected(null)}
/>
}

{showDepth &&
<DepthChart
players={players}
close={()=>setShowDepth(false)}
/>
}

</div>

);

}
