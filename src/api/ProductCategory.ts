import api from "@/lib/axios";
import type { ProductCategoryType } from "@/types/ProductCategory";

export async function getAllCategories(): Promise<ProductCategoryType[]> {
  const res = await api.get("/get/all/products/categories");
  return res.data.categories;
}

export async function getCategoryById(id: string): Promise<ProductCategoryType> {
  const res = await api.get(`/get/product/category/${id}`);
  return res.data.category;
}

export async function createCategory(data: { name: string; description?: string }) {
  return api.post("/create/product/category", data);
}

export async function updateCategory(id: string, data: { name: string; description?: string }) {
  return api.put(`/update/product/category/${id}`, data);
}

export async function deleteCategory(id: string) {
  return api.delete(`/delete/product/category/${id}`);
}
