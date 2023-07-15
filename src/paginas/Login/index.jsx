import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import "./styles.css"
import LogoLogin from '../../assets/logo2.png'
import { FaCashRegister,FaBoxes } from 'react-icons/fa'
import { MdHomeRepairService } from 'react-icons/md'
import { useUserAuth } from '../../context/UserAuthContext';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { Col } from 'react-bootstrap';
import Lottie from "lottie-react";
import lottie from "../../assets/lottie.json";
function Login() {
  const [error, setError] = useState("");
  const { logIn, signUp, googleSignIn, password, setPassword, setName, email, setEmail } = useUserAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
  
    try {
      await logIn(email, password);
      navigate("/dashboard");
    } catch (err) {
      if (err.code === "auth/wrong-password") {
        setError("Senha inválida");
      } else {
        setError(err.message);
      }
      console.log(error);
    }
  };
  const handleRegister = async (e) => {
    e.preventDefault();
    setError("")
    try {
      await signUp(email, password);
      navigate("/dashboard");


    } catch (err) {
      setError(err.messege)
    };
  };

  const [mostrarRegistro, setMostrarRegistro] = useState(false)


  const mostrarFormularioRegistro = () => {
    setMostrarRegistro(true);
  };

  const mostrarFormularioLogin = () => {
    setMostrarRegistro(false);
  };

  return (


    <div className='LoginContainer' >
      <div className='cima'>

        <div className='descricaoContainer'>
          <div className='logoLogin'>
            <img className='IMG-LOGIN' src={LogoLogin} alt="CASHWISE" />
          </div>
          <div className='descricao'>
            <div className='tituloDescricao'>Sistema PDV+</div>
            <div className='subtituloDescricao'>Potencialize suas vendas e controle seu negócio </div>
            <div className='descricaoText' >Gerencie seu estoque, vendas e sua assistência técnica, de maneira integrada, otimizando processos e aumentando a produtividade</div>
          </div>

        </div>
        
        <Lottie className='lottieAnimation' animationData={lottie} loop={true} />
       
      </div>
      <div className='baixo'>
        <div className='baixoEsquerda'>
        <div className='stacks'>
        <FaCashRegister className='iconeStack'/>
          <div className='nomeStack' >PDV</div>
        </div>
        <div className='stacks'>
        <FaBoxes className='iconeStack'/>
          <div className='nomeStack' >Estoque</div>
        </div>
        <div className='stacks'>
        <MdHomeRepairService className='iconeStack'/>
          <div className='nomeStack' >Ordem de Serviço</div>
        </div>
        </div>
        <div className='baixoDireita'>
        {!mostrarRegistro ? (
          <>
            <div className='headerLogin'>
            <div className='bemvindo'>
              <div className='TituloLogin'>
                Bem vindo ao <p className='CashwiseLogin'> CashWise</p>
              </div>
              <div className='SubtituloLogin'>
                <h2 className='h2Login'>Login</h2>

              </div>
            </div>
            <div className='chamadaRegistro'>
              <div>Não é registrado?</div>
              <Link className='LinkRegistrar' onClick={mostrarFormularioRegistro} to="/">Registre-se</Link>
            </div>
          </div>
          <div className='login'>

            <Form className='FormBox' onSubmit={handleSubmit}>
              <Form.Group as={Col} controlId="formGridStateEmail">
                <Form.Label>Insira seu endereço de Email</Form.Label>
                <Form.Control className='FormControlLogin' type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

              </Form.Group>
              <Form.Group as={Col} controlId="formGridStatePassword">
                <Form.Label className='FormLabelLogin'>Insira sua Senha</Form.Label>
                <Form.Control className='FormControlLogin' type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} />
                {error && <p>{error}</p>} {/* Mostra a mensagem de erro, se houver */}
              </Form.Group>
              <Button type='submit' variant="primary" className="btnLogin" size="sm">
                LOGIN
              </Button>
            </Form>
          </div>
          </>
          ) : (
          <>
          <div className='headerLogin'>
            <div className='bemvindo'>
              <div className='TituloLogin'>
                Bem vindo ao <p className='CashwiseLogin'> CashWise</p>
              </div>
              <div className='SubtituloLogin'>
                <h2 className='h2Login'>Registrar</h2>

              </div>
            </div>
            <div className='chamadaRegistro'>
              <div>Ja é registrado?</div>
              <Link className='LinkRegistrar' onClick={mostrarFormularioLogin} to="/">Entre</Link>
            </div>
          </div>
          <div className='login'>

            <Form className='FormBox' onSubmit={handleRegister}>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Insira seu Nome</Form.Label>
                <Form.Control className='FormControlLogin' type="text" placeholder="Nome" onChange={(e) => setName(e.target.value)} />

              </Form.Group>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label>Insira seu endereço de Email</Form.Label>
                <Form.Control className='FormControlLogin' type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />

              </Form.Group>
              <Form.Group as={Col} controlId="formGridState">
                <Form.Label className='FormLabelLogin'>Insira sua Senha</Form.Label>
                <Form.Control className='FormControlLogin' type="password" placeholder="Senha" onChange={(e) => setPassword(e.target.value)} />

              </Form.Group>
              <Button type='submit' variant="primary" className="btnLogin" size="sm">
                REGISTRAR
              </Button>
            </Form>
          </div>
          </>
      )}
          
          


        </div>
      </div>

    </div>


  );
}

export default Login;