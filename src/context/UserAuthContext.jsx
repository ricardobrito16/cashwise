import { createContext, useContext, useEffect, useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { auth, db } from "../config/firebase";
import { collection, doc, getDoc, getDocs, setDoc } from "firebase/firestore";
import { addDays, format, parse } from "date-fns";
import axios from "axios";
const userAuthContext = createContext();

export function UserAuthContextProvider({ children }) {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")

  const [userEmail, setUserEmail] = useState('');
  const [userUid, setUserUid] = useState('');

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentuser) => {

      setUser(currentuser);
      localStorage.setItem('user', JSON.stringify(currentuser));
    });

    return () => {
      unsubscribe();
    };
  }, []);

  function logIn(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
  }

  function sendUserData() {
    const email = user.email;
    const uid = user.uid;

    axios
      .post("/save-user-data", {
        email: email,
        uid: uid,
        
      })
      .then((response) => {

        console.log(response.data.message);
      })
      .catch((error) => {
       
        console.log(error);
      });
  }

  const [validadeAssinatura, setValidadeAssinatura] = useState(
    localStorage.getItem("validadeAssinatura") || ""
  );
  const dataAtual = new Date();
  const dataFormatada = format(dataAtual, "dd/MM/yyyy");
  const validadeAssinaturaParse = parse(validadeAssinatura, 'dd/MM/yyyy', new Date());

  // Verifica se a diferença é igual ou inferior a 5 dias

  const testeGratis = addDays(dataAtual, 7);
  const testeGratisFormatada = format(testeGratis, "dd/MM/yyyy");

  const [nivelDeAcesso, setNivelDeAcesso] = useState(
    localStorage.getItem("nivelDeAcesso") || ""
  );
  const [statusAssinatura, setStatusAssinatura] = useState(
    localStorage.getItem("statusAssinatura") || ""
  );

  const [assinaturaExpirada, setAssinaturaExpirada] = useState(
    localStorage.getItem("assinaturaExpirada") || false
  );
  // console.log("assinaturaExpirada =>" + assinaturaExpirada)
  useEffect(() => {

    if (dataAtual < validadeAssinaturaParse) {
      setAssinaturaExpirada(false);
    } else {
      setAssinaturaExpirada(true);
    }
    localStorage.setItem("assinaturaExpirada", assinaturaExpirada);
  }, [dataFormatada, validadeAssinatura]);


  // console.log("Nivel de Acesso =>" + nivelDeAcesso)
  // console.log("Status da Assinatura =>" + statusAssinatura)
  // console.log("Validade da Assinatura =>" + validadeAssinatura)
  const [usuarioAtual, setUsuarioAtual] = useState("")
  const getUsuarios = async () => {
    try {
      if (user && user.uid) { 
        const userDocRef = doc(db, "usuarios", user.uid); 
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
          const novoNivelDeAcesso = userDocSnapshot.data().nivelAcesso;
          const novoStatusAssinatura = userDocSnapshot.data().status;
          const novoValidadeAssinatura = userDocSnapshot.data().validade;
          setUsuarioAtual(userDocSnapshot.data())
          setNivelDeAcesso(novoNivelDeAcesso);
          setStatusAssinatura(novoStatusAssinatura);
          setValidadeAssinatura(novoValidadeAssinatura);
          localStorage.setItem("nivelDeAcesso", novoNivelDeAcesso);
          localStorage.setItem("statusAssinatura", novoStatusAssinatura);
          localStorage.setItem("validadeAssinatura", novoValidadeAssinatura);
        } else {
          console.log("Usuário não encontrado");
        }
      } else {
        console.log("Usuário não está definido ou não possui UID");
      }
    } catch (error) {
      console.error("Erro ao obter os usuários:", error);
    }
  };

  useEffect(() => {
    if (user) {
      getUsuarios();
    }
  }, [user]);
  
  async function signUp(email, password, nivelAcesso, status, validade,) {
    try {
     
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

     
      const userId = user.uid;

      
      const userDocRef = doc(db, "usuarios", userId);
      await setDoc(userDocRef, {
        nome: name,
        nivelAcesso: "Usuario",
        status: "ativo",
        dataRegistro: dataFormatada,
        validade: testeGratisFormatada,
        email: email,
      });

      console.log("Usuário criado com sucesso e informações adicionais salvas no Firestore.");
    } catch (error) {
      console.error("Erro ao criar usuário e salvar informações adicionais:", error);
    }
  }
  function logOut() {
    return signOut(auth);
  }
  function googleSignIn() {
    const googleAuthProvider = new GoogleAuthProvider();
    return signInWithPopup(auth, googleAuthProvider);
  }




  return (
    <userAuthContext.Provider
      value={{
        sendUserData, usuarioAtual,
        name, nivelDeAcesso,
        statusAssinatura,
        validadeAssinatura, assinaturaExpirada,
        validadeAssinaturaParse,
        setName, password, setPassword, email, setEmail, user, logIn, signUp, logOut, googleSignIn
      }}
    >
      {children}
    </userAuthContext.Provider>
  );
}

export function useUserAuth() {
  return useContext(userAuthContext);
}
