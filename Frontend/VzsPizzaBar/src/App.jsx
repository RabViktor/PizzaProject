import './App.css'
import { Nav } from './components/Nav';
import { ProductList } from './pages/ProductList'
import { Routes, Route } from "react-router-dom";
import { Home } from './pages/Home'
import { Details } from './pages/Details';
import { Contact } from './pages/Contact';
import { Footer } from './components/Footer';
import { Login } from './pages/Login';
import { Registration } from './pages/Registration';
import { NotFound } from './pages/NotFound';
import { Cart } from './pages/Cart';

function App() {
  return (
    <>
      <Nav/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/menu' element={<ProductList/>}/>
        <Route path='/menu/details/:id' element={<Details/>}/>
        <Route path='/contact' element={<Contact/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/registration' element={<Registration/>}/>
        <Route path='/cart' element={<Cart/>}/>
        <Route path='*' element={<NotFound/>}/> 
      </Routes>
      <Footer/>
    </>
  )
}

export default App
