import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { saveFile } from "../utils/fileupload";
import { cookieOptions } from "../utils/cookies";

const prisma = new PrismaClient();

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const cakeId = Number(id);

    if (isNaN(cakeId)) {
      return NextResponse.json({ error: "Invalid cake ID" }, { status: 400 });
    }

    const formData = await req.formData();
    const name = formData.get("name") as string | null;
    const priceStr = formData.get("price") as string | null;
    const price = priceStr ? parseFloat(priceStr) : undefined;
    const file = formData.get("file") as File | null;
    const description = formData.get("description") as string | null;
    const sortedBy = JSON.parse(formData.get("sortedBy") as string);

    if (!name && !price && !file && !description) {
      return NextResponse.json(
        { error: "No fields provided to update" },
        { status: 400 }
      );
    }

    const existingcake = await prisma.cake.findUnique({
      where: { id: cakeId },
    });
    if (!existingcake) {
      return NextResponse.json({ error: "cake not found" }, { status: 404 });
    }

    const updateData: Record<string, any> = {};
    if (name) updateData.name = name;
    if (price !== undefined && !isNaN(price)) updateData.price = price;
    if (file) updateData.image = await saveFile(file);
    if (description) updateData.description = description;

    const updatedcake = await prisma.cake.update({
      where: { id: cakeId },
      data: updateData,
    });

    const response = NextResponse.json(updatedcake);

    response.cookies.set("sortedBy", JSON.stringify(sortedBy), {
      ...cookieOptions,
      httpOnly: false,
    });
    return response;
  } catch (err) {
    console.error("Error updating cake:", err);
    return NextResponse.json(
      { error: "Failed to update cake" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const cakeId = parseInt(id);

  const url = new URL(req.url);
  const sortedBy = url.searchParams.get("sortedBy");
  const sortedByObj = sortedBy ? JSON.parse(sortedBy) : null;

  if (isNaN(cakeId)) {
    return NextResponse.json({ error: "Invalid cake ID" }, { status: 400 });
  }

  try {
    const cake = await prisma.cake.delete({ where: { id: cakeId } });
    const response = NextResponse.json(cake, { status: 200 });
    response.cookies.set("sortedBy", JSON.stringify(sortedByObj), {
      ...cookieOptions,
      httpOnly: false,
    });
    return response;
  } catch (error: any) {
    if (error.code === "P2025") {
      return NextResponse.json({ error: "cake not found" }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
