import { useState } from "react";
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
  const [selectedCoupon, setSelectedCoupon] = useState<Coupon | null>(null);
  const [editForm, setEditForm] = useState<Omit<Coupon, "id">>({
    code: "",
    discountType: "percentage",
    discountValue: 0,
    minOrderAmount: 0,
    maxDiscount: null,
    expiresAt: "",
    isActive: false,
  });

  const handleToggle = (id: string) => {
    setCoupons((prev) =>
      prev.map((c) => (c.id === id ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const openEditDialog = (coupon: Coupon) => {
    setSelectedCoupon(coupon);
    setEditForm({ ...coupon });
  };

  const handleSave = () => {
    if (!selectedCoupon) return;
    setCoupons((prev) =>
      prev.map((c) => (c.id === selectedCoupon.id ? { id: c.id, ...editForm } : c))
    );
    setSelectedCoupon(null);
  };

  const handleDelete = (id: string) => {
    setCoupons((prev) => prev.filter((c) => c.id !== id));
  };

  const handleCreate = () => {
    const newCoupon: Coupon = {
      id: Date.now().toString(),
      ...editForm,
    };
    setCoupons((prev) => [newCoupon, ...prev]);
    setEditForm({
      code: "",
      discountType: "percentage",
      discountValue: 0,
      minOrderAmount: 0,
      maxDiscount: null,
      expiresAt: "",
      isActive: false,
    });
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">All Coupons</h2>
        {/* Create Coupon Button */}
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={() => setEditForm({
              code: "",
              discountType: "percentage",
              discountValue: 0,
              minOrderAmount: 0,
              maxDiscount: null,
              expiresAt: "",
              isActive: false
            })}>
              Create Coupon
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Coupon</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <Label>Code</Label>
                <Input
                  value={editForm.code}
                  onChange={(e) => setEditForm((f) => ({ ...f, code: e.target.value }))}
                />
              </div>
              <div>
                <Label>Discount Type</Label>
                <select
                  className="w-full border rounded p-2"
                  value={editForm.discountType}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      discountType: e.target.value as "percentage" | "fixed",
                    }))
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
                  value={editForm.discountValue}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      discountValue: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <Label>Min Order Amount</Label>
                <Input
                  type="number"
                  value={editForm.minOrderAmount}
                  onChange={(e) =>
                    setEditForm((f) => ({
                      ...f,
                      minOrderAmount: Number(e.target.value),
                    }))
                  }
                />
              </div>
              <div>
                <Label>Max Discount</Label>
                <Input
                  type="number"
                  value={editForm.maxDiscount ?? ""}
                  onChange={(e) =>
                    setEditForm((f) => ({
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
                  value={editForm.expiresAt.slice(0, 10)}
                  onChange={(e) =>
                    setEditForm((f) => ({ ...f, expiresAt: e.target.value }))
                  }
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={editForm.isActive}
                  onCheckedChange={(val) =>
                    setEditForm((f) => ({ ...f, isActive: val }))
                  }
                />
                <Label>{editForm.isActive ? "Active" : "Inactive"}</Label>
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button onClick={handleCreate}>Create</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Coupon Table */}
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
                  {coupon.maxDiscount !== null ? `$${coupon.maxDiscount}` : "—"}
                </td>
                <td className="p-3 border">
                  {format(new Date(coupon.expiresAt), "PPP")}
                </td>
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
                <td className="p-3 border text-center space-x-2">
                  {/* Edit Dialog */}
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => openEditDialog(coupon)}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Coupon</DialogTitle>
                      </DialogHeader>
                      {/* Same form used above */}
                      {/* ... */}
                      <DialogFooter>
                        <DialogClose asChild>
                          <Button variant="ghost">Cancel</Button>
                        </DialogClose>
                        <Button onClick={handleSave}>Save</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>

                  {/* Delete Confirmation */}
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button size="sm" variant="destructive">
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete this coupon?
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                      <p>This action cannot be undone.</p>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDelete(coupon.id)}
                        >
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
