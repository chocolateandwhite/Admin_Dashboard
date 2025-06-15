import { useState } from "react";
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

type Category = {
  _id: string;
  name: string;
  description: string;
};

export default function CategoryTable() {
  const [categories, setCategories] = useState<Category[]>([
    {
      _id: "1",
      name: "Dark Chocolate",
      description: "Rich and intense cocoa flavor",
    },
    {
      _id: "2",
      name: "Milk Chocolate",
      description: "Smooth and creamy milk chocolate",
    },
  ]);

  const [search, setSearch] = useState<string>("");
  const [editMode, setEditMode] = useState<"create" | "edit" | null>(null);
  const [currentCategory, setCurrentCategory] = useState<Category | null>(null);
  const [form, setForm] = useState<{ name: string; description: string }>({
    name: "",
    description: "",
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const handleSave = () => {
    if (editMode === "create") {
      const newCategory: Category = {
        _id: Date.now().toString(),
        ...form,
      };
      setCategories((prev) => [...prev, newCategory]);
    } else if (editMode === "edit" && currentCategory) {
      setCategories((prev) =>
        prev.map((cat) =>
          cat._id === currentCategory._id ? { ...cat, ...form } : cat
        )
      );
    }

    setEditMode(null);
    setForm({ name: "", description: "" });
    setCurrentCategory(null);
  };

  const handleDelete = (id: string) => {
    setCategories((prev) => prev.filter((cat) => cat._id !== id));
    setDeleteId(null);
  };

  const openEditModal = (category: Category) => {
    setEditMode("edit");
    setCurrentCategory(category);
    setForm({ name: category.name, description: category.description });
  };

  const filteredCategories = categories.filter((cat) =>
    cat.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
        <Dialog>
          <DialogTrigger asChild>
            <Button onClick={() => setEditMode("create")}>Add Category</Button>
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

      <table className="w-full border text-sm rounded overflow-hidden">
        <thead className="bg-muted text-left">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Description</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filteredCategories.length ? (
            filteredCategories.map((cat) => (
              <tr key={cat._id} className="border-t hover:bg-gray-50">
                <td className="p-2">{cat.name}</td>
                <td className="p-2">{cat.description}</td>
                <td className="p-2 text-center space-x-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(cat)}
                      >
                        Edit
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Edit Category</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label>Name</Label>
                          <Input
                            value={form.name}
                            onChange={(e) =>
                              setForm({ ...form, name: e.target.value })
                            }
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
                        <AlertDialogCancel onClick={() => setDeleteId(null)}>
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => deleteId && handleDelete(deleteId)}
                        >
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
              <td colSpan={3} className="text-center p-4 text-muted-foreground">
                No categories found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
