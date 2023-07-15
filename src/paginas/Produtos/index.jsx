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
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { Alert } from 'react-bootstrap';
import { useUserAuth } from '../../context/UserAuthContext';
function Produtos() {

    const {user} = useUserAuth()
    // State do Formulario de cadastro de produtos
    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [valorCompra, setValorCompra] = useState();
    const [quantidade, setQuantidade] = useState();
    const [categoria, setCategoria] = useState('');
    const [codigoBarras, setCodigoBarras] = useState();

    // Fim das State do Formulario de cadastro de produtos

    const [lgShow, setLgShow] = useState(false);
    const [lgShowEdit, setLgShowEdit] = useState(false);


    const [products, setProducts] = useState([]);
    const [editingProduct, setEditingProduct] = useState(null);
    const [showAlert, setShowAlert] = useState(false);
    
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           
            const uid = user.uid;
    
            const docRef = await addDoc(collection(db, 'usuarios', uid, 'products'), {
                name: name,
                price: price,
                valorCompra: valorCompra,
                quantidade: quantidade,
                categoria: categoria,
                codigoBarras: codigoBarras
            });
    
            console.log('Product added with ID:', docRef.id);
            setName('');
            setPrice('');
            setValorCompra();
            setQuantidade();
            setCategoria('');
            setCodigoBarras('');
            setProducts([...products, {
                name: name,
                price: price,
                valorCompra: valorCompra,
                quantidade: quantidade,
                categoria: categoria,
                codigoBarras: codigoBarras
            }]);
            setShowAlert(true); // mostra o alerta
            setLgShow(false);
        } catch (error) {
            console.error('Error adding product: ', error);
        }
    }

    
    useEffect(() => {
        const getProducts = async () => {
            try {
                
                const uid = user.uid;
    
                const querySnapshot = await getDocs(collection(db, 'usuarios', uid, 'products'));
                const productsList = [];
                querySnapshot.forEach((doc) => {
                    productsList.push({ id: doc.id, ...doc.data() });
                });
                setProducts(productsList);
            } catch (error) {
                console.error('Error retrieving products: ', error);
            }
        };
        getProducts();
    }, []);
    const handleDelete = async (id) => {
        try {
            
            const uid = user.uid;
    
            await deleteDoc(doc(db, 'usuarios', uid, 'products', id));
            setProducts((prevProducts) => prevProducts.filter((product) => product.id !== id));
            console.log('Product deleted with ID:', id);
        } catch (error) {
            console.error('Error deleting product:', error);
        }
    };

  
    const handleEdit = (product) => {
        setEditingProduct(product);
        setName(product.name);
        setPrice(product.price);
        setValorCompra(product.valorCompra);
        setQuantidade(product.quantidade);
        setCategoria(product.categoria);
        setCodigoBarras(product.codigoBarras);
        setLgShowEdit(true)
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            
            const uid = user.uid;
    
            const productRef = doc(db, 'usuarios', uid, 'products', editingProduct.id);
            await setDoc(productRef, {
                name,
                price,
                valorCompra,
                quantidade,
                categoria,
                codigoBarras,
            }, { merge: true });
    
            setProducts((prevProducts) =>
                prevProducts.map((product) =>
                    product.id === editingProduct.id
                        ? {
                              ...product,
                              name,
                              price,
                              valorCompra,
                              quantidade,
                              categoria,
                              codigoBarras,
                          }
                        : product
                )
            );
    
            setEditingProduct(null);
            setName('');
            setPrice('');
            setValorCompra();
            setQuantidade();
            setCategoria('');
            setCodigoBarras();
    
            console.log('Product updated with ID:', editingProduct.id);
        } catch (error) {
            console.error('Error updating product:', error);
        }
    };

   

    const handleCloseModal = () => {
        setEditingProduct(null);
        setName('');
        setPrice('');
        setValorCompra();
        setQuantidade();
        setCategoria('');
        setCodigoBarras();
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
                                <h3 className="TituloTabela">Produtos</h3>
                                <Button variant="primary" className="btnTabela" size="sm" onClick={() => setLgShow(true)}>
                                    Novo
                                </Button>
                            </div>

                            <div className="position-fixed bottom-0 end-0 p-3">
                                {showAlert &&
                                    <Alert variant="success" onClose={() => setShowAlert(false)} dismissible className="rounded-0 shadow-lg">
                                        Produto salvo com sucesso!
                                    </Alert>
                                }
                                {/* restante do código */}
                            </div>

                            <Table hover size="sm"  >
                                <thead className="CabecalhoTabela">
                                    <tr className="Linha">
                                        <th className="ItemCabeçalhoTabela">Código de Barras</th>
                                        <th className="ItemCabeçalhoTabela">Descrição</th>
                                        <th className="ItemCabeçalhoTabela">Categoria</th>
                                        <th className="ItemCabeçalhoTabela">Quantidade</th>
                                        <th className="ItemCabeçalhoTabela">Preço de Custo</th>
                                        <th className="ItemCabeçalhoTabela">Preço de Venda</th>
                                        <th className="ItemCabeçalhoTabela">Opções</th>
                                    </tr>
                                </thead>
                                <tbody className="LinhaTabela">
                                    {products.map((product) => (
                                        <tr key={product.id} >
                                            <td>{product.codigoBarras}</td>
                                            <td>{product.name}</td>
                                            <td>{product.categoria}</td>
                                            <td>{product.quantidade}</td>
                                            <td>R${product.valorCompra}</td>
                                            <td>R${product.price}</td>
                                            <td>
                                                <button className='btnOption' onClick={() => handleEdit(product)} ><FiEdit className='iconBtn' /></button>
                                                <button className='btnOption' onClick={() => handleDelete(product.id)} ><FiTrash2 className='iconBtn' /></button>
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
                            Cadastrar Produto
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>

                        
                        <Form onSubmit={handleSubmit} >
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Nome</Form.Label>
                                    <Form.Control type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridPassword">
                                    <Form.Label>Categoria</Form.Label>
                                    <Form.Select defaultValue="Choose..." onChange={(e) => setCategoria(e.target.value)} >
                                        <option>Categoria</option>
                                        <option>Categoria 1</option>
                                        <option>Categoria 1</option>
                                        <option>Categoria 1</option>
                                        <option>Categoria 1</option>
                                    </Form.Select>
                                </Form.Group>
                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridCity">
                                    <Form.Label>Preço de Custo</Form.Label>
                                    <Form.Control type="number" placeholder="R$" onChange={(e) => setValorCompra(e.target.value)} />

                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>Preço de Venda</Form.Label>
                                    <Form.Control type="number" placeholder="R$" value={price} onChange={(e) => setPrice(e.target.value)} />

                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridZip">
                                    <Form.Label>Quantidade</Form.Label>
                                    <Form.Control type="number" placeholder="0" onChange={(e) => setQuantidade(e.target.value)} />

                                </Form.Group>
                            </Row>
                            <Form.Group className="mb-3" controlId="formGridAddress1">
                                <Form.Label>Código de Barras</Form.Label>
                                <Form.Control type="number" placeholder="Código de Barras" onChange={(e) => setCodigoBarras(e.target.value)} />

                            </Form.Group>



                            <Button variant="primary" type="submit">
                                Salvar
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>

            </div>
        </div>
                {
        editingProduct && (
            <Modal

                size="lg"
                show={lgShowEdit}
                onHide={handleCloseModal}
                aria-labelledby="example-modal-sizes-title-lg"
            >
                <Modal.Header closeButton>
                    <Modal.Title id="example-modal-sizes-title-lg">
                        Editando Produto: {editingProduct.name}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={handleSave} >
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridEmail">
                                <Form.Label>Nome</Form.Label>
                                <Form.Control type="text" placeholder="Nome" value={name} onChange={(e) => setName(e.target.value)} />
                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridPassword">
                                <Form.Label>Categoria</Form.Label>
                                <Form.Select defaultValue="Choose..." value={categoria} onChange={(e) => setCategoria(e.target.value)} >
                                    <option>Categoria</option>
                                    <option>Categoria 1</option>
                                    <option>Categoria 1</option>
                                    <option>Categoria 1</option>
                                    <option>Categoria 1</option>
                                </Form.Select>
                            </Form.Group>
                        </Row>
                        <Row className="mb-3">
                            <Form.Group as={Col} controlId="formGridCity">
                                <Form.Label>Preço de Custo</Form.Label>
                                <Form.Control type="number" placeholder="R$" value={valorCompra} onChange={(e) => setValorCompra(e.target.value)} />

                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridState">
                                <Form.Label>Preço de Venda</Form.Label>
                                <Form.Control type="number" placeholder="R$" value={price} onChange={(e) => setPrice(e.target.value)} />

                            </Form.Group>

                            <Form.Group as={Col} controlId="formGridZip">
                                <Form.Label>Quantidade</Form.Label>
                                <Form.Control type="number" placeholder="R$" value={quantidade} onChange={(e) => setQuantidade(e.target.value)} />

                            </Form.Group>
                        </Row>
                        <Form.Group className="mb-3" controlId="formGridAddress1">
                            <Form.Label>Código de Barras</Form.Label>
                            <Form.Control type="number" placeholder="R$" value={codigoBarras} onChange={(e) => setCodigoBarras(e.target.value)} />

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



        )
    }
            </div >
            );
}

export default Produtos;