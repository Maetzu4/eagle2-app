import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";


export async function POST(req : Request) {

    const data = await req.json();

    const newNote = await prisma.note.create({
        data: data,
      });

      return NextResponse.json(newNote, { status: 201 });
    
}