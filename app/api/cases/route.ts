import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const cases = await prisma.case.findMany({
      where: search
        ? {
            OR: [
              { caseNumber: { contains: search, mode: "insensitive" } },
              { title: { contains: search, mode: "insensitive" } },
              { type: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(cases);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch cases" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const newCase = await prisma.case.create({ data: body });
    return NextResponse.json(newCase, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create case" }, { status: 500 });
  }
}
