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

function App() {
  
  const location = useLocation()
  useEffect(() => {
    if (location.pathname === "/success") { 
      document.body.classList.add("success-bg"); 
    } else { 
      document.body.classList.remove("success-bg"); 
    } }, [location.pathname]);


  const hideLayout = location.pathname === "/success";

  return (
    <>
      {!hideLayout && <Nav />}
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
        <Route path='*' element={<NotFound/>}/> 
      </Routes>
      {!hideLayout && <Footer />}
    </>
  )
}

export default App
