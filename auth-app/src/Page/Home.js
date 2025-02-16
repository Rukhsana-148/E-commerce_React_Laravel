import React, { useEffect, useState } from 'react'
import { Products } from './Products'
import Swal from 'sweetalert2';

export const Home = ({mainPage}) => {
  const [product, setProduct] = useState([]);
  const [cart, setCart] = useState(0);
  const[profile, setProfile] = useState(null);
  const [user_id, setId] = useState(null);

 
   useEffect(() => {
           // Don't fetch until id is available
  
          const fetchData = async () => {
              try {
                  let result = await fetch("http://localhost:8000/api/products");
                  result = await result.json();
  
               //   const lastLogTime = new Date(localStorage.getItem(`lastLoggedOut_${user_id}`));
  
               
                     // const newProducts = result.filter(product => product.isNew);
  
                     
                      setProduct(result); // Set filtered products with isNew
                  } 
              catch (error) {
                  console.error("Error fetching products:", error);
              }
          };
  
          fetchData();
      }, [user_id]); // Dependency on 'id' to ensure it's available before fetching
  
      
  const users = JSON.parse(localStorage.getItem("user"));
  console.log("After login", users)

 useEffect(()=>{
   if(users?.user){
    setId(users?.user?.id)
   
  }else{
    setId(users?.id)
   
  }
 }, [users])
console.log("Profile", profile)

     useEffect(()=>{
      if(users||users?.user){
     
        console.log("cart user_id", user_id)
            const fetchData = async ()=>{
              let result = await fetch(`http://localhost:8000/api/totalCart/${user_id}`);
              result  = await result.json();
              setCart(result)
              mainPage(result)
              console.log("Number of Cart", result)
            }
            fetchData();
      }else{
        console.log("cart not found")
      }
     
        }, [users])

console.log("Cart outside", cart)


const handleCart = async (product) => {
 
  const product_id = product.id;

  const data = {
    user_id: user_id,
    product_id: product_id
  };

  try {
    // Send the request to add to cart
    const response = await fetch('http://localhost:8000/api/addCart', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const result = await response.json();
console.log("Response in the Home", result)
    if (response.ok) {
      // Update cart count from API response
      setCart(result);
      mainPage(result);
console.log("Total Cart", result)
      // Show success message
      Swal.fire({
        title: "Product Added To Cart!",
        icon: "success",
        text: "Product has been added to your cart!",
        timer: 2000,
        showConfirmButton: false
      });
    } else {
      // Show an error message if the product is already in the cart
      Swal.fire({
        title: "Product Already in Cart",
        icon: "warning",
        text: result.message || "You have already added this product to your cart.",
      });
    }
  } catch (error) {
    console.error("Error adding to cart:", error);
    Swal.fire({
      title: "Product Already in Cart",
      icon: "warning",
      text: "You have already added this product to your cart!",
    });
  }
};

  return (
    <div>
      <Products addToCart={handleCart}></Products>
    </div>
  )
}
