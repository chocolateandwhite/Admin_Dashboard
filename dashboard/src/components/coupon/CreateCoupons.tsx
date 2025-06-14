import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useState } from "react";

const couponSchema = z.object({
  code: z.string().min(1, "Coupon code is required").toUpperCase(),
  discountType: z.enum(["percentage", "fixed"]),
  discountValue: z.number().min(0, "Discount must be at least 0"),
  minOrderAmount: z.number().min(0).optional(),
  maxDiscount: z.number().min(0).nullable().optional(),
  expiresAt: z.date({ required_error: "Expiration date is required" }),
  isActive: z.boolean().default(true),
});

type CouponFormValues = z.infer<typeof couponSchema>;

export function CreateCouponForm() {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
  } = useForm<CouponFormValues>({
    resolver: zodResolver(couponSchema),
    defaultValues: {
      isActive: true,
    },
  });

  const expiresAt = watch("expiresAt");

  const onSubmit = (data: CouponFormValues) => {
    console.log("Coupon Data:", data);
    // Submit to backend
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="max-w-2xl mx-auto bg-white rounded-2xl shadow-lg p-6 space-y-6"
    >
      <h2 className="text-xl font-semibold text-gray-800">Create Coupon</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <Label htmlFor="code">Coupon Code</Label>
          <Input {...register("code")} placeholder="SAVE20" />
          {errors.code && <p className="text-sm text-red-500">{errors.code.message}</p>}
        </div>

        <div>
          <Label htmlFor="discountType">Discount Type</Label>
          <Select onValueChange={(val) => setValue("discountType", val as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Select discount type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="percentage">Percentage</SelectItem>
              <SelectItem value="fixed">Fixed Amount</SelectItem>
            </SelectContent>
          </Select>
          {errors.discountType && (
            <p className="text-sm text-red-500">{errors.discountType.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="discountValue">Discount Value</Label>
          <Input type="number" step="0.01" {...register("discountValue", { valueAsNumber: true })} />
          {errors.discountValue && (
            <p className="text-sm text-red-500">{errors.discountValue.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="minOrderAmount">Minimum Order Amount</Label>
          <Input type="number" step="0.01" {...register("minOrderAmount", { valueAsNumber: true })} />
          {errors.minOrderAmount && (
            <p className="text-sm text-red-500">{errors.minOrderAmount.message}</p>
          )}
        </div>

        <div>
          <Label htmlFor="maxDiscount">Maximum Discount</Label>
          <Input type="number" step="0.01" {...register("maxDiscount", { valueAsNumber: true })} />
          {errors.maxDiscount && (
            <p className="text-sm text-red-500">{errors.maxDiscount.message}</p>
          )}
        </div>

        <div className="flex flex-col space-y-1">
          <Label htmlFor="expiresAt">Expiration Date</Label>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal w-full",
                  !expiresAt && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {expiresAt ? format(expiresAt, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={expiresAt}
                onSelect={(date) => setValue("expiresAt", date!)}
                initialFocus
              />
            </PopoverContent>
          </Popover>
          {errors.expiresAt && (
            <p className="text-sm text-red-500">{errors.expiresAt.message}</p>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-3 pt-2">
        <Switch
          id="isActive"
          checked={watch("isActive")}
          onCheckedChange={(checked) => setValue("isActive", checked)}
        />
        <Label htmlFor="isActive" className="text-sm">
          Active
        </Label>
      </div>

      <div className="pt-4">
        <Button type="submit" className="w-full md:w-auto">
          Create Coupon
        </Button>
      </div>
    </form>
  );
}
