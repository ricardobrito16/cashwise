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
import { useUserAuth } from '../../context/UserAuthContext';

function Assistencia() {
    const { user} = useUserAuth()
    

    const [name, setName] = useState('');
    const [nome, setNome] = useState("")
    const [cpf, setCpf] = useState()
    const [endereco, setEndereco] = useState()
    const [email, setEmail] = useState()
    const [telefone, setTelefone] = useState()
    const [recado, setRecado] = useState()

    const [marca, setMarca] = useState()
    const [modelo, setModelo] = useState()
    const [detalhes, setDetalhes] = useState()
    const [relato, setRelato] = useState()
    const [diagnostico, setDiagnostico] = useState()
    const [observacao, setObservacao] = useState()
    const [servicos, setServicos] = useState()
    const [pecas, setPecas] = useState()
    const [status, setStatus] = useState("");

    const [price, setPrice] = useState('');
    const [valorCompra, setValorCompra] = useState();
    const [quantidade, setQuantidade] = useState();
    const [categoria, setCategoria] = useState('');
    const [codigoBarras, setCodigoBarras] = useState();

   

    const [lgShow, setLgShow] = useState(false);
    const [lgShowEdit, setLgShowEdit] = useState(false);
    const [assistencia, setAssistencia] = useState([]);
    const [clientes, setClientes] = useState([]);
    const [clienteSelecionado, setClienteSelecionado] = useState(null);

    const [client, setClient] = useState([]);
    const [ordem, setOrdem] = useState([]);
    const [editingOrdem, setEditingOrdem] = useState(null);

    const total = isNaN(servicos) || isNaN(pecas) ? 0 : servicos + pecas;

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
           
            const uid = user.uid; 
    
            const docRef = await addDoc(collection(db, 'usuarios', uid, 'assistencia'), {
                nome: nome,
                cpf: cpf,
                endereco: endereco,
                email: email,
                telefone: telefone,
                recado: recado,
                marca: marca,
                modelo: modelo,
                detalhes: detalhes,
                relato: relato,
                diagnostico: diagnostico,
                observacao: observacao,
                servicos: servicos,
                pecas: pecas,
                total: total,
                status: status,
                
    
            });
            console.log('Ordem added with ID:', docRef.id);
    
            setNome("");
            setCpf("");
            setEndereco("");
            setEmail("");
            setTelefone("");
            setRecado("");
            setMarca("");
            setModelo("");
            setDetalhes("");
            setRelato("");
            setDiagnostico("");
            setObservacao("");
            setServicos("");
            setPecas("");
            setStatus("");
            setOrdem([...ordem, {
                nome: nome,
                cpf: cpf,
                endereco: endereco,
                email: email,
                telefone: telefone,
                recado: recado,
                marca: marca,
                modelo: modelo,
                detalhes: detalhes,
                relato: relato,
                diagnostico: diagnostico,
                observacao: observacao,
                servicos: servicos,
                pecas: pecas,
                total: total,
                status: status,
    
            }]);
        } catch (error) {
            console.error('Error adding Ordem: ', error);
        }
    };


    useEffect(() => {
        const getOrdem = async () => {
           
            const uid = user.uid; 
    
            const querySnapshot = await getDocs(collection(db, 'usuarios', uid, 'assistencia'));
            const OrdemList = [];
            querySnapshot.forEach((doc) => {
                OrdemList.push({ id: doc.id, ...doc.data() });
            });
            setOrdem(OrdemList);
        };
        getOrdem();
    }, []);

    const handleDelete = async (id) => {
        try {
            
            const uid = user.uid; 
    
            await deleteDoc(doc(db, 'usuarios', uid, 'assistencia', id));
            setOrdem((prevOrdem) => prevOrdem.filter((ordem) => ordem.id !== id));
            console.log('Ordem deleted with ID:', id);
        } catch (error) {
            console.error('Error deleting Ordem:', error);
        }
    };

    const handleEdit = (ordem) => {
        setEditingOrdem(ordem);
        setNome(ordem.nome);
        setCpf(ordem.cpf);
        setEndereco(ordem.endereco);
        setEmail(ordem.email);
        setTelefone(ordem.telefone);
        setRecado(ordem.recado);
        setMarca(ordem.marca);
        setModelo(ordem.modelo);
        setDetalhes(ordem.detalhes);
        setRelato(ordem.relato);
        setDiagnostico(ordem.diagnostico);
        setObservacao(ordem.observacao);
        setServicos(ordem.servicos);
        setPecas(ordem.pecas);
        setStatus(ordem.status);


        setLgShowEdit(true)
    };

    
    const handleSave = async (e) => {
        e.preventDefault();
        try {
            
            const uid = user.uid; // Obtenha o UID do usuário
    
            const assistenciaRef = doc(db, 'usuarios', uid, 'assistencia', editingOrdem.id);
            await setDoc(assistenciaRef, {
                nome,
                cpf,
                endereco,
                email,
                telefone,
                recado,
                marca,
                modelo,
                detalhes,
                relato,
                diagnostico,
                observacao,
                servicos,
                pecas,
                total,
                status,
               
            }, { merge: true });
    
            setOrdem((prevOrdem) =>
                prevOrdem.map((ordem) =>
                    ordem.id === editingOrdem.id ? {
                        ...ordem,
                        nome,
                        cpf,
                        endereco,
                        email,
                        telefone,
                        recado,
                        marca,
                        modelo,
                        detalhes,
                        relato,
                        diagnostico,
                        observacao,
                        servicos,
                        pecas,
                        total,
                        status,
                       
                    } : ordem
                )
            );
    
            setEditingOrdem(null);
            setNome("");
            setCpf("");
            setEndereco("");
            setEmail("");
            setTelefone("");
            setRecado("");
            setMarca("");
            setModelo("");
            setDetalhes("");
            setRelato("");
            setDiagnostico("");
            setObservacao("");
            setServicos("");
            setPecas("");
            setStatus("");
            console.log('Ordem updated with ID:', editingOrdem.id);
        } catch (error) {
            console.error('Error updating Ordem:', error);
        }
    };

    const handleCloseModal = () => {
        setEditingOrdem(null);
        setNome("");
        setCpf("");
        setEndereco("");
        setEmail("");
        setTelefone("");
        setRecado("");
        setMarca("");
        setModelo("");
        setDetalhes("");
        setRelato("");
        setDiagnostico("");
        setObservacao("");
        setServicos("");
        setPecas("");
        setStatus("");
    };
    // NÃO MEXER
    function handleClienteSelecionado(event) {
        const clienteId = event.target.value;
        const clienteSelecionado = clientes.find((cliente) => cliente.id === clienteId);
        setClienteSelecionado(clienteSelecionado);
        setNome(clienteSelecionado.nome);
        setEmail(clienteSelecionado.email);
        setCpf(clienteSelecionado.cpf);
        setRecado(clienteSelecionado.recado);
        setTelefone(clienteSelecionado.telefone);
        setEndereco(clienteSelecionado.endereco);
    }
    useEffect(() => {
        async function buscarClientes() {
        
            const uid = user.uid; 
    
            const clientesRef = collection(db, 'usuarios', uid, 'clientes');
            const clientesSnapshot = await getDocs(clientesRef);
            const clientesData = clientesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setClientes(clientesData);
        }
        buscarClientes();
    }, []);
    // NÃO MEXER
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
                                <h3 className="TituloTabela">Assistencias</h3>
                                <Button variant="primary" className="btnTabela" size="sm" onClick={() => setLgShow(true)}>
                                    Novo
                                </Button>
                            </div>
                            <Table hover size="sm"  >
                                <thead className="CabecalhoTabela">
                                    <tr className="Linha">
                                        <th className="ItemCabeçalhoTabela">CPF</th>
                                        <th className="ItemCabeçalhoTabela">Cliente</th>
                                        <th className="ItemCabeçalhoTabela">Status</th>
                                        <th className="ItemCabeçalhoTabela">Opções</th>
                                        {/* <th>Categoria</th>
                                    <th>Quantidade</th>
                                    <th>Preço de Custo</th>
                                    <th>Preço de Venda</th>
                                    <th>Opções</th> */}
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
                                            <td>
                                            <button className='btnOption' onClick={() => handleEdit(ordem)} ><FiEdit className='iconBtn' /></button>
                                            <button className='btnOption' size="sm" onClick={() => handleDelete(ordem.id)} ><FiTrash2 className='iconBtn' /></button> </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        </div>
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
                            Nova Ordem de Serviço
                        </Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <Form onSubmit={handleSubmit} >
                            <Row className="mb-3">
                                <h3>Informações do Cliente</h3>

                                <Form.Group as={Col} controlId="formGridCliente">
                                    <Form.Label>Cliente</Form.Label>
                                    <Form.Select defaultValue={clienteSelecionado?.id} onChange={handleClienteSelecionado}>
                                        {clientes.map((cliente) => (
                                            <option key={cliente.id} value={cliente.id}>
                                                {cliente.nome}
                                            </option>
                                        ))}
                                    </Form.Select>
                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control plaintext readOnly type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                </Form.Group>


                            </Row>
                            <Row className="mb-3">
                                <Form.Group as={Col} controlId="formGridCity">
                                    <Form.Label>CPF</Form.Label>
                                    <Form.Control plaintext readOnly type="number" placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} />

                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>Telefone de Contato</Form.Label>
                                    <Form.Control plaintext readOnly type="text" placeholder="Telefone de Contato" value={recado} onChange={(e) => setRecado(e.target.value)} />

                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridZip">
                                    <Form.Label>Telefone</Form.Label>
                                    <Form.Control plaintext readOnly type="number" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />

                                </Form.Group>
                            </Row>
                            <Form.Group className="mb-3" controlId="formGridAddress1">
                                <Form.Label>Endereço</Form.Label>
                                <Form.Control plaintext readOnly type="text" placeholder="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} />

                            </Form.Group>

                            <h3>Informações do Produto</h3>
                            <Row className="mb-3">


                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>Marca</Form.Label>
                                    <Form.Control type="text" placeholder="Marca" value={marca} onChange={(e) => setMarca(e.target.value)} />

                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>Modelo</Form.Label>
                                    <Form.Control type="text" placeholder="Modelo" value={modelo} onChange={(e) => setModelo(e.target.value)} />
                                </Form.Group>
                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>Detalhes</Form.Label>
                                    <Form.Control type="text" placeholder="Detalhes" value={detalhes} onChange={(e) => setDetalhes(e.target.value)} />
                                </Form.Group>

                            </Row>
                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Relato do Cliente</Form.Label>
                                <Form.Control as="textarea" rows={2} value={relato} onChange={(e) => setRelato(e.target.value)} />
                            </Form.Group>


                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Diagnóstico e Serviço a ser prestado</Form.Label>
                                <Form.Control as="textarea" rows={2} value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} />
                            </Form.Group>

                            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                <Form.Label>Garantias e Observações</Form.Label>
                                <Form.Control as="textarea" rows={2} value={observacao} onChange={(e) => setObservacao(e.target.value)} />
                            </Form.Group>

                            <h3>Orçamento</h3>

                            <Row className="mb-3">


                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>Valor dos Serviços</Form.Label>
                                    <Form.Control type="number" placeholder="R$" onChange={(e) => setServicos(Number(e.target.value))} />

                                </Form.Group>

                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>Valor de Peças/Produtos</Form.Label>
                                    <Form.Control type="number" placeholder="R$" onChange={(e) => setPecas(Number(e.target.value))} />
                                </Form.Group>

                            </Row>
                            <Row className="mb-3">


                                <Form.Group as={Col} controlId="formGridState">
                                    <Form.Label>Valor Total</Form.Label>
                                    <div>{total}</div>

                                </Form.Group>


                                <Form.Group as={Col} controlId="formGridCliente">
                                    <Form.Label>Status</Form.Label>
                                    <Form.Select aria-label="Default select example" onChange={(e) => setStatus(e.target.value)} >
                                        <option>Selecione...</option>
                                        <option value="Aceito">Aceito</option>
                                        <option value="Negado">Negado</option>
                                        <option value="Em Produção">Em Produção</option>
                                        <option value="Concluído">Concluído</option>
                                        <option value="Cancelado">Cancelado</option>
                                    </Form.Select>
                                </Form.Group>

                            </Row>

                            <Button variant="primary" type="submit">
                                Salvar
                            </Button>
                        </Form>
                    </Modal.Body>
                </Modal>





                {
                    editingOrdem && (
                        <Modal

                            size="lg"
                            show={lgShowEdit}
                            onHide={handleCloseModal}
                            aria-labelledby="example-modal-sizes-title-lg"
                        >
                            <Modal.Header closeButton>
                                <Modal.Title id="example-modal-sizes-title-lg">
                                    Editando Ordem: {editingOrdem.nome}
                                </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                
                                <Form onSubmit={handleSave} >

                                    <Row className="mb-3">
                                        <h3>Informações do Cliente</h3>

                                        <Form.Group as={Col} controlId="formGridCliente">
                                            <Form.Label>Cliente</Form.Label>
                                            <Form.Select defaultValue={clienteSelecionado?.id} onChange={handleClienteSelecionado}>
                                                {clientes.map((cliente) => (
                                                    <option key={cliente.id} value={cliente.id}>
                                                        {cliente.nome}
                                                    </option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGridEmail">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control plaintext readOnly type="text" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                                        </Form.Group>


                                    </Row>
                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="formGridCity">
                                            <Form.Label>CPF</Form.Label>
                                            <Form.Control plaintext readOnly type="number" placeholder="CPF" value={cpf} onChange={(e) => setCpf(e.target.value)} />

                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGridState">
                                            <Form.Label>Telefone de Contato</Form.Label>
                                            <Form.Control plaintext readOnly type="text" placeholder="Telefone de Contato" value={recado} onChange={(e) => setRecado(e.target.value)} />

                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGridZip">
                                            <Form.Label>Telefone</Form.Label>
                                            <Form.Control plaintext readOnly type="number" placeholder="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />

                                        </Form.Group>
                                    </Row>
                                    <Form.Group className="mb-3" controlId="formGridAddress1">
                                        <Form.Label>Endereço</Form.Label>
                                        <Form.Control plaintext readOnly type="text" placeholder="Endereço" value={endereco} onChange={(e) => setEndereco(e.target.value)} />

                                    </Form.Group>

                                    <h3>Informações do Produto</h3>
                                    <Row className="mb-3">


                                        <Form.Group as={Col} controlId="formGridState">
                                            <Form.Label>Marca</Form.Label>
                                            <Form.Control type="text" placeholder="Telefone de Contato" value={marca} onChange={(e) => setMarca(e.target.value)} />

                                        </Form.Group>
                                        <Form.Group as={Col} controlId="formGridState">
                                            <Form.Label>Modelo</Form.Label>
                                            <Form.Control type="text" placeholder="Telefone de Contato" value={modelo} onChange={(e) => setModelo(e.target.value)} />
                                        </Form.Group>
                                        <Form.Group as={Col} controlId="formGridState">
                                            <Form.Label>Detalhes</Form.Label>
                                            <Form.Control type="text" placeholder="Telefone de Contato" value={detalhes} onChange={(e) => setDetalhes(e.target.value)} />
                                        </Form.Group>

                                    </Row>
                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>Relato do Cliente</Form.Label>
                                        <Form.Control as="textarea" rows={2} value={relato} onChange={(e) => setRelato(e.target.value)} />
                                    </Form.Group>


                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>Diagnóstico e Serviço a ser prestado</Form.Label>
                                        <Form.Control as="textarea" rows={2} value={diagnostico} onChange={(e) => setDiagnostico(e.target.value)} />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                                        <Form.Label>Garantias e Observações</Form.Label>
                                        <Form.Control as="textarea" rows={2} value={observacao} onChange={(e) => setObservacao(e.target.value)} />
                                    </Form.Group>

                                    <h3>Orçamento</h3>

                                    <Row className="mb-3">


                                        <Form.Group as={Col} controlId="formGridState">
                                            <Form.Label>Valor dos Serviços</Form.Label>
                                            <Form.Control type="number" placeholder="R$" value={servicos} onChange={(e) => setServicos(Number(e.target.value))} />

                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGridState">
                                            <Form.Label>Valor de Peças/Produtos</Form.Label>
                                            <Form.Control type="number" placeholder="R$" value={pecas} onChange={(e) => setPecas(Number(e.target.value))} />
                                        </Form.Group>

                                    </Row>
                                    <Row className="mb-3">


                                        <Form.Group as={Col} controlId="formGridState">
                                            <Form.Label>Valor Total</Form.Label>
                                            <div>{total}</div>

                                        </Form.Group>


                                        <Form.Group as={Col} controlId="formGridCliente">
                                            <Form.Label>Status</Form.Label>
                                            <Form.Select aria-label="Default select example" onChange={(e) => setStatus(e.target.value)} >
                                                <option>Selecione...</option>
                                                <option value="Aceito">Aceito</option>
                                                <option value="Negado">Negado</option>
                                                <option value="Em Produção">Em Produção</option>
                                                <option value="Concluído">Concluído</option>
                                                <option value="Cancelado">Cancelado</option>
                                            </Form.Select>
                                        </Form.Group>

                                    </Row>

                                    <Button variant="primary" type="submit">
                                        Salvar
                                    </Button>
                                </Form>
                            </Modal.Body>
                        </Modal>



                    )
                }
 </div>
            </div >
            );
}

            export default Assistencia;