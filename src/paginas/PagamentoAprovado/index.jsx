import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import queryString from 'query-string';
import { useUserAuth } from '../../context/UserAuthContext';
import { collection, addDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../../config/firebase'; // Importe a instância do Firestore aqui
import { add, format } from 'date-fns';

const PaymentResult = () => {
  const location = useLocation();
  const parsedParams = queryString.parse(location.search);
  const { user } = useUserAuth();
  const uid = user.uid;
  const email = user.email;

  const dataAtual = new Date();
  const dataMais30Dias = add(dataAtual, { days: 30 });
  const dataMais365Dias = add(dataAtual, { days: 365 });

  const dataAtualFormatada = format(dataAtual, 'dd/MM/yyyy');
  const dataMais30DiasFormatada = format(dataMais30Dias, 'dd/MM/yyyy');
  const dataMais365DiasFormatada = format(dataMais365Dias, 'dd/MM/yyyy');
  console.log("dataAtualFormatada" + dataAtualFormatada)
  console.log("dataMais30DiasFormatada" + dataMais30DiasFormatada)
  console.log("dataMais365DiasFormatada" + dataMais365DiasFormatada)


  useEffect(() => {
    const savePaymentData = async () => {
      try {
        const {
          collection_id,
          collection_status,
          payment_id,
          status,
          external_reference,
          payment_type,
          merchant_order_id,
          preference_id,
          site_id,
          processing_mode,
          merchant_account_id
        } = parsedParams;

        // Crie um objeto com os dados do pagamento
        const paymentData = {
          collection_id,
          collection_status,
          payment_id,
          status,
          external_reference,
          payment_type,
          merchant_order_id,
          preference_id,
          site_id,
          processing_mode,
          merchant_account_id,
          uid,
          email
        };

        // Salve os dados no Firestore
        const docRef = await addDoc(collection(db, 'todosPagamentos'), paymentData);
        console.log('Documento salvo com ID:', docRef.id);

        const userRef = doc(db, 'usuarios', uid);
        await updateDoc(userRef, {
          status: "ativo",
          validade: dataMais365DiasFormatada,
          dataAssinatura: dataAtualFormatada,
        });
        const docPagamentosRef = await addDoc(collection(db, 'usuarios', uid, 'pagamentos'), paymentData);
        console.log('Documento salvo com ID:', docRef.id);
      } catch (error) {
        console.error('Ocorreu um erro ao salvar os dados no Firestore:', error);
      }
    };

    savePaymentData();
  }, [location.search, parsedParams, uid, email]);

  if (!location.search) {
    return <p>Nenhuma informação de pagamento disponível.</p>;
  }

  return (
    <div>
      <p>collection_id: {parsedParams.collection_id}</p>
      <p>collection_status: {parsedParams.collection_status}</p>
      <p>payment_id: {parsedParams.payment_id}</p>
      <p>status: {parsedParams.status}</p>
      <p>external_reference: {parsedParams.external_reference}</p>
      <p>payment_type: {parsedParams.payment_type}</p>
      <p>merchant_order_id: {parsedParams.merchant_order_id}</p>
      <p>preference_id: {parsedParams.preference_id}</p>
      <p>site_id: {parsedParams.site_id}</p>
      <p>processing_mode: {parsedParams.processing_mode}</p>
      <p>merchant_account_id: {parsedParams.merchant_account_id}</p>
      <p>ID DO USUARIO: {uid}</p>
      <p>EMAIL DO USUARIO: {email}</p>
    </div>
  );
};

export default PaymentResult;
