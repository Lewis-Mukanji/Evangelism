import Link from "next/link";
import LoginForm from "../login-form";
export default function AdminLogin(){return <main className="auth"><section className="box"><Link className="brand" href="/login">← FOLLOW<span>HIM</span></Link><div className="role-heading"><span>✦</span><div><h1>Administrator sign in</h1><p>Manage and lead your discipleship ministry.</p></div></div><LoginForm role="ADMIN"/><p>First administrator? <Link href="/setup" style={{color:"#b51d2a",fontWeight:700}}>Set up FOLLOWHIM</Link></p></section></main>;}
