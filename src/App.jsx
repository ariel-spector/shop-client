import React from 'react';
import{ Route, Routes, BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import LoginForm from './components/Loginform.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import RegistrationForm from './components/RegistrationForm.jsx';
import Registration from './pages/Registration.jsx';
import { UserProvider } from './contexts/UserContext.jsx';
import AddProduct from './components/AddProduct.jsx';
import { CartProvider } from './contexts/CartContext.jsx';
import CartPage from './pages/CartPage';
import AvilabileItemsGrid from './components/AvilabileItemsGrid.jsx';
import FavoritesPage from './pages/FavoritesPage.jsx';
import { FavoritesProvider } from './components/Favorites.jsx';
import Footer from './components/Footer.jsx';
import ProfilePage from './pages/ProfilePage.jsx';
import ResetPassword from './components/ResetPassword.jsx';









function App() {
  return (
    
    <UserProvider>
      <FavoritesProvider>
      <CartProvider>
    <BrowserRouter>
    <div style={{display: 'flex' , flexDirection: 'column' ,minHeight: '100vh'}}>
    <Navbar />
    <div style= {{ flex: 1 }}>
      <Routes>
        
        <Route path='/' element={<AvilabileItemsGrid />} />
        <Route path='/favorites' element={<FavoritesPage />} />
        <Route path='/search' element={<AvilabileItemsGrid />} />
        <Route path='/profile' element={<ProfilePage />} />
        <Route path='/home' element={<Home />} />
        <Route path='/login' element={<LoginForm />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path='/register' element={<RegistrationForm />} />
        <Route path='/add-product' element={<AddProduct />} />
        <Route path='/cart' element={<CartPage />} />
        <Route path='*' element={<h2>404: Page Not Found</h2>} />
      </Routes>
      </div>
      <Footer />
    </div>
    
   
  </BrowserRouter>
  </CartProvider>
  </FavoritesProvider>
  </UserProvider>
  
);
}

export default App;
