import React, { useEffect, useState } from 'react'
import { Products } from './Products'
import Swal from 'sweetalert2';

import { BarChart, Bar, XAxis, YAxis,Line, AreaChart, Area, Tooltip, PieChart, Pie, Cell, Legend, LabelList, ResponsiveContainer, LineChart } from 'recharts';


export const Home = ({mainPage}) => {
 
  const [product, setProduct] = useState([]);
  const [cart, setCart] = useState(0);
  const[profile, setProfile] = useState(null);
  const [user_id, setId] = useState(null);
   const[userRole, setRole] = useState();
const[data, setData] = useState([]);
const [sum, setSum] = useState(0);
const [price, setPrice] = useState(0);
const [products, setProducts] = useState([])
const [totalRemain, setTotalRemain] = useState(0);
const [item, setItem] = useState(0);
const [salesTime, setSelesTime] = useState([])

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
    setRole(users?.user?.role)
   
  }else{
    setId(users?.id)
    setRole(users?.role)
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
 useEffect(()=>{

  const fetchData = async ()=>{
   let result = await fetch(`http://localhost:8000/api/getTotalSellOwner/${user_id}`);
   result = await result.json();
   setData(result);
   let totalQuantity = 0;
   let totalMoney = 0;
  result.forEach((item)=>{
 totalQuantity+=parseInt(item.totalQuantity, 10);
 totalMoney+=parseInt(item.totalPrice, 10);
  })

  setSum(totalQuantity)
  setPrice(totalMoney)
  }
  fetchData();
 
 }, [user_id])

useEffect(()=>{
  const fetchData = async ()=>{
    let result = await fetch(`http://localhost:8000/api/getTotalOwnProduct/${user_id}`);
    result = await result.json();
   
    result.forEach((item)=>{
      setTotalRemain(item.totalQuantity)
    })
   
   }
   fetchData();
}, [user_id])


 useEffect(() => {
    const fetchData = async () => {
      let result = await fetch(`http://localhost:8000/api/inventory/${user_id}`);
      result = await result.json();
 
       
      const updateProducts = Object.entries(result).map(([key, item])=>({
           ...item,
           zero:item?.quantity===0,
          
      }));
      setProducts(updateProducts);
      setItem(result.length);
    };
    fetchData();
  }, [user_id]);  // Run when the `id` changes

const chartProduct = products.map(item=>({
  name : item.name,
  quantity: item.quantity
}))


useEffect(()=>{
  const fetchData = async ()=>{
    let result = await fetch(`http://localhost:8000/api/getSalesWithTime/${user_id}`);
    result =  await result.json();
   console.log(result)
   setSelesTime(result)
  }
  fetchData();
})
const chartTimeSales = salesTime.map(item=>({
  date : item.time,
  price : item.price
}))
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#8dd1e1', '#d0ed57'];

const chartData = [
  { name: 'Total Sold Product Quantity', value: sum}, 
  
]
const chartPrice = [
  { name: 'Total Income (Tk)', value: price}, 
  
]

const chartRemain = [
  { name: 'Total Products in the Stock', value: totalRemain}, 
  
]
const chartItem = [
  { name: 'Total Product Items', value: item}, 
  
]
  return (
    <div>
      {
       userRole=='admin'? (
       <div className='lg:ml-[140px] bg-rose-100 mt-[70px] text-rose-500 justify-center items-center'>
       
      <div className="pt-7 md:grid md:grid-cols-3 md:gap-1">
        <BarChart height={200} width={270} data={chartData}>
         <XAxis dataKey="name"
         tick = {{fontSize:16, fontWeight:'semibold', fontFamily:'mono', color:'black'}}
         height={30}
         />
         <YAxis
         domain={[0,100]}
         tick={{fontSize:12}}
         width={30}

         />
         <Tooltip />
         <Legend/>
         <Bar dataKey="value" fill='#76a5af' barSize={50}>
        
         </Bar>
        </BarChart>

        <BarChart height={200} width={270} data={salesTime}>
        <XAxis 
          dataKey="time" 
          tick={{ fontSize: 12, fontWeight: 'bold'}} 
          
        />
        <YAxis 
          domain={[0,5000]}
          tick={{ fontSize: 12 }} 
          label={{ value: 'TK', angle: -90, position: 'insideLeft' }} 
        />
        <Tooltip />
        <Legend />
        <Bar dataKey="price" fill="#5178af" barSize={30} />
      </BarChart>
       
        <BarChart height={200} width={240} data={chartPrice}>
         <XAxis dataKey="name"
         tick = {{fontSize:15, fontWeight:'semibold', fontFamily:'mono', color:'black'}}
         height={30}
         />
         <YAxis
         domain={[0,10000]}
         tick={{fontSize:12}}
        
         label={{ value: 'TK' , angle: -90, position: 'insideLeft' }} 
         />
         <Tooltip />
         <Legend/>
         <Bar dataKey="value" fill='#53a992' barSize={50}>
        
         </Bar>
        </BarChart>

      
        <BarChart height={200} width={270} data={chartRemain}>
         <XAxis dataKey="name"
         tick = {{fontSize:16, fontWeight:'semibold', color:'black'}}/>
         <YAxis domain={[0, 100]}/>
         <Tooltip/>
         <Legend/>
         <Bar dataKey="value" fill='#af5178' barSize={30} >
         
            </Bar>
        </BarChart>
        
        <BarChart height={200} width={270} data={chartItem}>
         <XAxis dataKey="name"
         tick = {{fontSize:16, fontWeight:'semibold', color:'black'}}/>
         <YAxis domain={[0, 10]} />
         <Tooltip/>
         <Legend/>
         <Bar dataKey="value" fill='#2b3746' barSize={30} >
            </Bar>
        </BarChart>


    

        <ResponsiveContainer width={100} height={320}>
      <PieChart>
        <Legend />
        <Tooltip />
        <Pie
          data={chartProduct}
          dataKey="quantity"
          nameKey="name"
          cx="50%"
          cy="50%"
          outerRadius={50}
         
          label
         
        >
         {chartProduct.map((entry, index) => (
        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
      ))}
      </Pie>
      </PieChart>
    </ResponsiveContainer>
      </div>
       </div>
      


       ):  <Products addToCart={handleCart}></Products>
      }
    
    </div>
  )
}
