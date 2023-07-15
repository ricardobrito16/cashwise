import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, getDoc, doc, deleteDoc, setDoc, where, query } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import Header from "../../components/Header";
import MenuLateral from "../../components/Navbar";
import "./index.css"
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Card, CardGroup } from 'react-bootstrap';
import { format } from "date-fns";
import { AiOutlineFileSearch } from 'react-icons/ai';
import { useUserAuth } from '../../context/UserAuthContext';

function Vendas() {
  const [vendas, setVendas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVenda, setSelectedVenda] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [vendasEmDinheiro, setVendasEmDinheiro] = useState([])
  const [lgShow, setLgShow] = useState(false);
  const {user} = useUserAuth()
  useEffect(() => {
    const fetchVendas = async () => {
      
        const uid = user.uid; 

        const vendasCollection = collection(db, 'usuarios', uid, 'orders');
        const vendasSnapshot = await getDocs(vendasCollection);
        const vendasList = vendasSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
        setVendas(vendasList);
    };
    fetchVendas();
}, []);
  
 
  
  const [vendasDeHoje, setVendasDeHoje] = useState([]);
  const dataAtual = new Date();
const mesAtual = dataAtual.getMonth(); // Obter o mês atual (de 0 a 11)
const meses = [
  "Janeiro", "Fevereiro", "Março", "Abril",
  "Maio", "Junho", "Julho", "Agosto",
  "Setembro", "Outubro", "Novembro", "Dezembro"
];

const nomeMesAtual = meses[mesAtual];


  const dataFormatada = format(dataAtual, "dd/MM/yyyy");
  
  // console.log(dataFormatada); 
  useEffect(() => {
    const fetchVendasHoje = async () => {
    // Obtenha o UID do usuário

        const vendasHojeCollection = collection(db, 'usuarios', uid, 'orders');
        const dataAtual = new Date();
        const dataFormatada = format(dataAtual, "dd/MM/yyyy");

        const queryHoje = query(vendasHojeCollection, where('date', '==', dataFormatada));
        const vendasHojeSnapshot = await getDocs(queryHoje);
        const vendasHojeList = vendasHojeSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        setVendasDeHoje(vendasHojeList);
    };
    fetchVendasHoje();
}, []);

  const hoje = new Date();
  const diaDeHoje = hoje.toLocaleDateString();
  
  
// vendas de hoje 


    const totalVendasEmDinheiroHoje = vendas
    .filter((venda) => venda.pagamento === "dinheiro" && venda.date === dataFormatada)
    .reduce((acc, venda) => acc + venda.total, 0);
  
  const totalVendasEmDebitoHoje = vendas
    .filter((venda) => venda.pagamento === "debito" && venda.date === dataFormatada)
    .reduce((acc, venda) => acc + venda.total, 0);
  
  const totalVendasEmCreditoHoje = vendas
    .filter((venda) => venda.pagamento === "credito" && venda.date === dataFormatada)
    .reduce((acc, venda) => acc + venda.total, 0);
  
  const totalVendasHoje = vendas
    .filter((venda) => venda.date === dataFormatada)
    .reduce((acc, venda) => acc + venda.total, 0);

// vendas total 
  


const totalVendasEmDinheiro = vendas
  .filter((venda) => venda.pagamento === "dinheiro" && venda.month === mesAtual)
  .reduce((acc, venda) => acc + venda.total, 0);

  
const totalVendasEmDebito = vendas
  .filter((venda) => venda.pagamento === "debito" && venda.month === mesAtual)
  .reduce((acc, venda) => acc + venda.total, 0);

const totalVendasEmCredito = vendas
  .filter((venda) => venda.pagamento === "credito" && venda.month === mesAtual)
  .reduce((acc, venda) => acc + venda.total, 0);

const totalVendas = vendas
  .filter((venda) => venda.month === mesAtual)
  .reduce((acc, venda) => acc + venda.total, 0);



  
  const getVenda = async (vendaId) => {
    
    const uid = user.uid; 

    const vendaRef = doc(db, 'usuarios', uid, 'orders', vendaId);
    const vendaDoc = await getDoc(vendaRef);

    if (vendaDoc.exists()) {
        return {
            id: vendaDoc.id,
            ...vendaDoc.data(),
        };
    } else {
        throw new Error("A venda não existe.");
    }
};

  const handleShowModal = async (vendaId) => {
    const venda = await getVenda(vendaId);
    setSelectedVenda(venda);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setSelectedVenda(null);
    setShowModal(false);
  };

  const filteredVendas = vendas.filter(
    (venda) =>
      venda.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venda.date.toLowerCase().includes(searchQuery.toLowerCase()) ||
      venda.pagamento.toLowerCase().includes(searchQuery.toLowerCase())

  );

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  return (
    <div className="DashboardContainer">
      <div className="LeftContainer">
        <MenuLateral />
      </div>
      <div className="RigthContainer" >
        <Header />
        

       

         
          <Modal
        size="lg"
        show={lgShow}
        
        onHide={() => setLgShow(false)}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg">
            Relatório
          </Modal.Title>
        </Modal.Header>
        <Modal.Body> 
       
              <Row>
                <h3> Vendas do Mês de {nomeMesAtual}</h3>

                <Col className="colPersonalizada" >

                  <div className="ConteinerCard" >
                    <h3 className="TituloCard">Venda em Dinheiro</h3>
                    <h3 className="TextCard">R$ {totalVendasEmDinheiro.toFixed(2)}</h3>
                  </div>
                  <div className="ConteinerCard" >
                    <h3 className="TituloCard">Venda em Debito</h3>
                    <h3 className="TextCard">R$ {totalVendasEmDebito.toFixed(2)}</h3>
                  </div>
                  <div className="ConteinerCard" >
                    <h3 className="TituloCard">Venda em Crédito</h3>
                    <h3 className="TextCard">R$ {totalVendasEmCredito.toFixed(2)}</h3>
                  </div>
                  <div className="ConteinerCard" >
                    <h3 className="TituloCard">Total</h3>
                    <h3 className="TextCard">R$ {totalVendas.toFixed(2)}</h3>
                  </div>
                </Col>

              </Row>
              <Row>

                <h3> Vendas de Hoje, {dataFormatada} </h3>

                <Col className="colPersonalizada" >

                  <div className="ConteinerCard" >
                    <h3 className="TituloCard">Venda em Dinheiro</h3>
                    <h3 className="TextCard">R$ {totalVendasEmDinheiroHoje.toFixed(2)}</h3>
                  </div>
                  <div className="ConteinerCard" >
                    <h3 className="TituloCard">Venda em Debito</h3>
                    <h3 className="TextCard">R$ {totalVendasEmDebitoHoje.toFixed(2)}</h3>
                  </div>
                  <div className="ConteinerCard" >
                    <h3 className="TituloCard">Venda em Crédito</h3>
                    <h3 className="TextCard">R$ {totalVendasEmCreditoHoje.toFixed(2)}</h3>
                  </div>
                  <div className="ConteinerCard" >
                    <h3 className="TituloCard">Total</h3>
                    <h3 className="TextCard">R$ {totalVendasHoje.toFixed(2)}</h3>
                  </div>
                </Col>
              </Row>
             
        </Modal.Body>
      </Modal>
      <div className="ContainerDash">
                    <div className='TableContainer'>
                        <div className="ConteinerTabela">
                            <div className="ContainerTitulo">
                                <h3 className="TituloTabela">Vendas</h3>
                                <Form.Control
                  type="text"
                  placeholder="Pesquisar"
                  className="ms-2"
                  value={searchQuery}
                  onChange={handleSearch}
                />
                                <Button variant="primary" className="btnTabela" size="sm" onClick={() => setLgShow(true)} >Relatorio</Button>

                            </div>

           
              

                            <Table hover size="sm"  >

                <thead className="CabecalhoTabela">
                  <tr className="Linha">
                    <th className="ItemCabeçalhoTabela">ID do Pedido</th>
                    <th className="ItemCabeçalhoTabela">Data</th>
                    <th className="ItemCabeçalhoTabela">Total</th>
                    <th className="ItemCabeçalhoTabela">Pagamento</th>
                    <th className="ItemCabeçalhoTabela"></th>
                  </tr>
                </thead>
                <tbody className="LinhaTabela">
                  {filteredVendas.map((venda) => (
                    <tr key={venda.id}>
                      <td>{venda.id}</td>
                      <td>{venda.date}</td>
                      <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(venda.total)}</td>
                      {/* <td>R${venda.total}</td> */}
                      <td>{venda.pagamento}</td>
                      <td>
                      <button className='btnOption'
                          
                          onClick={() => handleShowModal(venda.id)}
                        >
                          <AiOutlineFileSearch className='iconBtn' />
                        </button>
                      </td>
                    </tr>
                  ))}
                  {/* {vendas.map((venda) => (
            <tr key={venda.id}>
              <td>{venda.id}</td>
              <td>{venda.date}</td>
              <td>
                <Button variant="primary" onClick={() => handleShowModal(venda.id)}>
                  Ver Detalhes
                </Button>
              </td>
            </tr>
          ))} */}
                </tbody>
              </Table>
              </div>
                    </div>
              {selectedVenda && (
                <Modal size="lg" show={showModal} onHide={handleCloseModal}>
                  <Modal.Header closeButton>
                    <Modal.Title>Detalhes da Venda {selectedVenda.id}</Modal.Title>
                  </Modal.Header>
                  <Modal.Body>
                  <h3 className="TituloTabela">Nº: {selectedVenda.id}</h3>

                  <Table hover size="sm"  >
                      <thead className="CabecalhoTabela">
                        <tr className="Linha">
                          <th className="ItemCabeçalhoTabela">Data</th>
                          <th className="ItemCabeçalhoTabela">Pagamento</th>
                          <th className="ItemCabeçalhoTabela">Recebido</th>
                          <th className="ItemCabeçalhoTabela">Total</th>
                        </tr>
                      </thead>
                      <tbody className="LinhaTabela">
                      
                          <tr>
                            <td>{selectedVenda.date}</td>
                            <td>{selectedVenda.pagamento}</td>
                            <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedVenda.recebido)}</td>
                            {/* <td>{selectedVenda.recebido}</td> */}
                            {/* <td>{selectedVenda.total}</td> */}
                            <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(selectedVenda.total)}</td>
                          </tr>
                       
                      </tbody>
                    </Table>
                    <h3 className="TituloTabela">Itens</h3>

                    <Table hover size="sm"  >
                      <thead className="CabecalhoTabela">
                        <tr className="Linha">
                          <th className="ItemCabeçalhoTabela">Código de Barras</th>
                          <th className="ItemCabeçalhoTabela">Nome</th>
                          <th className="ItemCabeçalhoTabela">Quantidade</th>
                          <th className="ItemCabeçalhoTabela">Total</th>
                        </tr>
                      </thead>
                      <tbody className="LinhaTabela">
                        {selectedVenda.items.map((item) => (
                          <tr key={item.codigoBarras}>
                            <td>{item.codigoBarras}</td>
                            <td>{item.name}</td>
                            <td>{item.quantity}</td>
                            {/* <td>{item.total}</td> */}
                            <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(item.total)}</td>
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </Modal.Body>
                  <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                      Fechar
                    </Button>
                  </Modal.Footer>
                </Modal>
              )}
            </div>
          </div>

        </div>
     
  );
}

export default Vendas;