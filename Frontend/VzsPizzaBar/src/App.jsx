import './App.css'
import { Nav } from './components/Nav';
import { ProductList } from './pages/ProductList'
import { Routes, Route, useLocation } from "react-router-dom";
import { Home } from './pages/Home'
import { Details } from './pages/Details';
import { Contact } from './pages/Contact';
import { Footer } from './components/Footer';
import { Login } from './pages/Login';
import { Registration } from './pages/Registration';
import { NotFound } from './pages/NotFound';
import { Cart } from './pages/Cart';
import { Profile } from './pages/Profile';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Success } from './pages/Success';
import { useEffect } from 'react';
import { AdminLogin } from './admin-panel/AdminLogin';
import { AdminProtectedRoute } from './admin-panel/AdminProtectedRoute';
import { Dashboard } from './admin-panel/Dashboard';
import { AdminLayout } from './admin-panel/AdminLayout';
import { Users } from './admin-panel/Users';

function App() {

  const location = useLocation()
  const isAdminPage = location.pathname.startsWith("/admin-panel");
  useEffect(() => {

    if (location.pathname === "/success") { 
      document.body.classList.add("success-bg"); 
    } else { 
      document.body.classList.remove("success-bg"); 
    } }, [location.pathname]);

    useEffect(() => {
      const interval = setInterval(() => {
          const admin = JSON.parse(localStorage.getItem("admin") || "null");

          if (admin && Date.now() > admin.expiresAt) {
              localStorage.removeItem("admin");
              window.location.href = "/admin-panel"; // automatikus kiléptetés
          }
      }, 5000); // 5 másodpercenként ellenőrzi

      return () => clearInterval(interval);
  }, []);


  const hideLayout = location.pathname === "/success";

  return (
    <>
      {!hideLayout && !isAdminPage && <Nav />}

      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/menu' element={<ProductList/>}/>
        <Route path='/menu/details/:id' element={<Details/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/registration' element={<Registration/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='/success' element={<Success/>}/>
        <Route path='/profile' element={
          <ProtectedRoute>
            <Profile/>
          </ProtectedRoute>
        }/>
        <Route path='/admin-panel' element={<AdminLogin/>}/>
        <Route path='/admin-panel/dashboard' element={
          <AdminProtectedRoute>
            <AdminLayout>
              <Dashboard/>
            </AdminLayout>
          </AdminProtectedRoute>
        }/>
        <Route path='/admin-panel/users' element={
          <AdminProtectedRoute>
            <AdminLayout>
              <Users/>
            </AdminLayout>
          </AdminProtectedRoute>
        }/>
        <Route path='*' element={<NotFound/>}/> 
      </Routes>
      {!hideLayout && !isAdminPage && <Footer />}
    </>
  )
}

export default App
