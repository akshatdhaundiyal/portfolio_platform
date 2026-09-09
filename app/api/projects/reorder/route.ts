import { NextRequest, NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { reorderProjects } from "@/lib/projects";

export async function POST(req: NextRequest) {
  try {
    const authed = await isAuthenticated();
    if (!authed) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orders } = body;

    if (!Array.isArray(orders)) {
      return NextResponse.json({ error: "orders array is required" }, { status: 400 });
    }

    const success = await reorderProjects(orders);
    return NextResponse.json({ success, message: "Order updated successfully" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to reorder projects" }, { status: 500 });
  }
}
