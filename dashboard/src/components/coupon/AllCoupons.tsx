import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";

// Dummy data type
type Coupon = {
  id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number | null;
  expiresAt: string;
  isActive: boolean;
};

// Mock data (replace with API call)
const mockCoupons: Coupon[] = [
  {
    id: "1",
    code: "SAVE10",
    discountType: "percentage",
    discountValue: 10,
    minOrderAmount: 50,
    maxDiscount: 100,
    expiresAt: "2025-12-31T00:00:00.000Z",
    isActive: true,
  },
  {
    id: "2",
    code: "FLAT50",
    discountType: "fixed",
    discountValue: 50,
    minOrderAmount: 100,
    maxDiscount: null,
    expiresAt: "2025-08-01T00:00:00.000Z",
    isActive: false,
  },
];

export default function CouponsTable() {
  const [coupons, setCoupons] = useState<Coupon[]>(mockCoupons);

  const handleToggle = (id: string) => {
    setCoupons((prev) =>
      prev.map((coupon) =>
        coupon.id === id ? { ...coupon, isActive: !coupon.isActive } : coupon
      )
    );

    // 🔁 Add API call here to persist change
    // await fetch(`/api/coupons/${id}`, { method: "PATCH", body: JSON.stringify({ isActive: !newValue }) })
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-semibold mb-4">All Coupons</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left border">
          <thead className="bg-muted">
            <tr>
              <th className="p-3 border">Code</th>
              <th className="p-3 border">Type</th>
              <th className="p-3 border">Value</th>
              <th className="p-3 border">Min Order</th>
              <th className="p-3 border">Max Discount</th>
              <th className="p-3 border">Expires At</th>
              <th className="p-3 border">Status</th>
              <th className="p-3 border text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {coupons.map((coupon) => (
              <tr key={coupon.id} className="hover:bg-accent">
                <td className="p-3 border font-medium">{coupon.code}</td>
                <td className="p-3 border capitalize">{coupon.discountType}</td>
                <td className="p-3 border">
                  {coupon.discountType === "percentage"
                    ? `${coupon.discountValue}%`
                    : `$${coupon.discountValue}`}
                </td>
                <td className="p-3 border">${coupon.minOrderAmount}</td>
                <td className="p-3 border">
                  {coupon.maxDiscount ? `$${coupon.maxDiscount}` : "—"}
                </td>
                <td className="p-3 border">{format(new Date(coupon.expiresAt), "PPP")}</td>
                <td className="p-3 border">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={coupon.isActive}
                      onCheckedChange={() => handleToggle(coupon.id)}
                      id={`switch-${coupon.id}`}
                    />
                    <Label htmlFor={`switch-${coupon.id}`}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </Label>
                  </div>
                </td>
                <td className="p-3 border text-center">
                  <Button size="sm" variant="outline">
                    Edit
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
