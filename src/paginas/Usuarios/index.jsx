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

function Controle() {
const {user} = useUserAuth()
    

    const [name, setName] = useState('');
    const [nome, setNome] = useState("")
    const [nivelAcesso, setNivelAcesso] = useState()
    const [status, setStatus] = useState()
    const [email, setEmail] = useState()
    const [validade, setValidade] = useState()
    const [recado, setRecado] = useState()


    const [price, setPrice] = useState('');
    const [valorCompra, setValorCompra] = useState();
    const [quantidade, setQuantidade] = useState();
    const [categoria, setCategoria] = useState('');
    const [codigoBarras, setCodigoBarras] = useState();

    

    const [lgShow, setLgShow] = useState(false);
    const [lgShowEdit, setLgShowEdit] = useState(false);


    const [usuarios, setUsuarios] = useState([]);
    const [editingUsuarios, setEditingUsuarios] = useState(null);

    

      useEffect(() => {
        async function getUsuarios() {
    
          const uid = user.uid; 
      
          const querySnapshot = await getDocs(collection(db, 'usuarios'));
          const usuariosList = [];
          querySnapshot.forEach((doc) => {
            usuariosList.push({ id: doc.id, ...doc.data() });
          });
          setUsuarios(usuariosList);
        }
        getUsuarios();
      }, []);
      

    const handleEdit = (usuarios) => {
        setEditingUsuarios(usuarios);
        setNome(usuarios.nome);
        setNivelAcesso(usuarios.nivelAcesso);
        setStatus(usuarios.status);
        setEmail(usuarios.email);
        setValidade(usuarios.validade);
        


        setLgShowEdit(true)
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
          const usuariosRef = doc(db, 'usuarios', editingUsuarios.id); 
          await setDoc(usuariosRef, {
            nome,
            nivelAcesso,
            status,
            email,
            validade,
          }, { merge: true });
          setUsuarios((prevUsuarios) =>
            prevUsuarios.map((usuarios) =>
              usuarios.id === editingUsuarios.id ? {
                ...usuarios,
                nome,
                nivelAcesso,
                status,
                email,
                validade,
              } : usuarios
            )
          );
          setEditingUsuarios(null);
          setNome("");
          setNivelAcesso("");
          setStatus("");
          setEmail("");
          setValidade("");
          console.log('Usuário atualizado com ID:', editingUsuarios.id);
        } catch (error) {
          console.error('Erro ao atualizar o usuário:', error);
        }
      };
      
      
    const handleCloseModal = () => {
        setEditingUsuarios(null);
        setNome("");
        setNivelAcesso("");
        setStatus("");
        setEmail("");
        setValidade("");
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
                                        <th className="ItemCabeçalhoTabela">Nome</th>
                                        <th className="ItemCabeçalhoTabela">UID</th>
                                        <th className="ItemCabeçalhoTabela">Email</th>
                                        <th className="ItemCabeçalhoTabela">Registro</th>
                                        <th className="ItemCabeçalhoTabela">Nivel de Acesso</th>
                                        <th className="ItemCabeçalhoTabela">Assinatura</th>
                                        <th className="ItemCabeçalhoTabela">Validade</th>
                                        <th className="ItemCabeçalhoTabela"></th>
                                        {/* <th>Categoria</th>
                                    <th>Quantidade</th>
                                    <th>Preço de Custo</th>
                                    <th>Preço de Venda</th>
                                    <th>Opções</th> */}
                                    </tr>
                                </thead>
                                <tbody className="LinhaTabela">
                                    {usuarios.map((usuarios) => (
                                        <tr key={usuarios.id} >
                                            <td>{usuarios.nome}</td>
                                            <td>{usuarios.id}</td>
                                            <td>{usuarios.email}</td>
                                            <td>{usuarios.dataRegistro}</td>
                                            <td>{usuarios.nivelAcesso}</td>
                                            <td>{usuarios.status}</td>
                                            <td>{usuarios.validade}</td>
                                            {/* <td>{client.categoria}</td>
                                        <td>{client.quantidade}</td>
                                        <td>R${client.valorCompra}</td>
                                        <td>R${client.price}</td> */}
                                            <td>
                                                <button className='btnOption' onClick={() => handleEdit(usuarios)} ><FiEdit className='iconBtn' /></button>
                                                {/* <button className='btnOption' onClick={() => handleDelete(usuarios.id)} ><FiTrash2 className='iconBtn' /></button> */}
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
                            <Form  >
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
                                        <Form.Label>Validade</Form.Label>
                                        <Form.Control type="text" placeholder="Validade" value={validade} onChange={(e) => setValidade(e.target.value)} />

                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridState">
                                        <Form.Label>Nivel de Acesso</Form.Label>
                                        <Form.Control type="text" placeholder="Nivel de Acesso" value={nivelAcesso} onChange={(e) => setNivelAcesso(e.target.value)} />

                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridZip">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Control type="text" placeholder="Status" value={status} onChange={(e) => setStatus(e.target.value)} />

                                    </Form.Group>
                                </Row>
                                



                                <Button variant="primary" type="submit">
                                    Salvar
                                </Button>
                            </Form>
                        </Modal.Body>
                    </Modal>

                </div>
            </div>
            {editingUsuarios && (
                <Modal

                    size="lg"
                    show={lgShowEdit}
                    onHide={handleCloseModal}
                    aria-labelledby="example-modal-sizes-title-lg"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="example-modal-sizes-title-lg">
                            Editando Client: {editingUsuarios.nome}
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
                                        <Form.Label>Validade</Form.Label>
                                        <Form.Control type="text" placeholder="Validade" value={validade} onChange={(e) => setValidade(e.target.value)} />

                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridState">
                                        <Form.Label>Nivel de Acesso</Form.Label>
                                        <Form.Control type="text" placeholder="Nivel de Acesso" value={nivelAcesso} onChange={(e) => setNivelAcesso(e.target.value)} />

                                    </Form.Group>

                                    <Form.Group as={Col} controlId="formGridZip">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Control type="text" placeholder="Status" value={status} onChange={(e) => setStatus(e.target.value)} />

                                    </Form.Group>
                                </Row>




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

export default Controle;