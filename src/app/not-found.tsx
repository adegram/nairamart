import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center gap-3 rounded-box border border-base-300 bg-base-100 p-10 text-center">
      <p className="text-5xl font-extrabold text-primary">404</p>
      <h1 className="text-xl font-bold">We couldn&apos;t find that page</h1>
      <Link href="/shop" className="btn btn-primary">Back to the shop</Link>
    </div>
  );
}
