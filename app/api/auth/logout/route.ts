import { NextResponse } from "next/server";
export async function POST(){const response=NextResponse.json({ok:true});response.cookies.set("followhim_session","",{path:"/",maxAge:0});return response;}
