import { useEffect, useState } from "react";
import Header from "../../components/Header";
import MenuLateral from "../../components/Navbar";
import "./index.css"
import { collection, addDoc, getDocs, getDoc, doc, deleteDoc, setDoc, where, query } from 'firebase/firestore';

import { db } from "../../config/firebase";
import { Button, Card, CardGroup, Col, Container, Row, Table } from "react-bootstrap";
import { format } from "date-fns";
import { useUserAuth } from "../../context/UserAuthContext";
import Toast from 'react-bootstrap/Toast';
import { Navigate, useNavigate } from "react-router-dom";
import Alert from 'react-bootstrap/Alert';

function Dashboard() {
  const [products, setProducts] = useState([]);
  const [vendas, setVendas] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedVenda, setSelectedVenda] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [vendasEmDinheiro, setVendasEmDinheiro] = useState([])
  const [lgShow, setLgShow] = useState(false);

  const [ordem, setOrdem] = useState([])
const {user, statusAssinatura,
  validadeAssinatura, assinaturaExpirada, validadeAssinaturaParse} = useUserAuth();
  const navigate = useNavigate();
  
  const dataAtual = new Date();
  const [exibirAlertaWarning, setExibirAlertaWarning] = useState(false);
  const [exibirAlertaDanger, setExibirAlertaDanger] = useState(false);

  
  // Calcula a diferença em milissegundos entre as duas datas
  const diferencaTempo = validadeAssinaturaParse.getTime() - dataAtual.getTime();
  
  // Converte a diferença em dias
  const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));
  
  // Verifica se a diferença é igual ou inferior a 5 dias
  useEffect(() => {
    // Calcula a diferença em milissegundos entre as duas datas
    const diferencaTempo = validadeAssinaturaParse.getTime() - dataAtual.getTime();

    // Converte a diferença em dias
    const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));

    // Verifica se a diferença é igual ou inferior a 5 dias
    if (diferencaDias <= 0) {
      setExibirAlertaDanger(true);
      setExibirAlertaWarning(false);
    } else if (diferencaDias <= 5) {
      setExibirAlertaWarning(true);
      setExibirAlertaDanger(false);
    } else {
      setExibirAlertaWarning(false);
      setExibirAlertaDanger(false);
    }
  }, [validadeAssinaturaParse, dataAtual]);


  useEffect(() => {
    const fetchVendas = async () => {
        
        const uid = user.uid; // Obtenha o UID do usuário

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

  const mesAtual = dataAtual.getMonth(); // Obter o mês atual (de 0 a 11)
  const meses = [
    "Janeiro", "Fevereiro", "Março", "Abril",
    "Maio", "Junho", "Julho", "Agosto",
    "Setembro", "Outubro", "Novembro", "Dezembro"
  ];


  const nomeMesAtual = meses[mesAtual];

  const dataFormatada = format(dataAtual, "dd/MM/yyyy");

  useEffect(() => {
    const fetchVendasHoje = async () => {
       
        const uid = user.uid; // Obtenha o UID do usuário

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


  useEffect(() => {
    
    const uid = user.uid; 

    async function fetchProducts() {
        const q = query(collection(db, "usuarios", uid, "products"), where("quantidade", "<", 5));
        const querySnapshot = await getDocs(q);
        const productsData = [];
        querySnapshot.forEach((doc) => {
            productsData.push({ id: doc.id, ...doc.data() });
        });
        setProducts(productsData);
    }
    fetchProducts();
}, []);


  // ASSISTENCIA 
  useEffect(() => {
    const uid = user.uid;
  
    const getOrdem = async () => {
      const querySnapshot = await getDocs(
        query(
          collection(db, 'usuarios', uid, 'assistencia'),
          where('status', '==', 'Em Produção')
        )
      );
  
      const OrdemList = [];
      querySnapshot.forEach((doc) => {
        OrdemList.push({ id: doc.id, ...doc.data() });
      });
      setOrdem(OrdemList);
    };
  
    getOrdem();
  }, []);
const [assinatura, setAssinatura] = useState("");

useEffect(() => {
  if (statusAssinatura === "ativo" && !assinaturaExpirada) {
    setAssinatura("Ativo");
  } else {
    setAssinatura("Bloqueado");
  }
}, []);


  return (
    <div className="DashboardContainer">
      
      <div className="LeftContainer">
        <MenuLateral />
      </div>
      <div className="RigthContainer" >
        <Header />
        
        <div className="DashboardBox">
         
          <div className="CardDashboard">
         
            <Container>
            {exibirAlertaWarning && (
              
      <Alert variant="warning">
        A validade da assinatura está próxima! Restam apenas {diferencaDias} dia(s). <Alert.Link href="/checkout">Clique aqui para Renovar</Alert.Link>.
      </Alert>
    )}
    {exibirAlertaDanger && (
    <Alert variant="danger">
      A validade da assinatura expirou! <Alert.Link href="/checkout">Clique aqui para Renovar</Alert.Link>.
    </Alert>
  )}
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
              <Row>

                <Col>
                  <div className="ConteinerTabela">
                    <div className="ContainerTitulo">
                      <h3 className="TituloTabela">Assistencias em Produção</h3>
                      <Button variant="primary" className="btnTabela" size="sm">
                        Ver Todos
                      </Button>
                    </div>

                    <Table >
                      <thead className="CabecalhoTabela">
                        <tr className="Linha" >
                          <th className="ItemCabeçalhoTabela">CPF</th>
                          <th className="ItemCabeçalhoTabela">Nome</th>

                          <th className="ItemCabeçalhoTabela">Status</th>

                        </tr>
                      </thead>
                      <tbody className="LinhaTabela">
                        {ordem.map((ordem) => (
                          <tr key={ordem.id} >
                            <td>{ordem.cpf}</td>
                            <td>{ordem.nome}</td>
                            <td>{ordem.status}</td>
                            {/* <td>{client.categoria}</td>
                                        <td>{client.quantidade}</td>
                                        <td>R${client.valorCompra}</td>
                                        <td>R${client.price}</td> */}

                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>

                </Col>
                <Col>
                  <div className="ConteinerTabela">
                    <div className="ContainerTitulo">
                      <h3 className="TituloTabela">Produtos Esgotando</h3>
                      <Button variant="primary" className="btnTabela" size="sm">
                        Ver Todos
                      </Button>
                    </div>

                    <Table >
                      <thead className="CabecalhoTabela">
                        <tr className="Linha">


                          <th className="ItemCabeçalhoTabela" >Código de Barras</th>
                          <th className="ItemCabeçalhoTabela">Nome</th>
                          <th className="ItemCabeçalhoTabela">Quantidade</th>
                        </tr>
                      </thead>
                      <tbody className="LinhaTabela">
                        {products.map((product) => (

                          <tr key={product.id}>
                            <td>{product.codigoBarras}</td>
                            <td>{product.name}</td>
                            <td>{product.quantidade}</td>

                          </tr>


                        ))}



                      </tbody>
                    </Table>
                  </div>
                </Col>
                <Col>
                  <div className="ConteinerTabela">
                    <div className="ContainerTitulo">
                      <h3 className="TituloTabela">Validade da Assinatura</h3>
                      <Button onClick={()=>{
                      navigate("/checkout");
                      }} variant="primary" className="btnTabela" size="sm">
                        Renovar
                      </Button>
                    </div>

                    <Table >
                      <thead className="CabecalhoTabela">
                        <tr className="Linha">


                          <th className="ItemCabeçalhoTabela" >Validade</th>
                          
                          <th className="ItemCabeçalhoTabela">Status</th>
                        </tr>
                      </thead>
                      <tbody className="LinhaTabela">
                        
                          <tr>
                            <td>{validadeAssinatura}</td>
                       
                            <td>{assinatura}</td>

                          </tr>
                      </tbody>
                    </Table>
                  </div>
                </Col>

              </Row>
              <Row>



              </Row>
            </Container>



          </div>
        </div>

      </div>


    </div >
  );
}

export default Dashboard;