import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SidebarLayout from "./components/Sidebar";
import { CreateCouponForm } from "./components/coupon/CreateCoupons";
import CouponsTable from "./components/coupon/AllCoupons";
import DashboardPage from "./components/Dashboard/Dashboard";
import UserTable from "./components/Customer/Customer";
import CategoryTable from './components/Category/Category'

function App() {
  return (
    <Router>
      <SidebarLayout>
        <Routes>
          <Route path="/" element={<DashboardPage/>} />
          <Route path="/products" element={<div>All Products</div>} />
          <Route path="/products/add" element={<div>Add Product</div>} />
          <Route
            path="/products/categories"
            element={<CategoryTable/>}
          />
          <Route path="/orders" element={<div>Orders</div>} />
          <Route path="/customers" element={<UserTable/>} />
          <Route path="/settings" element={<div>Settings</div>} />
          <Route path="/coupons" element={<CouponsTable/>} />
          <Route path="/coupons/create" element={<CreateCouponForm/>} />
          <Route
            path="/coupons/settings"
            element={<div>Coupon Settings</div>}
          />

          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </SidebarLayout>
    </Router>
  );
}

export default App;
