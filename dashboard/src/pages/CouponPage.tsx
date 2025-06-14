import { CreateCouponForm } from "@/components/coupon/CreateCoupons";

export default function CouponCreatePage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Create Coupon</h1>
      <CreateCouponForm />
    </div>
  );
}