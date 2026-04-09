import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const lawyer = await prisma.lawyer.update({
      where: { id: params.id },
      data: body,
    });
    return NextResponse.json(lawyer);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update lawyer" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.lawyer.delete({ where: { id: params.id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete lawyer" }, { status: 500 });
  }
}
