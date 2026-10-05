"use server";

import { signIn, signOut } from "@/auth";

/** Only allow same-site relative redirects. */
function safeRedirect(value: FormDataEntryValue | null): string {
  const v = typeof value === "string" ? value : "/";
  return v.startsWith("/") && !v.startsWith("//") ? v : "/";
}

export async function signInWithGoogle(formData: FormData) {
  await signIn("google", { redirectTo: safeRedirect(formData.get("redirectTo")) });
}

export async function signOutAction() {
  await signOut({ redirectTo: "/" });
}
