import Link from "next/link";
import LoginForm from "../login-form";
export default function ParticipantLogin(){return <main className="auth"><section className="box"><Link className="brand" href="/login">← FOLLOW<span>HIM</span></Link><div className="role-heading"><span>♡</span><div><h1>Participant sign in</h1><p>Continue your daily journey with Jesus.</p></div></div><LoginForm role="PARTICIPANT"/></section></main>;}
