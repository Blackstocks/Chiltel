import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';

const SellerLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default SellerLayout;