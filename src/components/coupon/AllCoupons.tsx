"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import {
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAllCoupons,
  toggleCouponStatus,
} from "@/api/Coupons";

type Coupon = {
  _id: string;
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  maxDiscount: number | null;
  expiresAt: string;
  isActive: boolean;
};

export default function CouponsTable() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [form, setForm] = useState<Omit<Coupon, "_id">>({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscount: null,
    expiresAt: "",
    isActive: false,
  });
  const [deleteDialogId, setDeleteDialogId] = useState<string | null>(null);

  // Fetch coupons from API
  const fetchCoupons = async () => {
    const data = await getAllCoupons();
    setCoupons(data);
  };
  useEffect(() => {
    fetchCoupons();
  }, []);

  // Open create dialog
  const openCreate = () => {
    setSelectedCoupon(null);
    setForm({
      code: "",
      discountType: "percentage",
      discountValue: 0,
      minOrderAmount: 0,
      maxDiscount: null,
      expiresAt: "",
      isActive: false,
    });
    setOpenDialog(true);
  };

  // Open edit dialog
  const openEdit = (c: Coupon) => {
    setSelectedCoupon(c);
    setForm({ ...c });
    setOpenDialog(true);
  };

  // Save (create or update)
  const handleSave = async () => {
    if (selectedCoupon) {
      await updateCoupon(selectedCoupon._id, form);
    } else {
      await createCoupon(form);
    }
    setOpenDialog(false);
    fetchCoupons();
  };

  // Delete
  const handleDelete = async () => {
    if (!deleteDialogId) return;
    await deleteCoupon(deleteDialogId);
    setDeleteDialogId(null);
    fetchCoupons();
  };

  // Toggle active
  const handleToggle = async (id: string) => {
    await toggleCouponStatus(id);
    fetchCoupons();
  };

  return (
    <div className="p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">All Coupons</h2>
        <Button onClick={openCreate}>Create Coupon</Button>
      </div>

      {/* Create / Edit Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selectedCoupon ? "Edit" : "Create"} Coupon</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div>
              <Label>Code</Label>
              <Input
                value={form.code}
                onChange={(e) => setForm(f => ({ ...f, code: e.target.value }))}
              />
            </div>
            <div>
              <Label>Discount Type</Label>
              <select
                className="w-full border rounded p-2"
                value={form.discountType}
                onChange={(e) =>
                  setForm(f => ({ ...f, discountType: e.target.value as any }))
                }
              >
                <option value="percentage">Percentage</option>
                <option value="fixed">Fixed</option>
              </select>
            </div>
            <div>
              <Label>Discount Value</Label>
              <Input
                type="number"
                value={form.discountValue}
                onChange={(e) =>
                  setForm(f => ({ ...f, discountValue: Number(e.target.value) }))
                }
              />
            </div>
            <div>
              <Label>Min Order Amount</Label>
              <Input
                type="number"
                value={form.minOrderAmount}
                onChange={(e) =>
                  setForm(f => ({ ...f, minOrderAmount: Number(e.target.value) }))
                }
              />
            </div>
            <div>
              <Label>Max Discount</Label>
              <Input
                type="number"
                value={form.maxDiscount ?? ""}
                onChange={(e) =>
                  setForm(f => ({
                    ...f,
                    maxDiscount: e.target.value ? Number(e.target.value) : null,
                  }))
                }
              />
            </div>
            <div>
              <Label>Expires At</Label>
              <Input
                type="date"
                value={form.expiresAt?.slice(0, 10)}
                onChange={(e) =>
                  setForm(f => ({ ...f, expiresAt: e.target.value }))
                }
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                checked={form.isActive}
                onCheckedChange={(val) =>
                  setForm(f => ({ ...f, isActive: val }))
                }
              />
              <Label>{form.isActive ? "Active" : "Inactive"}</Label>
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="ghost">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSave}>{selectedCoupon ? "Save" : "Create"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Coupons Table */}
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
            {coupons.map(coupon => (
              <tr key={coupon._id} className="hover:bg-accent">
                <td className="p-3 border font-medium">{coupon.code}</td>
                <td className="p-3 border capitalize">{coupon.discountType}</td>
                <td className="p-3 border">
                  {coupon.discountType === "percentage"
                    ? `${coupon.discountValue}%`
                    : `Rs. ${coupon.discountValue}`}
                </td>
                <td className="p-3 border">Rs. {coupon.minOrderAmount}</td>
                <td className="p-3 border">
                  {coupon.maxDiscount != null ? `Rs. ${coupon.maxDiscount}` : "—"}
                </td>
                <td className="p-3 border">
                  {format(new Date(coupon.expiresAt), "PPP")}
                </td>
                <td className="p-3 border">
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={coupon.isActive}
                      onCheckedChange={() => handleToggle(coupon._id)}
                      id={`switch-${coupon._id}`}
                    />
                    <Label htmlFor={`switch-${coupon._id}`}>
                      {coupon.isActive ? "Active" : "Inactive"}
                    </Label>
                  </div>
                </td>
                <td className="p-3 border text-center space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => openEdit(coupon)}
                  >
                    Edit
                  </Button>

                  <AlertDialog open={deleteDialogId === coupon._id} onOpenChange={open => {
                    if (!open) setDeleteDialogId(null);
                  }}>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteDialogId(coupon._id)}
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Delete this coupon?</AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel onClick={() => setDeleteDialogId(null)}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
