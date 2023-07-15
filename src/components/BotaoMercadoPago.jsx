import React, { useState } from 'react';
import { initMercadoPago, Wallet } from '@mercadopago/sdk-react';
import { useUserAuth } from '../context/UserAuthContext';

initMercadoPago('APP_USR-61cffe3c-9dd8-4316-a574-05e1defacf90');

const PaymentButton = () => {
  const { user } = useUserAuth();

  const [preferenceId, setPreferenceId] = useState('');

  const handlePaymentButtonClick = async () => {
    try {
      const response = await fetch('https://www.apitritechsolutions.com.br:21104/create-preference', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const data = await response.json();
      setPreferenceId(data);
    } catch (error) {
      console.error('Ocorreu um erro ao obter o ID da preferência de pagamento:', error);
    }
  };

  return (
    <>
      {preferenceId ? (
        <Wallet initialization={{ preferenceId, redirectMode: 'modal' }} />
      ) : (
        <button onClick={handlePaymentButtonClick}>Criar Preferência de Pagamento</button>
      )}
    </>
  );
};

export default PaymentButton;