import ReactDOMServer from 'react-dom/server';
import { format } from "date-fns";

import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, writeBatch, getFirestore, query, setDoc, updateDoc, where, FieldValue, increment } from "firebase/firestore";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { db } from '../config/firebase'
import { useUserAuth } from './UserAuthContext';

const createOrderContext = createContext();

export function CreateOrderContextProvider({ children }) {
    const {user} = useUserAuth();


    // State do Formulario de cadastro de produtos


    const [name, setName] = useState('');
    const [price, setPrice] = useState('');
    const [valorCompra, setValorCompra] = useState();
    const [quantidade, setQuantidade] = useState();
    const [categoria, setCategoria] = useState('');
    const [codigoBarras, setCodigoBarras] = useState();

    // Fim das State do Formulario de cadastro de produtos
    const [searchTerm, setSearchTerm] = useState("");
    const [lgShow, setLgShow] = useState(false);
    const [lgShowEdit, setLgShowEdit] = useState(false);
    const [show, setShow] = useState(false);
    const [fullscreen, setFullscreen] = useState(true);
    const [selectedOption, setSelectedOption] = useState('');

    function handleShow(breakpoint) {
        setFullscreen(breakpoint);
        setShow(true);
    }

    const handleClose = () => {
        setCart([]);

        setShow(false)
    };
     

    const [products, setProducts] = useState([]);
    const [quantity, setQuantity] = useState(0);
    const [editingProduct, setEditingProduct] = useState(null);
    const [cart, setCart] = useState([]);
    const [currentOrder, setCurrentOrder] = useState([]);
    const [cartItems, setCartItems] = useState([])


    const [valorRecebido, setValorRecebido] = useState(0);
    const [valorTotal, setValorTotal] = useState(0);
    const [troco, setTroco] = useState(0);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [showErrorAlert, setShowErrorAlert] = useState(false);



    const calcularTroco = () => {
        const troco = valorRecebido - valorTotal;
        setTroco(troco.toFixed(2));
        localStorage.setItem('troco', troco.toFixed(2));
        localStorage.setItem('valorRecebido', valorRecebido.toFixed(2));
    }
    useEffect(() => {
        calcularTroco();
    }, [valorRecebido]);

   
    const handleOptionChange = (e) => {
        const selectedOption = e.target.value;
        setSelectedOption(selectedOption);
        localStorage.setItem('selectedOption', selectedOption);
    }
    
    
    const filteredProducts = products.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
        || product.codigoBarras.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const prevCartRef = useRef([]);
    const handleUndo = () => {
        setCart(prevCartRef.current);
    };


    const addToCart = async (product) => {
        const productId = product.id;
        const productIndex = cart.findIndex((item) => item.id === productId);

        if (productIndex !== -1) {
            const updatedCart = [...cart];
            updatedCart[productIndex].quantity += 1;
            updatedCart[productIndex].total = updatedCart[productIndex].quantity * updatedCart[productIndex].price;
            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart)); 


        } else {
            const productWithQuantity = { ...product, quantity: 1, total: product.price };
            setCart([...cart, productWithQuantity]);
            localStorage.setItem("cart", JSON.stringify([...cart, productWithQuantity])); 


        }
    };

    const placeOrder = async () => {
        
        const cartCopy = [...cart];
    
        // atualizar a quantidade de estoque de cada produto no Firestore
        const batch = writeBatch(db);
        
        // const uid = user.uid; 
    
        cartCopy.forEach((cartItem) => {
            const uid = user.uid;

            const productRef = doc(db, "usuarios", uid, "products", cartItem.id);
            const currentQuantity = Number(cartItem.quantidade);
            const updatedQuantity = currentQuantity - cartItem.quantity;
            batch.update(productRef, { quantidade: updatedQuantity });
        });
        await batch.commit();
    
        
        setTimeout(() => {
            setCart([]);
            localStorage.removeItem("cart");
        }, 2000);
    
        
        const uid = user.uid
        const orderRef = collection(db, "usuarios", uid, "orders");
        const dataAtual = new Date();
        const dataFormatada = format(dataAtual, "dd/MM/yyyy");
        const mesAtual = dataAtual.getMonth(); // Obter o mês atual (de 0 a 11)
        const newOrder = {
            date: dataFormatada,
            month: mesAtual, 
            items: cartCopy,
            total: calculateCartTotal(),
            troco: troco,
            recebido: valorRecebido,
            pagamento: selectedOption
        };
        try {
            await addDoc(orderRef, newOrder);
            handleClose()
            setShowSuccessAlert(true);
        } catch (error) {
            setShowErrorAlert(true)
            console.error("Erro ao finalizar pedido:", error);
        }
    };

    
    const calculateCartTotal = () => {
        let total = 0;
      
        
        cart.forEach(product => {
          const price = parseFloat(product.price);
          const quantity = parseFloat(product.quantity);
          total += price * quantity;
        });
      
        const updatedTotal = total;
      
        setValorTotal(updatedTotal);
        localStorage.setItem('cartTotal', updatedTotal.toFixed(2));
      
        return updatedTotal;
      };

    
    const handlePlaceOrder = async () => {
        try {
            const orderId = await placeOrder(cart);



            //   setCart([]);


        } catch (error) {
            console.error("Erro ao enviar pedido:", error);
            alert("Não foi possível enviar o pedido. Tente novamente mais tarde.");
        }
    };



    const removeFromCart = (productId) => {
        const productIndex = cart.findIndex((item) => item.id === productId);

        if (productIndex !== -1) {
            const updatedCart = [...cart];
            if (updatedCart[productIndex].quantity === 1) {
                updatedCart.splice(productIndex, 1);
            } else {
                updatedCart[productIndex].quantity -= 1;
            }
            setCart(updatedCart);
            localStorage.setItem("cart", JSON.stringify(updatedCart)); // salva o carrinho atualizado no localStorage
        }
    };

    function abrirJanela() {
        const janela = window.open('/pedido-confirmado', 'minimalWindow', 'height=1000, width=1000');
      // janela.onafterprint = () => {
        //     janela.close();
        // }
        setTimeout(() => {
          janela.print();
        }, 2000);
      }

    

    useEffect(() => {
        
        const getProducts = async () => {
            
            try {
                
                if (user !== null && user.uid) {
                    const uid = user.uid;
                    const querySnapshot = await getDocs(collection(db, 'usuarios', uid, 'products'));
                    const productsList = [];
                    querySnapshot.forEach((doc) => {
                        productsList.push({ id: doc.id, ...doc.data() });
                    });
                    setProducts(productsList);
                }
            } catch (error) {
                console.error('Error retrieving products:', error);
            }
        };
    
        getProducts();
    }, [user]);

    return (
        <createOrderContext.Provider
            value={{
                name, setName,
                price, setPrice,
                valorCompra, setValorCompra,
                quantidade, setQuantidade,
                categoria, setCategoria,
                codigoBarras, setCodigoBarras,
                searchTerm, setSearchTerm,
                lgShow, setLgShow,
                lgShowEdit, setLgShowEdit,
                show, setShow,
                fullscreen, setFullscreen,
                handleShow,
                handleClose,
                products, setProducts,
                editingProduct, setEditingProduct,
                cart, setCart,
                currentOrder, setCurrentOrder,
                filteredProducts,
                addToCart,
                placeOrder,
                calculateCartTotal,
                handlePlaceOrder,
                removeFromCart,
                abrirJanela,
                // abrirNovaJanela,
                handleUndo,
                prevCartRef,
                quantity, setQuantity,
                // MaisUm,
                // MenosUm,
                setValorTotal,
                valorTotal,
                // totalPrice,
                selectedOption, setSelectedOption,
                valorRecebido, setValorRecebido,
                troco, setTroco,
                handleOptionChange,
                showSuccessAlert, setShowSuccessAlert,
                showErrorAlert, setShowErrorAlert,

            }}
        >
            {children}
        </createOrderContext.Provider>
    );
}

export function useCreateOrder() {
    return useContext(createOrderContext);
}
