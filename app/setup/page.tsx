import Link from "next/link";
import SetupForm from "./setup-form";
export default function SetupPage(){return <main className="auth"><section className="box"><Link className="brand" href="/">FOLLOW<span>HIM</span></Link><h1>Set up FOLLOWHIM</h1><p>Create the first administrator. This option closes after the first account is created.</p><SetupForm/></section></main>;}
