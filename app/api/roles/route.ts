import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const roles = await prisma.role.findMany({
      orderBy: { createdAt: "asc" },
    });
    return NextResponse.json(roles);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch roles" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const role = await prisma.role.create({ data: body });
    return NextResponse.json(role, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create role" }, { status: 500 });
  }
}
