import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import LogoutButton from "./logout-button";

async function count(sql: string, params: unknown[] = []) { const [rows] = await db.query(sql, params); return Number((rows as { total: number }[])[0]?.total || 0); }

export default async function Dashboard(){
  const session=await getSession(); if(!session) redirect("/login");
  let values:{label:string;value:number;note:string}[]=[];
  if(session.role==="ADMIN") values=[
    {label:"New converts",value:await count("SELECT COUNT(*) total FROM participant_profiles"),note:"registered participants"},
    {label:"Active participants",value:await count("SELECT COUNT(*) total FROM users WHERE role='PARTICIPANT' AND status='ACTIVE'"),note:"currently journeying"},
    {label:"Disciples made",value:await count("SELECT COUNT(*) total FROM certificates WHERE issued_at IS NOT NULL"),note:"certificates issued"},
    {label:"Supervisors",value:await count("SELECT COUNT(*) total FROM users WHERE role='SUPERVISOR' AND status='ACTIVE'"),note:"caring for groups"}
  ];
  else if(session.role==="SUPERVISOR") values=[
    {label:"My participants",value:await count("SELECT COUNT(*) total FROM participant_profiles p JOIN discipleship_groups g ON p.group_id=g.id WHERE g.supervisor_id=?",[session.id]),note:"under your care"},
    {label:"Open follow-ups",value:await count("SELECT COUNT(*) total FROM follow_ups WHERE supervisor_id=? AND completed_at IS NULL",[session.id]),note:"need your attention"},
    {label:"Prayer requests",value:await count("SELECT COUNT(*) total FROM prayer_requests r JOIN participant_profiles p ON r.participant_id=p.user_id JOIN discipleship_groups g ON p.group_id=g.id WHERE g.supervisor_id=? AND r.status='OPEN'",[session.id]),note:"still open"},
    {label:"My groups",value:await count("SELECT COUNT(*) total FROM discipleship_groups WHERE supervisor_id=?",[session.id]),note:"small groups"}
  ];
  else values=[
    {label:"Current week",value:await count("SELECT current_week total FROM participant_profiles WHERE user_id=?",[session.id]),note:"of 12 weeks"},
    {label:"Classes attended",value:await count("SELECT COUNT(*) total FROM attendance WHERE participant_id=? AND status IN ('PRESENT','LATE')",[session.id]),note:"class and check-in"},
    {label:"Materials completed",value:0,note:"coming as materials are added"},
    {label:"Prayer requests",value:await count("SELECT COUNT(*) total FROM prayer_requests WHERE participant_id=?",[session.id]),note:"shared with your supervisor"}
  ];
  const title=session.role==="ADMIN"?"Ministry overview":session.role==="SUPERVISOR"?"Supervisor dashboard":"My discipleship journey";
  return <div className="app"><aside className="side"><Link className="brand" href="/dashboard">FOLLOW<span>HIM</span></Link><nav><Link href="/dashboard">Dashboard</Link>{session.role==="ADMIN"&&<><Link href="/admin/participants">Participants</Link><a href="#groups">Groups & supervisors</a><a href="#materials">Materials</a><a href="#reports">Reports</a></>}{session.role==="SUPERVISOR"&&<><a href="#groups">My groups</a><a href="#attendance">Attendance</a><a href="#followups">Follow-ups</a><a href="#prayer">Prayer requests</a></>}{session.role==="PARTICIPANT"&&<><a href="#journey">My 12-week journey</a><a href="#downloads">Downloads</a><a href="#prayer">Prayer requests</a></>}<LogoutButton/></nav></aside><main className="content"><section className="top"><div><div className="eyebrow">FOLLOWHIM</div><h1>{title}</h1><p>Welcome back, {session.name}.</p></div></section><section className="metrics">{values.map(item=><article className="metric" key={item.label}><small>{item.label}</small><strong>{item.value}</strong><small>{item.note}</small></article>)}</section><section className="panel"><h2>Getting started</h2><div className="empty">{session.role==="ADMIN"?"Your ministry workspace is ready. Add supervisors and groups, then register your first new convert to begin seeing live insights here.":session.role==="SUPERVISOR"?"When your administrator assigns a group to you, your participants, prayer requests, and follow-ups will appear here.":"Your supervisor will assign you to a group and publish your first daily material here."}</div></section></main></div>;
}
