"use client";
import { useRouter } from "next/navigation";
export default function LogoutButton(){const router=useRouter();return <button onClick={async()=>{await fetch("/api/auth/logout",{method:"POST"});router.push("/");router.refresh();}} style={{border:0,background:"none",padding:"11px 12px",textAlign:"left",color:"#62595b",cursor:"pointer",fontSize:14}}>Sign out</button>;}
