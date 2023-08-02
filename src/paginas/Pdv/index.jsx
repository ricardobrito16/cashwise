import React, { useState, useEffect } from 'react';
import ReactDOMServer from 'react-dom/server';
import { collection, addDoc, getDocs, doc, deleteDoc, setDoc, getDoc } from 'firebase/firestore';

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
import { Card, Stack, Alert } from 'react-bootstrap';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

import { useCreateOrder } from '../../context/CreateOrderContext';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { MdAddShoppingCart } from 'react-icons/md';
import { useUserAuth } from '../../context/UserAuthContext';
import { db } from '../../config/firebase';
import axios from 'axios';

pdfMake.vfs = pdfFonts.pdfMake.vfs;



function Pdv() {
    const {

        setSearchTerm,

        showSuccessAlert, setShowSuccessAlert,
        showErrorAlert, setShowErrorAlert,
        show,

        handleShow,
        handleClose,
        placeOrder,
        setProducts,
        cart,

        filteredProducts,
        addToCart,
        valorTotal,
        calculateCartTotal,
        handlePlaceOrder,
        removeFromCart,
        abrirJanela,

        setValorTotal,
        selectedOption,
        setValorRecebido,
        valorRecebido,
        troco,
        handleOptionChange

    } = useCreateOrder()
    const { user } = useUserAuth();



    return (
        <div className="DashboardContainer">


            <>
                {showSuccessAlert && (
                    <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: "999" }}>
                        <Alert variant="success" onClose={() => setShowSuccessAlert(false)} dismissible>
                            Pedido finalizado com sucesso!
                        </Alert>
                    </div>
                )}
                {showErrorAlert && (
                    <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: "999" }}>
                        <Alert variant="danger" onClose={() => setShowErrorAlert(false)} dismissible>
                            Não foi possível finalizar o pedido. Tente novamente mais tarde.
                        </Alert>
                    </div>
                )}
                <div className="LeftContainer">
                    <MenuLateral />
                </div>
                <div className="RigthContainer" >
                    <Header />
                    <div className="ContainerDash">
                        <Navbar bg="light" expand="lg">
                            <Container fluid>
                                <Navbar.Brand className="TituloPagina" href="#">Caixa</Navbar.Brand>
                                <Navbar.Toggle aria-controls="navbarScroll" />
                                <Navbar.Collapse id="navbarScroll">
                                    <Nav
                                        className="me-auto my-2 my-lg-0 "
                                        style={{ maxHeight: '100px' }}
                                        navbarScroll
                                    >
                                        <NavDropdown.Divider />
                                    </Nav>
                                </Navbar.Collapse>
                            </Container>
                        </Navbar>
                        <div className='TableContainerPdv'>
                            <Container className='BootstrapContainer' >
                                <Row className='BootstrapLinha' >
                                    <Col xs={8} >
                                        <div className="ConteinerTabela">

                                            <Stack direction="horizontal" gap={3} className='BootstrapSearch' >
                                                <Form.Control className="me-auto" placeholder="Buscar por Nome ou Código de barras" onChange={(event) => setSearchTerm(event.target.value)} />

                                            </Stack>
                                            <Table hover size="sm"  >
                                                <thead className="CabecalhoTabela">
                                                    <tr className="Linha">
                                                        <th className="ItemCabeçalhoTabela">Código de Barras</th>
                                                        <th className="ItemCabeçalhoTabela">Descrição</th>
                                                        <th className="ItemCabeçalhoTabela">Quantidade</th>
                                                        <th className="ItemCabeçalhoTabela">Valor</th>
                                                        <th className="ItemCabeçalhoTabela">Opções</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="LinhaTabela">
                                                    {filteredProducts.map((product) => (
                                                        <tr key={product.id} >
                                                            <td>{product.codigoBarras}</td>
                                                            <td>{product.name}</td>
                                                            <td>{product.quantidade}</td>
                                                            <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</td>

                                                            {/* <td>R${product.price}</td> */}

                                                            <td><button className='btnOption' onClick={
                                                                () => {
                                                                    addToCart(product)
                                                                    // calculateCartTotal().toFixed(2)
                                                                }
                                                            }

                                                            ><MdAddShoppingCart className='iconBtn' /></button> </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>

                                        </div>
                                    </Col>
                                    <Col xs={4} >
                                        <div className="ConteinerTabela">
                                            <Stack direction="horizontal" gap={3} className='BootstrapSearch' >
                                                <h3 className="TituloTabela">Carrinho</h3>

                                            </Stack>
                                            <Table hover size="sm"  >
                                                <thead className="CabecalhoTabela">
                                                    <tr className="Linha">
                                                        <th className="ItemCabeçalhoTabela">Descrição</th>
                                                        <th className="ItemCabeçalhoTabela">Qtd</th>
                                                        <th className="ItemCabeçalhoTabela">Valor</th>
                                                        <th className="ItemCabeçalhoTabela">Total</th>
                                                        <th className="ItemCabeçalhoTabela">Opções</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="LinhaTabela">
                                                    {cart.map((product) => (
                                                        <tr key={product.id} >

                                                            <td>{product.name}
                                                                <div>{product.codigoBarras}</div></td>
                                                            <td>{product.quantity}</td>
                                                            <td>{new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.price)}</td>

                                                            <td>{typeof product.total === 'number' ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.total) : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(product.total)}</td>
                                                            <td><button className='btnOption' onClick={() => {
                                                                removeFromCart(product.id);

                                                            }

                                                            } ><FiTrash2 className='iconBtn' /></button> </td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                            <div className="ConteinerCard" >
                                                <h3 className="TituloCard">Total</h3>
                                                <h3 className="TextCard">R${valorTotal}</h3>
                                            </div>



                                            <div className='btnContainer'>
                                                <Button className='ButtonBootstrap' size="lg" onClick={handleShow} >
                                                    Finalizar
                                                </Button>
                                                <Button className='ButtonBootstrap' size="lg"  >
                                                    Cancelar
                                                </Button>
                                            </div>

                                            <Modal show={show} onHide={handleClose}>
                                                <Modal.Header closeButton>
                                                    <Modal.Title>Finalizar Venda</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <>

                                                        <Card className='CardTotal'>
                                                            <Card.Header>Forma de Pagamento</Card.Header>
                                                            <Card.Body>
                                                                <Form.Select onChange={handleOptionChange}>
                                                                    <option value="">Selecione uma opção</option>
                                                                    <option value="dinheiro">Dinheiro</option>
                                                                    <option value="debito">Debito</option>
                                                                    <option value="credito">Crédito</option>
                                                                </Form.Select>
                                                            </Card.Body>
                                                        </Card>

                                                        {selectedOption === 'dinheiro' && (
                                                            <>
                                                                <Card className='CardTotal'>
                                                                    <Card.Header>Valor Recebido</Card.Header>
                                                                    <Card.Body>
                                                                        <Form.Control
                                                                            type="number"
                                                                            placeholder="R$"

                                                                            onChange={(event) => {
                                                                                const valorDigitado = Number(event.target.value);
                                                                                setValorRecebido(valorDigitado);
                                                                                localStorage.setItem('valorRecebido', valorDigitado);
                                                                            }}
                                                                        />
                                                                    </Card.Body>
                                                                </Card>

                                                                <Card className='CardTotal'>
                                                                    <Card.Header>Troco</Card.Header>
                                                                    <Card.Body>
                                                                        {
                                                                            isNaN(parseFloat(troco)) || typeof troco === 'undefined' ? (
                                                                                <div>Troco não calculado ainda</div>
                                                                            ) : (
                                                                                <blockquote className="blockquote mb-0">
                                                                                    <p>R${parseFloat(troco).toFixed(2)}</p>
                                                                                </blockquote>
                                                                            )
                                                                        }

                                                                    </Card.Body>
                                                                </Card>
                                                            </>
                                                        )}
                                                    </>
                                                    <Button className='ButtonBootstrap'
                                                        size="lg"
                                                        onClick={(event) => {
                                                            event.preventDefault();
                                                            setTimeout(() => {
                                                                abrirJanela();
                                                            }, 1000);
                                                            handlePlaceOrder(event.target.elements);
                                                        }}

                                                    >
                                                        Finalizar
                                                    </Button>
                                                </Modal.Body>
                                                <Modal.Footer>

                                                </Modal.Footer>
                                            </Modal>
                                        </div>

                                    </Col>

                                </Row>
                            </Container>


                        </div>



                    </div>
                </div>
            </>



        </div>
    );
}



export default Pdv;