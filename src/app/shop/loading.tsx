import { ProductGridSkeleton } from "@/components/product/product-card";

export default function Loading() {
  return (
    <div className="space-y-6">
      <div className="skeleton h-10 w-56" />
      <ProductGridSkeleton count={8} />
    </div>
  );
}
