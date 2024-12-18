import { useEffect, useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import { Routes, Route } from 'react-router-dom'
import AddProduct from './pages/Add'
import ListProducts from './pages/List'
import Orders from './pages/Orders'
import Login from './components/Login'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './pages/Dashboard'
import ProductsPage from './pages/Products'
import EmployeeManagement from './pages/Employee'
import ServicesManagement from './pages/Services'
import OrderManagement from './pages/Orders'

export const backendUrl = import.meta.env.VITE_BACKEND_URL
export const currency = '$'

const App = () => {

  const [token, setToken] = useState(localStorage.getItem('token')?localStorage.getItem('token'):'');

  console.log(token);

  useEffect(()=>{
    localStorage.setItem('token',token)
  },[token])

  return (
    <div className='bg-gray-50 min-h-screen'>
      <ToastContainer />
      {token === ""
        ? <Login setToken={setToken} />
        : <>
          <Navbar setToken={setToken} />
          <hr />
          <div className='flex w-full'>
            <Sidebar />
            <div className='w-[70%] mx-auto ml-[max(5vw,25px)] my-8 text-gray-600 text-base'>
              <Routes>
                <Route path='/dashboard' element={<Dashboard token={token} />} />
                <Route path='/products' element={<ProductsPage token={token} />} />
                <Route path='/services' element={<ServicesManagement token={token} />} />
                <Route path='/employees' element={<EmployeeManagement token={token} />} />
                <Route path='/list' element={<ListProducts token={token} />} />
                <Route path='/orders' element={<OrderManagement token={token} />} />
              </Routes>
            </div>
          </div>
        </>
      }
    </div>
  )
}

export default App