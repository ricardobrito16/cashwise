import React, { useEffect, useState } from "react";
import "./index.css"
import { useCreateOrder } from "../../context/CreateOrderContext";
import { Button, Table } from "react-bootstrap";
import LogoNota from "../../assets/LOGONOTA.png"

const PedidoConfirmado = () => {
  const { name, setName,
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
    // cart, setCart,
    currentOrder, setCurrentOrder,
    filteredProducts,
    addToCart,
    placeOrder,
    calculateCartTotal,
    handlePlaceOrder,
    removeFromCart,
    abrirJanela,
    // abrirNovaJanela,
    handleUndo
  } = useCreateOrder()
  const [troco, setTroco] = useState(localStorage.getItem('troco') || '');
  const [valorRecebido, setValorRecebido] = useState(localStorage.getItem('valorRecebido') || '');
  const [selectedOption, setSelectedOption] = useState(localStorage.getItem('selectedOption') || '');
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
    //   setTimeout(() => {
    //     window.print();
    // }, 1000);
  }, []);
  const cartTotal = parseFloat(localStorage.getItem('cartTotal'));

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);

    const cleanup = () => {
      localStorage.removeItem('troco');
      localStorage.removeItem('valorRecebido');
      localStorage.removeItem('selectedOption');
      localStorage.removeItem('cartTotal');
      localStorage.removeItem('cart');
    }

    window.addEventListener('beforeunload', cleanup);

    return () => {
      window.removeEventListener('beforeunload', cleanup);
    }
  }, []);

  console.log(troco)
  // console.log("CUPOM"+cart)
  return (
    <div className="Cupom" >
      <div className="HeaderNota">
        <img src={LogoNota} alt="Logo" />
        <div className="InfoLoja" >
          <div className="desc" >CASHWISE</div>
          <div className="desc" >CNPJ: 99999999999999</div>
          <div className="desc">IE: 9999999999</div>
          <div className="descEndereço">Rua dos Programadores, 01 - Centro, Vale do Silício - EUA</div>
        </div>
      </div>
      <div className="detalhe" >DETALHE DE VENDA </div>

      <div className="ItensCarrinho">
        <table className="tablePersonalizada"  >

          <thead>
            <tr>

              <th>DESCRIÇÃO</th>
              <th>QTD UN</th>
              <th>VL UN</th>
              <th>VL TOTAL</th>
            </tr>
          </thead>


          {cart.map((product) => (
            <tbody key={product.id}>
              <tr  >
                <td>
                  <div>
                    <div  >{product.name}</div>
                    <div >{product.codigoBarras}</div>
                  </div>
                </td>

                <td  >{product.quantity}</td>
                <td  >R$ {new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(product.price)}</td>

                <td  > R${typeof product.total === 'number' ? new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(product.total) : new Intl.NumberFormat('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(product.total)}</td>
              </tr>
            </tbody>

          ))}

        </table>


      </div>
      <div className="totalCupom" >
      <Table   >

<thead className="campoNota">
  <tr>
    <th>Valor total do carrinho:</th>
    <th>R${cartTotal}</th>
  </tr>
</thead>
<thead className="campoNota">
  <tr>
    <th>Forma de Pagamento:</th>
    <th>{selectedOption}</th>
  </tr>
</thead>
{selectedOption === "dinheiro" ? (
  <>
    <thead className="campoNota">
      <tr>
        <th>Valor recebido em Dinheiro </th>
        <th>R${valorRecebido}</th>
      </tr>
    </thead>
    <thead className="campoNota">
      <tr>
        <th>Troco</th>
        <th>R${troco}</th>
      </tr>
    </thead>
  </>
) : (
  <thead className="campoNota">
    <tr>
      <th>Total do Cartão</th>
      <th>R${cartTotal}</th>
    </tr>
  </thead>
)}
</Table>
      </div>
      
    </div>
  )
};

export default PedidoConfirmado;
