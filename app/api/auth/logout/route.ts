import { NextResponse } from "next/server";
import { clearAuthCookie } from "../../../../lib/jwt";

export async function POST() {
  const response = NextResponse.json({
    message: "Successfully Logout!",
    success: true,
  });
  clearAuthCookie(response);
  return response;
}
