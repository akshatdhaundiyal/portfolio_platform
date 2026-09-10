import { NextRequest, NextResponse } from "next/server";
import { getWorkspaceSettings, updateWorkspaceSettings } from "@/lib/settings";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  const settings = await getWorkspaceSettings();
  const user = await getCurrentUser();

  // If user is not superadmin, omit raw passcodes
  if (user?.role !== "superadmin") {
    const safeSettings = {
      ...settings,
      rolesConfig: {
        superAdminPasscode: "••••••••",
        adminPasscode: "••••••••",
        devPasscode: "••••••••",
      },
    };
    return NextResponse.json(safeSettings);
  }

  return NextResponse.json(settings);
}

export async function POST(req: NextRequest) {
  const user = await getCurrentUser();
  if (user?.role !== "superadmin" && user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized. Admin or Super Admin role required to update workspace settings." }, { status: 403 });
  }

  try {
    const body = await req.json();
    if (user?.role !== "superadmin" && body.rolesConfig) {
      delete body.rolesConfig;
    }
    const updated = await updateWorkspaceSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Failed to update settings" }, { status: 500 });
  }
}
