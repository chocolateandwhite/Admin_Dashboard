"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
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
import { Label } from "@/components/ui/label";
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
  getAllCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "@/api/ProductCategory";
import { toast } from "sonner";

// Define Category type to match your API
type Category = {
  _id: string;
  name: string;
  description?: string;
};

export default function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [editMode, setEditMode] = useState<"create" | "edit" | null>(null);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [form, setForm] = useState({ name: "", description: "" });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Fetch all categories from API
  const fetchCategories = async () => {
    try {
      const cats = await getAllCategories(); // returns Category[]
      setCategories(cats);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Create or update category
  const handleSave = async () => {
    try {
      if (editMode === "create") {
        await createCategory(form);
        toast.success("Category created");
      } else if (editMode === "edit" && currentCategory) {
        await updateCategory(currentCategory._id, form);
        toast.success("Category updated");
      }
      // Reset form & refetch
      setForm({ name: "", description: "" });
      setEditMode(null);
      setCurrentCategory(null);
      setOpenDialog(false);
      fetchCategories();
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Operation failed");
    }
  };

  // Delete category
  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteCategory(deleteId);
      toast.success("Category deleted");
      fetchCategories();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeleteId(null);
    }
  };

  // Open dialog for edit
  const openEditModal = (cat: Category) => {
    setEditMode("edit");
    setCurrentCategory(cat);
    setForm({ name: cat.name, description: cat.description || "" });
    setOpenDialog(true);
  };

  // Filter by search term
  const filtered = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      {/* Header: Search + Add Button */}
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogTrigger asChild>
            <Button
              onClick={() => {
                setEditMode("create");
                setForm({ name: "", description: "" });
                setCurrentCategory(null);
              }}
            >
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editMode === "edit" ? "Edit" : "Create"} Category
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
              </div>
              <div>
                <Label>Description</Label>
                <Input
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
              </div>
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="ghost">Cancel</Button>
              </DialogClose>
              <Button onClick={handleSave}>Save</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Categories Table */}
      <table className="w-full border text-sm rounded overflow-hidden">
        <thead className="bg-muted text-left">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Description</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length > 0 ? (
            filtered.map((cat) => (
              <tr key={cat._id} className="border-t hover:bg-gray-50">
                <td className="p-2">{cat.name}</td>
                <td className="p-2">{cat.description}</td>
                <td className="p-2 text-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openEditModal(cat)}
                  >
                    Edit
                  </Button>

                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => setDeleteId(cat._id)}
                      >
                        Delete
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you sure you want to delete this category?
                        </AlertDialogTitle>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel
                          onClick={() => setDeleteId(null)}
                        >
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
            ))
          ) : (
            <tr>
              <td
                colSpan={3}
                className="text-center p-4 text-muted-foreground"
              >
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
