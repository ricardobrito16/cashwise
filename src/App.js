
import { BrowserRouter, Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import './App.css';
import MenuLateral from './components/Navbar';
import Dashboard from './paginas/Dashboard';
import Produtos from './paginas/Produtos';
import Pdv from './paginas/Pdv';
import Cupom from './paginas/Cupom';
import PedidoConfirmado from './paginas/Cupom';
import { CreateOrderContextProvider } from './context/CreateOrderContext';
import Clientes from './paginas/Clientes';
import Assistencia from './paginas/Assistencia';
import Login from './paginas/Login';
import { UserAuthContextProvider, useUserAuth } from './context/UserAuthContext';
import ProtectedRoute from './context/ProtectedRoute';
import Vendas from './paginas/Vendas';

import Controle from './paginas/Usuarios';
import { useEffect, useState } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './config/firebase';
import Rotas from './context/Rotas';

// import Login from './paginas/Login';

function App() {
  return (
    <div className="App">
      <UserAuthContextProvider>
        <Rotas />
      </UserAuthContextProvider>
    </div>
  );
}

export default App;
