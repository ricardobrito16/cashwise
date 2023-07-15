import React, { useState, useEffect } from "react";
import "./checkout.css";
import { useUserAuth } from "../../context/UserAuthContext";
import axios from 'axios';

import { initMercadoPago, Wallet } from '@mercadopago/sdk-react'
import PaymentButton from "../../components/BotaoMercadoPago";
import Header from "../../components/Header";
import MenuLateral from "../../components/Navbar";
import { Button, Col } from "react-bootstrap";

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


  const Message = ({ message }) => (
    <section>
      <p>{message}</p>
    </section>
  );
  return (
    <div className="DashboardContainer">




      <div className="LeftContainer">
        <MenuLateral />
      </div>
      <div className="RigthContainer" >

        {/* <section> */}
        {/* <div className="product">
            <img
              src="https://i.imgur.com/EHyR2nP.png"
              alt="The cover of Stubborn Attachments"
            />
            <div className="description">
              <h3>Produto de Teste</h3>
              <h5>R$1</h5>
            </div>
          </div>
          <form action="/create-checkout-session" method="POST">
            <button type="submit" onClick={sendUserData}>
              Pagar essa conta para os donos ficarem milionarios
            </button>

          </form>
          <form action="/mercadopago" method="POST" redirectMode='modal'>
            <button type="submit" onClick={sendUserData}>
              Mercado Pago
            </button>

          </form> */}
        {/* 
        </section> */}
        {/* <PaymentButton /> */}
        <div className="Pricing">

          <div className="PricesConteinerCard" >
            <div className="descricaoprecos">
              <h3 className="descricaoTituloCard">Plano Mensal</h3>
              <h3 className="descricaoSubTituloCard">Flexibilidade e acesso contínuo</h3>
              <h3 className="descricaoTextCard">A assinatura mensal oferece a flexibilidade de pagar em parcelas mensais, permitindo que você tenha acesso contínuo ao sistema sem um grande investimento inicial. Aproveite todos os recursos e benefícios do sistema, pagando um valor acessível a cada mês.</h3>
            </div>
            <div className="precosplanos">
              <div className="preco">R$110,00</div>
              <h3 className="descricaoPrecoTextCard">Pagamento a cada Mês</h3>

              <PaymentButton />

            </div>

          </div>
          <div className="PricesConteinerCard" >
            <div className="descricaoprecos">
              <h3 className="descricaoTituloCard">Plano Semestral</h3>
              <h3 className="descricaoSubTituloCard">Economia com pagamento único</h3>
              <h3 className="descricaoTextCard">Com o plano semestral, você tem a oportunidade de economizar e evitar preocupações mensais de pagamento. Ao optar por essa assinatura, você efetua um único pagamento no valor total do semestre, garantindo acesso ininterrupto ao sistema. Aproveite todos os recursos e benefícios, enquanto desfruta da comodidade de um pagamento único.</h3>
            </div>
            <div className="precosplanos">
              <div className="preco">R$600,00</div>
              <h3 className="descricaoPrecoTextCard">Pagamento a cada 6 Meses</h3>
              
              

            </div>
          </div>
          <div className="PricesConteinerCard" >
            <div className="descricaoprecos">

              <h3 className="descricaoTituloCard">Plano Anual</h3>
              <h3 className="descricaoSubTituloCard">O melhor custo-benefício</h3>
              <h3 className="descricaoTextCard">Nosso plano anual oferece a melhor relação custo-benefício para os usuários comprometidos. Com essa assinatura, você paga um valor único no início do ano e tem acesso completo ao sistema durante todo o período. Aproveite todos os recursos e benefícios, sabendo que você está economizando significativamente em comparação com outras opções de assinatura.</h3>
            </div>
            <div className="precosplanos">
              <div className="preco">R$1.080,00</div>
              <h3 className="descricaoPrecoTextCard">Pagamento a cada 1 Ano</h3>

              
              <h3 className="descricaoPrecoTextCard">Pagamento único: Anual. Cobrança total antecipada.</h3>

            </div>
          </div>


        </div>
      </div>



    </div>






  )







}

export default Checkout;