import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const enquiries = await prisma.enquiry.findMany({
      where: search
        ? {
            OR: [
              { clientName: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { subject: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(enquiries);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch enquiries" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const enquiry = await prisma.enquiry.create({ data: body });
    return NextResponse.json(enquiry, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create enquiry" }, { status: 500 });
  }
}
