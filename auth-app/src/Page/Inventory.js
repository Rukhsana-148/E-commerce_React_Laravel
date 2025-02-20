import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export const Inventory = () => {
  const [products, setProducts] = useState([]);
  const [quant, setQuant] = useState(0);
  const [salesData, setSalesData] = useState({});
  const [totalItems, setTotalItems] = useState(0);
  const [totalSold, setTotalSold] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [empty, setEmpty] = useState(false)
  const { id } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      let result = await fetch(`http://localhost:8000/api/inventory/${id}`);
      result = await result.json();
 
       
      const updateProducts = Object.entries(result).map(([key, item])=>({
           ...item,
           zero:item?.quantity===0,
          
      }));
      setProducts(updateProducts);
      setTotalItems(result.length);
     
      // Fetch sales data for each product
      result.forEach(product => {
        fetchSalesData(product.id);
        
      });
    };
    fetchData();
  }, [id]);  // Run when the `id` changes

  const fetchSalesData = async (productId) => {
    let response = await fetch(`http://localhost:8000/api/getTotalSell/${productId}`);
    let data = await response.json();

    const totalQuantitySold = data.totalQuantity || 0; // default to 0 if undefined or null
    const totalPrice = data.totalPrice || 0; // default to 0 if undefined or null

    // Update the salesData state for the specific product
    setSalesData((prevSalesData) => {
      const updatedSalesData = {
        ...prevSalesData,
        [productId]: {
          totalQuantitySold,
          totalPrice,
        },
      };

      // Calculate overall totals for all products
      const totalSold = Object.values(updatedSalesData).reduce((total, productSales) => {
        return total + (parseFloat(productSales.totalQuantitySold) || 0); // Ensure numeric addition
      }, 0);
      
      const totalRevenue = Object.values(updatedSalesData).reduce((total, productSales) => {
        return total + (parseFloat(productSales.totalPrice) || 0); // Ensure numeric addition
      }, 0);
      
      // Update the state with new totals
      setTotalSold(totalSold);
      setTotalRevenue(totalRevenue);

      return updatedSalesData;
    });
  };

  const remove = async (productId) => {
    await fetch(`http://127.0.0.1:8000/api/delete/${productId}`, { method: 'GET' });
    setProducts((prevProducts) => prevProducts.filter((product) => product.id !== productId));
    Swal.fire({
      title: "Product is removed",
      icon: "success",
      text: "Product has been removed from your product lists",
    });
  };

  const increaseQuant = async (e, productId) => {
    e.preventDefault();
    const data = { id: productId, quantity: quant };
    let result = await fetch('http://localhost:8000/api/increaseQuant', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    const textResponse = await result.json();
    console.log(textResponse);
    if(result.ok){
      
      Swal.fire({
        title: "Quantity is Increased!",
        icon: "success",
        text: `${quant} is added to the list`,
      });

      setProducts((prevProducts)=>
        prevProducts.map((product)=>

        product.id == productId ? {...product, quantity:(product.quantity||0)+parseInt(quant, 10)}
        :product
        )
      )
    }
   
  };

  return (
    <div className=' mt-[70px] bg-rose-100'>
      <p className='py-7 text-2xl font-mono font-semibold text-rose-700'>Inventory Management</p>

      {totalItems !== 0 ? (
        <>
          <p className='font-mono text-md  px-5 text-rose-500'>
            Total Items: <span className='font-bold '>{totalItems}</span>
          </p>
          <p className='font-mono text-md px-5 text-rose-500'>
            Total Sold Items: <span className='font-bold'>{totalSold}</span>
          </p>
          <p className='font-mono text-md px-5  text-rose-500'>
            Total Revenue: <span className='font-bold'>{totalRevenue} TK</span>
          </p>

          <div className="md:grid md:grid-cols-3 gap-2 px-3 py-5 lg:ml-[150px]">
            {products.map((item) => {
              const sales = salesData[item.id] || { totalQuantitySold: 0, totalPrice: 0 };
              return (
                <div className='border-2 md:w-[350px] ml-2 border-rose-400 rounded-md px-2 py-2' key={item.id}>
                  <div className="h-[290px] justify-items-center shadow-b-lg">
                  {
                            (item?.reason!==null)&& (
                                <span className="flex px-3 py-1 w-[150px] absolute font-mono rounded-lg bg-rose-500 text-white">
                                {item?.reason} OFFER- {item?.amount}%
                            </span>
                            )
                        }
                    <img width="200px" className="pt-3" src={`http://127.0.0.1:8000/${item?.image}`} alt={item?.name} />
                 
                  </div>

                  <div className="h-[490px] pb-2 overflow-hidden">
                    <p className='font-bold text-xl'>{item.name}</p>
                    <p className='font-normal text-sm'>{item.description}</p>
                    {
                            (item?.reason!==null)?(
                                <span className="font-semibold  mb-1 ">
                                     <p className='font-semibold   '>Product Price:<span className='line-through'>{item?.price} TK</span></p>
                               <p className='text-rose-500'>Discount Price :  
                                {
                                    ((100-item?.amount)*item?.price)/100
                                } TK
                                </p>
                            </span>
                            ):<>   <p className='font-semibold'>Product Price: {item?.price} TK</p></>
                        }
                          
                    {sales.totalQuantitySold > 0 ? (
                      <>
                        <p className=''>Total Sold: {sales.totalQuantitySold}</p>
                        <p className=''>Total Revenue: {sales.totalPrice}</p>
                      </>
                    ) : (
                      <p className='font-bold text-md text-center'>No Product is sold yet!</p>
                    )}

                
                        
                        {
                         item?.quantity===0 ? <><p className='sm text-green-500 font-semibold my-2 text-center'>
                         
                         {quant} items will be added
                       </p>  <form onSubmit={(e) => increaseQuant(e, item.id)} className="my-2">
                         <input
                           type='number'
                           min="1"
                           onChange={(e) => setQuant(e.target.value)}
                           placeholder='Increase product quantity'
                           className='border-2 border-solid-gray-600 text-black rounded-lg px-3 py-3 my-2'
                         />
                         <button type="submit" className='px-5 w-[250px] py-2 rounded-lg bg-black text-white text-sm'>
                           Increase Quantity
                         </button>
                       </form> </>:<p>Quantity: {item.quantity||quant}</p>
                        }
                        
                     
                  </div>

                  <div className="md:flex justify-items-center">
                    <p onClick={() => remove(item.id)} className='mx-1 w-[100px] px-2 text-sm py-2 rounded-lg text-white bg-red-500'>
                      Remove
                    </p>
                    <Link to={`/updateProduct/${item.id}`} className='no-underline'>
                      <p className='w-[100px] px-2 text-sm py-2 rounded-lg text-white bg-cyan-500'>
                        Update
                      </p>
                    </Link>
                    <Link className='no-underline'
                   
                        to={`/discount/${item?.id}`}
                      >
                        <p className='w-[100px] px-2 text-sm ml-1 py-2 rounded-lg text-white bg-rose-500'>Discount</p>
                        
                      </Link>
                  </div>
                  <Link to={`/detail/${item.id}`} className='no-underline'>
                    <p className='no-underline rounded-md py-1 bg-black text-white'>
                      Detail
                    </p>
                  </Link>
                </div>
              );
            })}
          </div>
        </>
      ) : null}
    </div>
  );
};
