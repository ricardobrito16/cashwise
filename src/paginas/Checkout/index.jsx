import React, { useState, useEffect } from "react";
import "./checkout.css";
import { useUserAuth } from "../../context/UserAuthContext";
import axios from 'axios';

import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import PaymentButton from "../../components/BotaoMercadoPago";
import Header from "../../components/Header";
import MenuLateral from "../../components/Navbar";
import { Button, Col } from "react-bootstrap";
import Precos from "../../components/Precos";

initMercadoPago('TEST-ced7e305-5eb9-41a1-9278-77689b0f3bb4');



function Checkout() {
  const [message, setMessage] = useState("");

  const { user, sendUserData } = useUserAuth();
  const preferenceId = '<PREFERENCE_ID>';


  useEffect(() => {
    // Check to see if this is a redirect back from Checkout
    const query = new URLSearchParams(window.location.search);

    if (query.get("success")) {
      setMessage("Order placed! You will receive an email confirmation.");
    }

    if (query.get("canceled")) {
      setMessage(
        "Order canceled -- continue to shop around and checkout when you're ready."
      );
    }
  }, []);


  
  return (
    <div className="DashboardContainer">
      <div className="LeftContainer">
        <MenuLateral />
      </div>
      <div className="RigthContainer" >
        <Precos />
      </div>
    </div>
  )
}

export default Checkout;