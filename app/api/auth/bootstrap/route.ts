import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { signSession } from "@/lib/auth";

export async function POST(request: Request) {
  const { name, email, phone, password } = await request.json();
  if (!name || !email || !password || String(password).length < 8) return NextResponse.json({ error: "Enter your name, email, and a password of at least 8 characters." }, { status: 400 });
  const [rows] = await db.query("SELECT id FROM users LIMIT 1");
  if (Array.isArray(rows) && rows.length) return NextResponse.json({ error: "The first administrator has already been created. Please sign in." }, { status: 403 });
  const id = randomUUID();
  await db.execute("INSERT INTO users (id, full_name, email, phone, password_hash, role) VALUES (?, ?, ?, ?, ?, 'ADMIN')", [id, String(name).trim(), String(email).trim().toLowerCase(), phone ? String(phone).trim() : null, await bcrypt.hash(String(password), 12)]);
  const response = NextResponse.json({ ok: true });
  response.cookies.set("followhim_session", await signSession({ id, name: String(name).trim(), role: "ADMIN" }), { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 60 * 60 * 24 * 7 });
  return response;
}
