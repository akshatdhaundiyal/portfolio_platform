import { NextRequest, NextResponse } from "next/server";
import { updateClient, deleteClient, getClientById } from "@/lib/clients";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const client = await getClientById(id);
  if (!client) return NextResponse.json({ error: "Client not found" }, { status: 404 });
  return NextResponse.json(client);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (user?.role !== "superadmin" && user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const updated = await updateClient(id, body);
  if (!updated) return NextResponse.json({ error: "Client not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (user?.role !== "superadmin") {
    return NextResponse.json({ error: "Unauthorized. Super Admin role required." }, { status: 403 });
  }

  const { id } = await params;
  const success = await deleteClient(id);
  return NextResponse.json({ success });
}
