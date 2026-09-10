import { NextRequest, NextResponse } from "next/server";
import { getAllClients, createClient } from "@/lib/clients";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const user = await getCurrentUser();
  const clients = await getAllClients();

  // If user is guest/user, mask contact email & total billed for confidentiality
  if (user?.role === "guest" || user?.role === "user") {
    const masked = clients.map((c) => ({
      ...c,
      email: "••••••••@client.org",
      totalBilled: "$••,•••,••• (Masked in Preview)",
    }));
    return NextResponse.json(masked);
  }

  return NextResponse.json(clients);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (user?.role !== "superadmin" && user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized. Admin role required." }, { status: 403 });
  }

  try {
    const body = await req.json();
    const newClient = await createClient(body);
    return NextResponse.json(newClient, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to create client" }, { status: 500 });
  }
}
