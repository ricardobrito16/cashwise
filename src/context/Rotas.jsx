import { doc, getDoc } from "firebase/firestore";
import { UserAuthContextProvider, useUserAuth } from "./UserAuthContext";
import { db } from "../config/firebase";
import { CreateOrderContextProvider } from "./CreateOrderContext";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../paginas/Login";
import Dashboard from "../paginas/Dashboard";
import Vendas from "../paginas/Vendas";
import Clientes from "../paginas/Clientes";
import Controle from "../paginas/Usuarios";
import Produtos from "../paginas/Produtos";
import Assistencia from "../paginas/Assistencia";
import Pdv from "../paginas/Pdv";
import PedidoConfirmado from "../paginas/Cupom";
import { useEffect, useState } from "react";
import Checkout from "../paginas/Checkout";
import PaymentResult from "../paginas/PagamentoAprovado";


function Rotas() {

  const { nivelDeAcesso, validadeAssinatura, statusAssinatura, assinaturaExpirada } = useUserAuth();
  return (
    <CreateOrderContextProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/pagamentoaprovado" element={<PaymentResult />} />
     
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          } />
          <Route path="/vendas" element={
            <ProtectedRoute>
              {!assinaturaExpirada && statusAssinatura === "ativo" ? (
                <Vendas />
              ) : (
                <Navigate to="/dashboard" />
              )}
            </ProtectedRoute>
          } />
          <Route path="/checkout" element={
            <ProtectedRoute>
              
                <Checkout />
             
            
            </ProtectedRoute>
          } />
          <Route path="/clientes" element={
            <ProtectedRoute>
              {!assinaturaExpirada && statusAssinatura === "ativo" ? (
                <Clientes />
              ) : (
                <Navigate to="/dashboard" />
              )}
            </ProtectedRoute>
          } />
          {/* <Route path="/controle" element={
            <ProtectedRoute>
              {nivelDeAcesso === "Adm" ? <Controle /> : <Navigate to="/dashboard" />}

            </ProtectedRoute>
          } /> */}
          <Route path="/controle" element={
            <ProtectedRoute>
              {nivelDeAcesso === "Adm" ? (
                <Controle />
              ) : (
                <Navigate to="/dashboard" />
              )}
            </ProtectedRoute>
          } />
          <Route path="/produtos" element={
            <ProtectedRoute>
              {!assinaturaExpirada && statusAssinatura === "ativo" ? (
                <Produtos />
              ) : (
                <Navigate to="/dashboard" />
              )}
            </ProtectedRoute>
          } />
          <Route path="/assistencia" element={
            <ProtectedRoute>
              {!assinaturaExpirada && statusAssinatura === "ativo" ? (
                <Assistencia />
              ) : (
                <Navigate to="/dashboard" />
              )}
            </ProtectedRoute>
          } />
          <Route path="/pdv" element={
            <ProtectedRoute>
              {!assinaturaExpirada && statusAssinatura === "ativo" ? (
                <Pdv />
              ) : (
                <Navigate to="/dashboard" />
              )}
            </ProtectedRoute>
          } />
          <Route path="/pedido-confirmado" element={
            <ProtectedRoute>
              {!assinaturaExpirada && statusAssinatura === "ativo" ? (
                <PedidoConfirmado />
              ) : (
                <Navigate to="/pedido-confirmado" />
              )}
            </ProtectedRoute>
          } />
        </Routes>
      </BrowserRouter>
    </CreateOrderContextProvider>


  );
}

export default Rotas;