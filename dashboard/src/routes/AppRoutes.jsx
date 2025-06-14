import {Route,Routes} from 'react-router-dom'
import Home from '@/pages/Home';
import Products from '@/pages/Products';
import Users from '@/pages/Users';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users" element={<Users />} />
      <Route path="/settings" element={<Products />} />
    </Routes>
  );
}