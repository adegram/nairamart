import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { signInWithGoogle } from "@/actions/auth";
import { Logo } from "@/components/brand/logo";
import { APP_NAME } from "@/lib/constants";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Sign in" };

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="size-5" aria-hidden>
      <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.1 24.5c0-1.6-.1-3.1-.4-4.5H24v8.5h12.4c-.5 2.9-2.2 5.3-4.6 6.9l7.4 5.7c4.3-4 6.9-9.9 6.9-16.6z" />
      <path fill="#FBBC05" d="M10.5 28.7c-.5-1.4-.8-2.9-.8-4.7s.3-3.2.8-4.7l-7.9-6.1C.9 16.4 0 20.1 0 24s.9 7.6 2.6 10.8l7.9-6.1z" />
      <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.4-5.7c-2.1 1.4-4.8 2.3-8.5 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
    </svg>
  );
}

export default async function SignInPage({ searchParams }: { searchParams: Promise<{ callbackUrl?: string; error?: string }> }) {
  const { callbackUrl, error } = await searchParams;
  const redirectTo = callbackUrl && callbackUrl.startsWith("/") && !callbackUrl.startsWith("//") ? callbackUrl : "/";

  const session = await auth().catch(() => null);
  if (session?.user) redirect(redirectTo);

  return (
    <div className="mx-auto flex max-w-sm flex-col items-center gap-5 rounded-box border border-base-300 bg-base-100 p-8 text-center">
      <Logo />
      <div>
        <h1 className="text-2xl font-extrabold">Welcome to {APP_NAME}</h1>
        <p className="mt-1 text-sm text-base-content/70">Sign in to complete your demo checkout.</p>
      </div>
      {error ? (
        <div role="alert" className="alert alert-error alert-soft text-sm">
          Sign-in failed. Please try again.
        </div>
      ) : null}
      <form action={signInWithGoogle} className="w-full">
        <input type="hidden" name="redirectTo" value={redirectTo} />
        <button className="btn btn-block border-base-300 bg-base-100 hover:bg-base-200">
          <GoogleIcon /> Continue with Google
        </button>
      </form>
      <p className="text-xs text-base-content/60">We only use your name, email and photo from Google.</p>
    </div>
  );
}
