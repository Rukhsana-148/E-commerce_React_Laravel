import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { StarRating } from './StarRating';

export const Products = ({ addToCart }) => {
    const [data, setData] = useState([]);
    const [selectedItem, setSelectedItem] = useState("");
    const [searchData, setSearchData] = useState([]);
    const [role, setRole] = useState(null);
    const [id, setId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 4; // Number of items per page
    const [averageRating, setAverageRating] = useState(null); // State to store average rating
    const [isNew, setIsNew] = useState(false);
   const [lastLoggedOutTime, setLastLoggedOutTime] = useState();
   const users = JSON.parse(localStorage.getItem("user"));

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
              result = result.map(product => {
                const createdTime = new Date(product.created_at);
                const isNew = createdTime > lastLogTime; // Directly calculate isNew
                 
                console.log("Is New:", isNew);
                console.log("Product created time:", createdTime);
                console.log("Last Logout time:", lastLogTime, "User:", users?.user?.id || users?.id);
      
                // Calculate average rating
                let avgRating = 0;
                if (product.rating && typeof product.rating === 'string') {
                  try {
                    const ratingsArray = JSON.parse(product.rating || "[]");
                    const numericRatings = ratingsArray.map(rating => parseInt(rating));
                    const total = numericRatings.reduce((sum, rating) => sum + rating, 0);
                    avgRating = numericRatings.length > 0 ? total / numericRatings.length : 0;
                  } catch (error) {
                    console.error("Error parsing ratings for product:", error);
                  }
                }
      
                return {
                  ...product,
                  isNew, // Attach the isNew property
                  averageRating: avgRating.toFixed(1),
                };
              });
      
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
      }, [users]); // Add 'users' as a dependency to avoid infinite loops
      
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

    // Pagination logic
    const filteredData = selectedItem
        ? data.filter(item => item.type === selectedItem)
        : searchData.length > 0
        ? searchData
        : data;

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
    const prevPage = () => setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));
//rating

    return (
        <div className='mt-[70px]'>
         {
  isNew ? <>  
    <div className="border-b-2 rounded-b-lg border-green-200 overflow-hidden">
     
      <div className="flex">
        {data.filter(item => item.isNew).length > 0 ? (
            
          <div className=" marquee-container flex">
          
            {data.filter(item => item.isNew).map(item => (
              <div key={item.id} className="px-4 text-right">
                 
                <Link to={`/detail/${item.id}`} className='no-underline'>
                
                  <img 
                    src={"http://127.0.0.1:8000/" + item.image} 
                    alt="product" 
                    className='w-[90px] h-[90px] -mt-2 mb-1' 
                  />
                </Link>
              </div>
            ))}
          </div>
        ) : (
          <p> </p>
        )}
      </div>
    </div>
  </> : <> </>
}


            
            <p className='text-center font-mono text-green-600 font-bold text-lg py-4'>Our Products</p>
            <div className="md:flex mx-2">
                {types.map((type, index) => (
                    <p
                        key={index}
                        className={`px-7 py-2  mr-5 rounded-lg ${selectedItem === type ? "bg-green-500 text-white" : "bg-gray-300"}`}
                        onClick={() => geType(type)}
                    >
                        {type}
                    </p>
                ))}
                <input
                    type='text'
                    placeholder='Search products'
                    name="search"
                    onChange={(e) => searchProduct(e.target.value)}
                    className='px-5 mb-3 py-2 border-2 rounded-lg border-green-600'
                />
            </div>

            <div className='md:grid md:grid-cols-4 gap-2 mx-2'>
                {currentItems.length > 0 ? (
                    currentItems.map((item) => (
                        <div key={item.id} className="card w-[300px] px-2 py-2 my-2">
                           {item.isNew && (
                                <span className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-lg">
                                    New
                                </span>
                            )}
                       

                        
                            <img src={"http://127.0.0.1:8000/" + item.image} alt="product" className='w-[200px] h-[160px]' />
                            {item.rating != '0' ? (
    <div className="average-rating pt-2 justify-items-center">
        <StarRating rating={item.averageRating} />
    </div>
) : (
    <p className='text-green-500'></p>
)}

                            <p className='font-semibold'>{item.name}</p>
                            <p className='font-semibold'>{item.price} TK</p>
                           {
                                users ? (
                                    <p onClick={() => addToCart(item)} className='px-5 py-2 rounded-md bg-blue-500 text-white'>
                                        Add To Cart
                                    </p>
                                ) : null
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
