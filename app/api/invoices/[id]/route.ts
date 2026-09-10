import { NextRequest, NextResponse } from "next/server";
import { updateInvoice, deleteInvoice, getInvoiceById } from "@/lib/invoices";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const invoice = await getInvoiceById(id);
  if (!invoice) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  return NextResponse.json(invoice);
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (user?.role !== "superadmin" && user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
  }

  const { id } = await params;
  const body = await req.json();
  const updated = await updateInvoice(id, body);
  if (!updated) return NextResponse.json({ error: "Invoice not found" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const user = await getCurrentUser();
  if (user?.role !== "superadmin") {
    return NextResponse.json({ error: "Unauthorized. Super Admin role required." }, { status: 403 });
  }

  const { id } = await params;
  const success = await deleteInvoice(id);
  return NextResponse.json({ success });
}
