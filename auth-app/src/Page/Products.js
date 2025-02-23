import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { StarRating } from './StarRating';
import * as motion from "motion/react-client"

import { Navbar, Nav, NavDropdown } from 'react-bootstrap';

export const Products = ({ addToCart }) => {
    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [searchDataPrice, setSearchpPrice] = useState([]);
    const [sortData, setSortData] = useState(data);
    const [role, setRole] = useState(null);
     const [found, setFound] = useState(null);
    const [id, setId] = useState(null);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // Number of items per page
    const [averageRating, setAverageRating] = useState(null); // State to store average rating
    const [isNew, setIsNew] = useState(false);
   const [lastLoggedOutTime, setLastLoggedOutTime] = useState();
  
   const [order, setOrder] = useState(null);
   const orderRef = useRef(order)
   const [sort, setSort] = useState('price');
   const users = JSON.parse(localStorage.getItem("user"));
   useEffect(() => {
    // Update refs whenever the order or sort state changes
    orderRef.current = order;
   
  }, [order]);
    useEffect(() => {
        if (users?.user) {
            setRole(users?.user?.role);
            setId(users?.user?.id);
        } else {
            setRole(users?.role);
            setId(users?.id);
        }
    }, []);
    console.log("Product User Id", id)
    
    useEffect(() => {
        return () => {
            setRole(null);
            setId(null);
        };
    }, []);

    console.log("User id", id);

    useEffect(() => {
        const fetchData = async () => {
          try {
            let result = await fetch("http://localhost:8000/api/products");
            result = await result.json();
            
            console.log("in the effect", users?.user?.id || users?.id);
            
            const lastLogTimeString = localStorage.getItem(`lastLoggedOut_${users?.user?.id || users?.id}`);
            const lastLogTime = lastLogTimeString ? new Date(lastLogTimeString) : null;
      
            if (lastLogTime && !isNaN(lastLogTime.getTime())) {
              setLastLoggedOutTime(lastLogTime); // Optional if you're using this elsewhere
      
              // Map through each product and calculate isNew and averageRating
              result = await Promise.all(result.map(async (product) => {
                const createdTime = new Date(product.created_at);
                const isNew = createdTime > lastLogTime; // Directly calculate isNew
                 
                console.log("Is New:", isNew);
                console.log("Product created time:", createdTime);
                console.log("Last Logout time:", lastLogTime, "User:", users?.user?.id || users?.id);
      
                 let resultcart = await fetch(`http://127.0.0.1:8000/api/isInCarts/${product?.id}/${users?.user?.id || users?.id}`)
                 resultcart = await resultcart.json();
                 
      
                return {
                  ...product,
                  isNew, // Attach the isNew property
                  found:resultcart?.exist,
                  cartId:resultcart?.cartId,
                };
              }));
      




              // Filter new products
              const newProducts = result.filter(product => product.isNew);

              if (newProducts.length > 0) {
                setIsNew(true)
                console.log("New products found:", newProducts);
              } else {
                console.log("No new products since last logout.");
              }
      
              setData(result); // Set the processed product list
            } else {
              console.log("No valid last logout time found. Showing all products.");
              setData(result); // Set all products if no valid last logout time
            }
          } catch (error) {
            console.error("Error fetching products:", error);
          }
        };
      
        fetchData();
      }, [users]); 


     

    // Filter products based on selected type
    const types = [...new Set(data.map(item => item.type))];

    const geType = (type) => {
        setSelectedItem(selectedItem === type ? "" : type);
        setCurrentPage(1); // Reset pagination when filtering
    };

    // Search products by keyword
    const searchProduct = async (key) => {
        if (!key) return;
        try {
            let result = await fetch(`http://localhost:8000/api/search/${key}`);
            result = await result.json();
            setSearchData(result);
            setCurrentPage(1); // Reset pagination on search
        } catch (error) {
            console.error("Error searching products:", error);
        }
    };
  
   const handlePrice = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
 
    try {
      const response = await fetch(`http://127.0.0.1:8000/api/searchPrice`, {
          method: 'POST',
          body: formData,
          headers: {
              "Accept": "application/json"
          }
      });

      if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      setSearchpPrice(result);
  } catch (error) {
      console.error("Error fetching price:", error);
  }
        
    };
  
  
      
console.log(searchDataPrice)

    


    // Pagination logic
    const filteredData = selectedItem
        ? data.filter(item => item.type === selectedItem)
        : searchData.length > 0
        ? searchData
        :sortData.length>0
        ?sortData
        :searchDataPrice.length>0
        ?searchDataPrice
        : data;

        const sortedData = [...filteredData].sort((a, b) => {
          if (order === 'Ascending') {
              return Number(a[sort]) - Number(b[sort]);
          } else if (order === 'Descending') {
              return Number(b[sort]) - Number(a[sort]);
          }
          return 0; // No sorting applied if order is not set
      });
    const totalPages = Math.ceil(sortedData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = sortedData.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
    const prevPage = () => setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
//sorting using price
/*useEffect(()=>{
  if(order){
    const storedItems = [...filteredData];
    if(order==='Ascending'){
      storedItems.sort((a, b)=>(Number(a[sort])-Number(b[sort])))
    }else if(order==='Descending'){
      storedItems.sort((a, b)=>(Number(b[sort])-Number(a[sort])))
    }
    setSortData(storedItems)
  }
   
}, [order, sort, filteredData])*/
  


const changeOrderField = (field)=>{
  setOrder(field);
}
    return (
        <div className='mt-[70px]'>
<div className="md:flex md:flex-wrap md:gap-4">
  {isNew && (
    <div className="border-b-2 rounded-b-lg  overflow-hidden flex-1">
      <div className="flex">
        {data.filter((item) => item.isNew).length > 0 ? (
          <div className="marquee-container flex">
            {data.filter((item) => item.isNew).map((item) => (
              <div key={item.id} className="px-4 text-right">
                <Link to={`/detail/${item.id}`} className="no-underline">
             
                  {item?.reason !== null && (
                    <>
                       <span className='px-2 absolute py-1 top-1 -ml-[30px] rounded-lg bg-green-500 text-white'>New</span>
                                        <span className="absolute   left-1  bg-rose-500 text-white text-xs font-bold px-4 py-2 rounded-lg">
                      {item?.reason}-{item?.amount}%
                   
                    </span>
                    
                    </>

                  )}
                  <img
                  
                  
                    src={"http://127.0.0.1:8000/" + item.image}
                    alt="product"
                    className="w-[130px] h-[120px] -mt-2 mb-1"
                  />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p></p>
        )}
      </div>
    </div>
  )}

  <div className="flex border-b-2 rounded-b-lg  overflow-hidden flex-1">
  <div className="flex space-6  marquee-container">
  {currentItems.map((item) => {
      if (item?.amount !== null) {
        return (
          <div key={item.id} className="px-4 text-right">
          
            <Link to={`/detail/${item.id}`} className="no-underline">
                <span className='absolute md:flex block -ml-[10px] bg-rose-600 text-white text-xs md:px-3  py-1 rounded-lg'>
                <span>{item?.reason}-</span>  
                <span>{item?.amount}%</span>  
                  </span>
               
              <img
                src={"http://127.0.0.1:8000/" + item.image}
                alt="product"
                className="md:w-[130px]  object-cover md:h-[120px] -mt-2 mb-1"
              />
            </Link>
          </div>
        );
      }
    })}
  </div>
   
  </div>

</div>

            
            <p className='text-center font-mono text-green-600 font-bold text-lg py-4'>Our Products</p>
            <div className="md:flex mx-2">
              <Nav className='text-black font-mono text-sm' style={{color:'green'}}>
                <NavDropdown 
                title={<span className='text-green-500'>Select Product Type</span>}
                 className='text-black'>
                {types.map((type, index) => (
                    <NavDropdown.Item className='hover:background-none' style={{backgroundColor:'transparent', color:'black'}}>
                      <p key={index}
                    className={`px-7 py-2  mr-5 rounded-lg ${selectedItem === type ? "bg-green-500 text-white" : "bg-gray-300"}`}
                    onClick={() => geType(type)}>
                             {type}
                             </p>

                    </NavDropdown.Item>
                       
                   
                ))}
                </NavDropdown>
              </Nav>
           {
            selectedItem&&<p onClick={()=>setSelectedItem(!selectedItem)} className='py-1 h-[36px] px-3 text-lg mx-2 rounded-lg bg-green-500 text-white'>{selectedItem}</p>

           }
       
                <input
                    type='text'
                    placeholder='Search products'
                    name="search"
                    onChange={(e) => searchProduct(e.target.value)}
                    className='px-5 mb-3 py-2 border-2 outline-green-800 rounded-lg border-green-400 w-[300px]'
                />

                <select name='order'
                onChange={(e)=>changeOrderField(e.target.value)}
                 className='px-3 py-2 border-2 text-sm h-[50px] border-green-500 rounded-lg mx-3 outline-green-500 text-green-600'>
               <option value="">Select Price Order</option>
                  <option value="Ascending">Ascending</option>
                  <option value="Descending">Descending</option>
                </select>
                <form className='lg:flex my-2' onSubmit={handlePrice}>
                <input
                required
                    type='number'
                    placeholder='Min Price'
                    name="min"
                    min={1}
                    onChange={(e) => setMin(e.target.value)}
                    className='px-1 mr-1 mb-3 w-[90px] text-sm py-2 border-2  text-black outline-green-800 rounded-lg border-green-400'
                />
                <input
                required

                    type='number'
                    placeholder='Max price'
                    name="max"
                    min={min}
                    onChange={(e) => setMax(e.target.value)}
                    className='px-1 mb-3 w-[90px] text-sm  py-2 border-2 text-black outline-green-800 rounded-lg border-green-400'
                />
                <input type='submit' name='submit' value='search' className='h-[40px] w-[100px] ml-2  text-xs rounded-md border-2 border-green-500'/>
                </form>
             
            </div>
   
            <div className='md:grid md:grid-cols-4 gap-2 mx-2'>
              
              {currentItems.length > 0 ? (
                  currentItems.map((item) => (
                      <div key={item.id} className="card w-[300px] px-3 py-3 my-2">
                          <div className="flex justify-between">
                          {item.isNew && (
                              <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                                  New
                              </span>
                          )}
                     
                      {
                          (item?.reason!==null)&& (
                              <span className="absolute top-2 right-0 bg-rose-500 text-white text-sm font-bold px-4 py-2 rounded-lg">
                              {item?.reason} OFFER- {item?.amount}%
                          </span>
                          )
                      }
                          </div>
                       
                      
                          <motion.img
                           whileHover={{ scale: 1.2 }}
                           whileTap={{ scale: 0.95 }}
                           onHoverStart={() => console.log('hover started!')}
                           src={"http://127.0.0.1:8000/" + item.image}
                           alt="product" className='w-[200px] h-[160px] p-2' />
                         
                           
                      

                          <p className='font-semibold'>{item.name}</p>
                          <div className="h-[70px]">
                          {
                          (item?.reason!==null)?(
                              <span className="font-semibold text-rose-700 mb-1">
                                   <p className='font-semibold line-through'>{item.price} TK</p>
                             Discount Price :  
                              {
                                  ((100-item?.amount)*item?.price)/100
                              } TK
                          </span>
                          ):<>   <p className='font-semibold'>{item.price} TK</p></>
                      }

                      </div>
                        {
                          item?.found?<><Link className='no-underline' to={`/allCart/cart/${item?.cartId}`}>
                                                       <p className='px-5 py-2 mb-3 rounded-md bg-pink-500 text-white' >
                                                       My Cart Item
                                                       </p>
                                                       
                                                         </Link></>:<>{
                              users ? (
                                  <p onClick={() => addToCart(item)} className='px-5 py-2 rounded-md bg-blue-500 text-white'>
                                      Add To Cart
                                  </p>
                              ) : null
                          }</>
                        }
                         
                          <Link to={`/detail/${item.id}`} className='no-underline'>
                              <p className='no-underline rounded-md py-1 bg-black text-white'>Detail</p>
                          </Link>
                      </div>
                  ))
              ) : (
                  <p>No products found.</p>
              )}
          
                
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-center my-5 ">
                <button onClick={prevPage} disabled={currentPage === 1} className="px-3 py-2 text-white mx-2 bg-green-700 rounded-lg">
                    Previous
                </button>
                <span className="px-4 py-2 text-green-900">{currentPage}/{totalPages}</span>
                <button onClick={nextPage} disabled={currentPage >= totalPages} className="px-3 text-white py-2 mx-2 bg-green-700 rounded-lg">
                    Next
                </button>
            </div>

          
        </div>
    );
};
