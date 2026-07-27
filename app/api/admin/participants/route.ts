import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
export async function POST(request:Request){const session=await getSession();if(session?.role!=="ADMIN")return NextResponse.json({error:"Not authorised."},{status:403});const {name,email,phone,password,conversionDate,location}=await request.json();if(!name||!email||!password)return NextResponse.json({error:"Name, email and temporary password are required."},{status:400});const id=randomUUID();try{await db.execute("INSERT INTO users (id,full_name,email,phone,password_hash,role) VALUES (?,?,?,?,?,'PARTICIPANT')",[id,String(name).trim(),String(email).trim().toLowerCase(),phone||null,await bcrypt.hash(String(password),12)]);await db.execute("INSERT INTO participant_profiles (user_id,conversion_date,location,registered_by) VALUES (?,?,?,?)",[id,conversionDate||null,location||null,session.id]);return NextResponse.json({ok:true});}catch{return NextResponse.json({error:"This email may already be registered."},{status:400});}}
