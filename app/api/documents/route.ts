import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";

    const documents = await prisma.document.findMany({
      where: search
        ? {
            OR: [
              { filename: { contains: search, mode: "insensitive" } },
              { documentType: { contains: search, mode: "insensitive" } },
              { tags: { contains: search, mode: "insensitive" } },
            ],
          }
        : undefined,
      orderBy: { uploadedAt: "desc" },
    });

    return NextResponse.json(documents);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch documents" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const document = await prisma.document.create({ data: body });
    return NextResponse.json(document, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create document" }, { status: 500 });
  }
}
