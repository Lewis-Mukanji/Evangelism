"use client";
import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import IconButton from "@mui/material/IconButton";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

export default function LoginForm({ role }: { role: "ADMIN" | "SUPERVISOR" | "PARTICIPANT" }) {
  const router = useRouter(); const [error,setError]=useState(""); const [loading,setLoading]=useState(false); const [showPassword,setShowPassword]=useState(false);
  async function submit(e:FormEvent<HTMLFormElement>){e.preventDefault();setLoading(true);setError("");const form=new FormData(e.currentTarget);const response=await fetch("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email:form.get("email"),password:form.get("password"),role})});const data=await response.json().catch(()=>({}));if(!response.ok){setError(data.error||"Could not sign in.");setLoading(false);return;}router.push("/dashboard");router.refresh();}
  return <form onSubmit={submit}><div className="field"><label>Email address</label><input required type="email" name="email" autoComplete="email"/></div><div className="field"><label>Password</label><div className="password-wrap"><input required type={showPassword?"text":"password"} name="password" autoComplete="current-password"/><IconButton aria-label={showPassword?"Hide password":"Show password"} onClick={()=>setShowPassword(!showPassword)} size="small">{showPassword?<VisibilityOff fontSize="small"/>:<Visibility fontSize="small"/>}</IconButton></div></div>{error&&<p className="error">{error}</p>}<button className="button" style={{width:"100%"}} disabled={loading}>{loading?"Signing in...":`Sign in as ${role.toLowerCase()}`}</button></form>;
}
