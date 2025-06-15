import React, { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

// Define the User type
type User = {
  _id: string;
  name: string;
  email: string;
  phone: string;
  cart: string[];
  wishlist: string[];
  orders: string[];
  address: {
    street: string;
    city: string;
    country: string;
  };
};

// Mock data
const mockUsers: User[] = [
  {
    _id: "1",
    name: "John Doe",
    email: "john@example.com",
    phone: "1234567890",
    cart: ["Product A", "Product B"],
    wishlist: ["Product C"],
    orders: ["Order #1234", "Order #5678"],
    address: {
      street: "123 Sweet St",
      city: "Chocotown",
      country: "Candyland",
    },
  },
  {
    _id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    phone: "9876543210",
    cart: ["Product D"],
    wishlist: [],
    orders: ["Order #9876"],
    address: {
      street: "456 Fudge Ave",
      city: "Truffleville",
      country: "Candyland",
    },
  },
];

export default function UserTable() {
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [modalUser, setModalUser] = useState<User | null>(null);
  const [modalType, setModalType] = useState<"cart" | "wishlist" | null>(null);

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) =>
      [user.name, user.email, user.phone]
        .join(" ")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }, [search]);

  const totalPages = Math.ceil(filteredUsers.length / pageSize);
  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredUsers.slice(start, start + pageSize);
  }, [filteredUsers, currentPage, pageSize]);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <Input
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setCurrentPage(1);
          }}
          className="w-64"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm">Items per page:</span>
          <Select
            onValueChange={(val) => {
              setPageSize(parseInt(val));
              setCurrentPage(1);
            }}
            defaultValue={pageSize.toString()}
          >
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <table className="w-full border text-sm rounded overflow-hidden">
        <thead className="bg-muted text-left">
          <tr>
            <th className="p-2">Name</th>
            <th className="p-2">Email</th>
            <th className="p-2">Phone</th>
            <th className="p-2">Address</th>
            <th className="p-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.map((user) => (
            <tr key={user._id} className="border-t hover:bg-gray-50">
              <td className="p-2">{user.name}</td>
              <td className="p-2">{user.email}</td>
              <td className="p-2">{user.phone}</td>
              <td className="p-2">
                {user.address?.street}, {user.address?.city}, {user.address?.country}
              </td>
              <td className="p-2 text-center space-x-2">
                {/* Cart Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setModalUser(user);
                        setModalType("cart");
                      }}
                    >
                      Cart
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <h3 className="font-bold text-lg mb-2">Cart Items</h3>
                    {modalUser?.cart?.length ? (
                      <ul className="list-disc ml-6">
                        {modalUser.cart.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No items in cart.</p>
                    )}
                  </DialogContent>
                </Dialog>

                {/* Wishlist Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setModalUser(user);
                        setModalType("wishlist");
                      }}
                    >
                      Wishlist
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <h3 className="font-bold text-lg mb-2">Wishlist Items</h3>
                    {modalUser?.wishlist?.length ? (
                      <ul className="list-disc ml-6">
                        {modalUser.wishlist.map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No items in wishlist.</p>
                    )}
                  </DialogContent>
                </Dialog>

                {/* Orders Dialog */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setModalUser(user);
                      }}
                    >
                      Orders
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <h3 className="font-bold text-lg mb-2">Orders</h3>
                    {modalUser?.orders?.length ? (
                      <ul className="list-disc ml-6">
                        {modalUser.orders.map((order, i) => (
                          <li key={i}>{order}</li>
                        ))}
                      </ul>
                    ) : (
                      <p>No orders found.</p>
                    )}
                  </DialogContent>
                </Dialog>
              </td>
            </tr>
          ))}
          {paginatedUsers.length === 0 && (
            <tr>
              <td colSpan={5} className="text-center p-4">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4">
        <Button
          variant="ghost"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          Previous
        </Button>
        <span className="text-sm">
          Page {currentPage} of {totalPages}
        </span>
        <Button
          variant="ghost"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  );
}
