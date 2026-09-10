import { NextRequest, NextResponse } from "next/server";
import { getAllInvoices, createInvoice } from "@/lib/invoices";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: NextRequest) {
  const user = await getCurrentUser();
  const searchParams = req.nextUrl.searchParams;
  const status = searchParams.get("status") || undefined;

  const invoices = await getAllInvoices(status);

  // If user is guest/user, mask amounts and client emails
  if (user?.role === "guest" || user?.role === "user") {
    const masked = invoices.map((inv) => ({
      ...inv,
      clientEmail: "••••••••@client.org",
      totalAmount: 99999, // masked placeholder
      lineItems: inv.lineItems.map((li) => ({
        ...li,
        rate: 0,
        amount: 0,
      })),
    }));
    return NextResponse.json(masked);
  }

  return NextResponse.json(invoices);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (user?.role !== "superadmin" && user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const newInvoice = await createInvoice(body);
    return NextResponse.json(newInvoice, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create invoice" }, { status: 500 });
  }
}
