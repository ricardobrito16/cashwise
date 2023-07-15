import { MdLogout, MdSearch } from "react-icons/md";
import "./styles/header.css"
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserAuth } from "../context/UserAuthContext";
import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Popover from 'react-bootstrap/Popover';
function Header() {

    const [error, setError] = useState("");
    const { logIn, logOut, googleSignIn, password, setPassword, email, setEmail, usuarioAtual } = useUserAuth();
    const navigate = useNavigate();
const nome = usuarioAtual.nome;
    // const popover = (
    //     <Popover id="popover-basic">
    //         <Popover.Header as="h3">Popover right</Popover.Header>
    //         <Popover.Body>
    //             And here's some <strong>amazing</strong> content. It's very engaging.
    //             right?
    //         </Popover.Body>
    //     </Popover>
    // );
    // <OverlayTrigger trigger="click" placement="right" overlay={popover}>

    // </OverlayTrigger>


    return (
        <div className="HeaderContainer">
            <div className='search-container'>
                <div className='search'>
                    <form>
                        <p><MdSearch /></p>
                        <input className="placeholder-text" type='text' placeholder='Pesquisar' />

                    </form>
                </div>
                <div className='user-container'>
               

                  
                    <div className='username'>
                        <h3 className="h3Personalizado">{nome}</h3>
                        <div alt="Sair" className="sair" onClick={logOut} >
                            <p className="hpPersonalizado">Sair</p><MdLogout className='iconBtn' />
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
}

export default Header;