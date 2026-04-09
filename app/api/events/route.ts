import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const events = await prisma.calendarEvent.findMany({
      orderBy: { startDateTime: "asc" },
    });
    return NextResponse.json(events);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const event = await prisma.calendarEvent.create({ data: body });
    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
