import Link from "next/link";
import LoginForm from "../login-form";
export default function SupervisorLogin(){return <main className="auth"><section className="box"><Link className="brand" href="/login">← FOLLOW<span>HIM</span></Link><div className="role-heading"><span>◉</span><div><h1>Supervisor sign in</h1><p>Care for and guide your assigned group.</p></div></div><LoginForm role="SUPERVISOR"/></section></main>;}
