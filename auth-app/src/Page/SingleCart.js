import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export const SingleCart = ({cartCount}) => {
  const [cart, setCart] = useState(null);
  const [items, setItems] = useState([]);
  const [quantity, setQuantity] = useState(1); // Default to 1
  const [productId, setProductId] = useState(null);
  const [cartId, setCartID] = useState();
  const [limit, setLimit] = useState();
  const [price, setPrice] = useState(0);
  const [remain, setRemain] = useState(0);
  const [user_id, setUserId]= useState(null);

  const { id } = useParams();
  const users = JSON.parse(localStorage.getItem('user'));
  
useEffect(()=>{
  if(users?.user){
    setUserId(users?.user?.id)
 }else{
   setUserId(users?.id)
 }
}, [users])

 useEffect(() => {
        const fetchdata = async () => {
            if (user_id) {
                let result = await fetch(`http://127.0.0.1:8000/api/allCart/${user_id}`);
                result = await result.json();
                setItems(result||[]);
                //setStatus((result.length||[]) > 0);
            }
        };
        fetchdata();
    }, [user_id]);


  useEffect(() => {
    const fetchData = async () => {
      try {
        let result = await fetch(`http://localhost:8000/api/cart/${id}`);
        result = await result.json();
        const cartData = result[0];

        setCart(cartData);
        console.log("cart Data", cartData.products)
        setLimit(cartData?.products?.quantity);
        console.log("Quantity", cartData.products.quantity)
        setCartID(cartData?.id);
        setProductId(cartData?.products?.id);
        console.log("Wrong", cartData?.products?.quantity)
        setPrice(cartData?.products?.price||0);
      
      } catch (error) {
        console.error('Error fetching cart:', error);
      }
    };
    fetchData();
  }, [id]);

console.log("Price", price)

  if (!cart) {
    return <div>Loading...</div>;
  }

  const cartIn = () => {
console.log(limit)
      setQuantity((prevQuantity) =>
       {
        if(prevQuantity<limit){
            const total = prevQuantity+1;
            
            setRemain(limit-total)
            
          return prevQuantity+1;
        }else{
          Swal.fire({
            title: "Empty Stuck!",
            icon: "error",
            draggable: true,
            text: "There are no more products!",
          });
          return prevQuantity;
        }
       }
    
    );
    
    
  };
console.log("remain", remain)
  const cartDe = () => {
    setQuantity((prevQuantity) => {
        const newQuantity = prevQuantity > 1 ? prevQuantity - 1 : 1;
        
        setRemain(limit-newQuantity);
        return newQuantity;
    });
  };

  const orderNow = async (e) => {
    e.preventDefault();

    // Prepare data as a JSON object
    const orderData = {
      cartId,
      user_id,
      product_id: productId,
      quantity,
      remain,
      price: quantity * price
    };

    console.log("Order data",orderData); // Log data to check

    try {
      let result = await fetch('http://localhost:8000/api/sellProduct', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // Set the header for JSON
        },
        body: JSON.stringify(orderData), // Send the data as JSON
      });
console.log(orderData)

setItems(prevProducts => {
  const updateItems =   prevProducts.filter(product => product.id !== cartId);
    cartCount(updateItems.length)
    console.log("After Order", updateItems.length)
    return updateItems;
})
      const textResponse = await result.json(); // Read the response as text
      console.log(textResponse); 
       Swal.fire({
                     title: "Order is Confirmed!",
                     icon: "success",
                     draggable: true,
                     text: "Order is Successfully Placed!",
                   });
    } catch (error) {
      console.error('Error placing order:', error);
      Swal.fire({
        title: 'Error!',
        icon: 'error',
        text: 'Failed to place the order.',
      });
    }
  };

  return (
    <div className="flex justify-center items-center px-4 rounded-lg py-4 w-[500px] mt-[90px] border-2 border-green-800 mx-auto">
    <div className="flex justify-center items-center mx-4 my-3">
      <img src={`http://127.0.0.1:8000/${cart?.products?.image}`} alt="Product" className='w-[75] h-[75]'/>
    </div>
    <div className="border-l-2 border-green-500 px-1">
      <p>{cart?.products?.name}</p>
      <p>{cart?.products?.price} /=</p>
      <p>Total: {quantity * price} /=</p>
  
      {cart?.products?.quantity > 0 ? (
        <>
          <div className="flex gap-2 justify-center">
            <button type="button" onClick={cartIn} className="px-2 py-1 bg-green-500 text-white rounded">
              +
            </button>
            <span>{quantity}</span>
            <button type="button" onClick={cartDe} className="px-2 py-1 bg-red-500 text-white rounded">
              -
            </button>
          </div>
          <form onSubmit={orderNow} className="mt-4 flex justify-center">
            <button type="submit" className="px-5 w-[180px] py-1 rounded-lg bg-green-400 text-black text-sm">
              Order Now
            </button>
          </form>
        </>
      ) : (
        <p className="text-center text-red-500 text-lg">No Products</p>
      )}
    </div>
  </div>
  
  );
};