export type CouponType = {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number | null;
  expiresAt: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
};
