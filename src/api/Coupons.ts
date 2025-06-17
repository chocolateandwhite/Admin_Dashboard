import api from "@/lib/axios";
import type { CouponType } from "@/types/Coupon";

// Create a new coupon
export async function createCoupon(data: Partial<CouponType>) {
  const res = await api.post("/create/coupon", data);
  return res.data;
}

// Update an existing coupon
export async function updateCoupon(id: string, data: Partial<CouponType>) {
  const res = await api.post(`/update/coupon/${id}`, data);
  return res.data;
}

// Get all coupons
export async function getAllCoupons(): Promise<CouponType[]> {
  const res = await api.get("/get/all/coupon");
  return res.data.coupons;
}

// Get single coupon by ID
export async function getCouponById(id: string): Promise<CouponType> {
  const res = await api.get(`/get/coupon/${id}`);
  return res.data.coupon;
}

// Delete a coupon by ID
export async function deleteCoupon(id: string) {
  return api.delete(`/delete/coupon/${id}`);
}

// Toggle coupon active/inactive status
export async function toggleCouponStatus(id: string) {
  const res = await api.patch(`/toggle/coupon/status/${id}`);
  return res.data;
}
