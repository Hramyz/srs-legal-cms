import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");

    const lawyers = await prisma.lawyer.findMany({
      where: {
        ...(status ? { status } : {}),
        ...(search
          ? {
              OR: [
                { firstName: { contains: search, mode: "insensitive" } },
                { lastName: { contains: search, mode: "insensitive" } },
                { email: { contains: search, mode: "insensitive" } },
                { specialization: { contains: search, mode: "insensitive" } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(lawyers);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch lawyers" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const lawyer = await prisma.lawyer.create({ data: body });
    return NextResponse.json(lawyer, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create lawyer" }, { status: 500 });
  }
}
