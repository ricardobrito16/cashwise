import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, doc, deleteDoc, setDoc } from 'firebase/firestore';
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
import { FiEdit, FiTrash2 } from "react-icons/fi"
import { FcFullTrash } from "react-icons/fc"
import { useUserAuth } from '../../context/UserAuthContext';

function Clientes() {
const {user} = useUserAuth()


    const [name, setName] = useState('');
    const [nome, setNome] = useState("")
    const [cpf, setCpf] = useState()
    const [endereco, setEndereco] = useState()
    const [email, setEmail] = useState()
    const [telefone, setTelefone] = useState()
    const [recado, setRecado] = useState()


    const [price, setPrice] = useState('');
    const [valorCompra, setValorCompra] = useState();
    const [quantidade, setQuantidade] = useState();
    const [categoria, setCategoria] = useState('');
    const [codigoBarras, setCodigoBarras] = useState();

    

    const [lgShow, setLgShow] = useState(false);
    const [lgShowEdit, setLgShowEdit] = useState(false);


    const [client, setClient] = useState([]);
    const [editingClient, setEditingClient] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
 
          const uid = user.uid; 
      
          const docRef = await addDoc(collection(db, 'usuarios', uid, 'clientes'), {
            nome: nome,
            cpf: cpf,
            endereco: endereco,
            email: email,
            telefone: telefone,
            recado: recado
          });
      
          console.log('Client added with ID:', docRef.id);
      
          setNome("");
          setCpf("");
          setEndereco("");
          setEmail("");
          setTelefone("");
          setRecado("");
          setClient([...client, {
            nome: nome,
            cpf: cpf,
            endereco: endereco,
            email: email,
            telefone: telefone,
            recado: recado
          }]);
        } catch (error) {
          console.error('Error adding client: ', error);
        }
      };


      useEffect(() => {
        async function getClient() {
    
          const uid = user.uid; 
      
          const querySnapshot = await getDocs(collection(db, 'usuarios', uid, 'clientes'));
          const clientList = [];
          querySnapshot.forEach((doc) => {
            clientList.push({ id: doc.id, ...doc.data() });
          });
          setClient(clientList);
        }
        getClient();
      }, []);
      

      const handleDelete = async (id) => {
        try {
          await deleteDoc(doc(db, 'usuarios', user.uid, 'clientes', id));
          setClient((prevClient) => prevClient.filter((client) => client.id !== id));
          console.log('Client deleted with ID:', id);
        } catch (error) {
          console.error('Error deleting client:', error);
        }
      };

    const handleEdit = (client) => {
        setEditingClient(client);
        setNome(client.nome);
        setCpf(client.cpf);
        setEndereco(client.endereco);
        setEmail(client.email);
        setTelefone(client.telefone);
        setRecado(client.recado);


        setLgShowEdit(true)
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
          const clientRef = doc(db, 'usuarios', user.uid, 'clientes', editingClient.id);
          await setDoc(clientRef, {
            nome,
            cpf,
            endereco,
            email,
            telefone,
            recado,
          }, { merge: true });
          setClient((prevClient) =>
            prevClient.map((client) =>
              client.id === editingClient.id ? {
                ...client,
                nome,
                cpf,
                endereco,
                email,
                telefone,
                recado,
              } : client
            )
          );
          setEditingClient(null);
          setNome("");
          setCpf("");
          setEndereco("");
          setEmail("");
          setTelefone("");
          setRecado("");
          console.log('Client updated with ID:', editingClient.id);
        } catch (error) {
          console.error('Error updating client:', error);
        }
      };
      
    const handleCloseModal = () => {
        setEditingClient(null);
        setNome("");
        setCpf();
        setEndereco("");
        setEmail("");
        setTelefone();
        setRecado();
    };


    return (
        <div className="DashboardContainer">
            <div className="LeftContainer">
                <MenuLateral />
            </div>
            <div className="RigthContainer" >
                <Header />
                <div className="ContainerDash">
                    <div className='TableContainer'>
                        <div className="ConteinerTabela">
                            <div className="ContainerTitulo">
                                <h3 className="TituloTabela">Clientes</h3>
                                <Button variant="primary" className="btnTabela" size="sm" onClick={() => setLgShow(true)}>Novo</Button>

                            </div>
                            <Table hover size="sm"  >
                                <thead className="CabecalhoTabela">
                                    <tr className="Linha">
                                        <th className="ItemCabeçalhoTabela">CPF/CNPJ</th>
                                        <th className="ItemCabeçalhoTabela">Nome</th>
                                        <th className="ItemCabeçalhoTabela"></th>
                                        {/* <th>Categoria</th>
                                    <th>Quantidade</th>
                                    <th>Preço de Custo</th>
                                    <th>Preço de Venda</th>
                                    <th>Opções</th> */}
                                    </tr>
                                </thead>
                                <tbody className="LinhaTabela">
                                    {client.map((client) => (
                                        <tr key={client.id} >
                                            <td>{client.cpf}</td>
                                            <td>{client.nome}</td>
                                            {/* <td>{client.categoria}</td>
                                        <td>{client.quantidade}</td>
                                        <td>R${client.valorCompra}</td>
                                        <td>R${client.price}</td> */}
                                            <td>
                                                <button className='btnOption' onClick={() => handleEdit(client)} ><FiEdit className='iconBtn' /></button>
                                                <button className='btnOption' onClick={() => handleDelete(client.id)} ><FiTrash2 className='iconBtn' /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
                    </div>
                    <Modal
                        size="lg"
                        show={lgShow}
                        onHide={() => setLgShow(false)}
                        aria-labelledby="example-modal-sizes-title-lg"
                    >
                        <Modal.Header closeButton>
                            <Modal.Title id="example-modal-sizes-title-lg">
                                Cadastrar Cliente
                            </Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form onSubmit={handleSubmit} >
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridEmail">
                                        <Form.Label>Nome</Form.Label>
                                        <Form.Control type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                                    </Form.Group>
                                    <Form.Group as={Col} controlId="formGridEmail">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                    </Form.Group>

                                </Row>
                                <Row className="mb-3">
                                    <Form.Group as={Col} controlId="formGridCity">
                                        <Form.Label>CPF</Form.Label>
                                        <Form.Control type="number" placeholder="CPF" onChange={(e) => setCpf(e.target.value)} />

                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridState">
                                        <Form.Label>Telefone de Contato</Form.Label>
                                        <Form.Control type="text" placeholder="Telefone de Contato" value={recado} onChange={(e) => setRecado(e.target.value)} />

                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridZip">
                                        <Form.Label>Telefone</Form.Label>
                                        <Form.Control type="number" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />

                                    </Form.Group>
                                </Row>
                                <Form.Group className="mb-3" controlId="formGridAddress1">
                                    <Form.Label>Endereço</Form.Label>
                                    <Form.Control type="text" placeholder="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} />

                                </Form.Group>



                                <Button variant="primary" type="submit">
                                    Salvar
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>

                </div>
            </div>
            {editingClient && (
                <Modal

                    size="lg"
                    show={lgShowEdit}
                    onHide={handleCloseModal}
                    aria-labelledby="example-modal-sizes-title-lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-modal-sizes-title-lg">
                            Editando Cliente: {editingClient.nome}
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSave} >

                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control type="text" placeholder="Nome" value={nome} onChange={(e) => setNome(e.target.value)} />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </Form.Group>


                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridCity">
                                    <Form.Label>CPF</Form.Label>
                                    <Form.Control type="number" placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} />

                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>Telefone de Contato</Form.Label>
                                    <Form.Control type="text" placeholder="Telefone de Contato" value={recado} onChange={(e) => setRecado(e.target.value)} />

                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridZip">
                                    <Form.Label>Telefone</Form.Label>
                                    <Form.Control type="number" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />

                                </Form.Group>
                            </Row>
                            <Form.Group className="mb-3" controlId="formGridAddress1">
                                <Form.Label>Endereço</Form.Label>
                                <Form.Control type="text" placeholder="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} />
                            </Form.Group>
                            <Button variant="primary" onClick={handleCloseModal} >
                                Cancelar
                            </Button>
                            <Button variant="primary" type="submit">
                                Salvar
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>
            )}
        </div>
    );
}

export default Clientes;