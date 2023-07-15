import React, { useEffect, useState } from "react";
import "./styles/navbar.css"

import { MdSpaceDashboard, MdCalendarToday, MdCardTravel, MdDonutSmall, MdFactCheck, MdUnarchive, MdListAlt, MdDrafts, MdShoppingCartCheckout, MdSearch, MdLogout } from "react-icons/md"
import { Nav } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { FaHandsHelping, FaListAlt, FaRegListAlt, } from 'react-icons/fa'
import { TbShoppingCartPlus } from 'react-icons/tb'
import { BsWrenchAdjustable } from 'react-icons/bs'
import { useUserAuth } from "../context/UserAuthContext";
import { auth, db } from "../config/firebase";
import { doc, getDoc } from "firebase/firestore";
function MenuLateral() {
  const [error, setError] = useState("");
  const { logIn, user, nivelDeAcesso, logOut, googleSignIn, password, setPassword, email, setEmail } = useUserAuth();
  const navigate = useNavigate();
  return (
    <>
      <div className='container-css'>

        <div className='nav-left'>
          <div className='logo-img'></div>
          <ul>
            {/*  */}
            <Link to="/dashboard" ><li><p><MdSpaceDashboard className='iconBtn' /></p>Dashboard</li></Link>

            <Link to="/pdv" ><li><p><TbShoppingCartPlus className='iconBtn' /></p>PDV</li></Link>
            <Link to="/assistencia" ><li><p><BsWrenchAdjustable className='iconBtn' /></p>Assistência</li></Link>
            <Link to="/produtos" ><li><p><FaRegListAlt className='iconBtn' /></p>Produtos</li></Link>
            <Link to="/clientes" ><li><p><FaHandsHelping className='iconBtn' /></p>Clientes</li></Link>
            <Link to="/vendas" ><li><p><MdFactCheck className='iconBtn' /></p>Vendas</li></Link>
            {nivelDeAcesso === "Adm" && (
            <Link to="/controle" ><li><p><MdFactCheck className='iconBtn' /></p>Controle</li></Link>
            
            )}

          </ul>
        </div>

      </div>
    </>



  );
}

export default MenuLateral;