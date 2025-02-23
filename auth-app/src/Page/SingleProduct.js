import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { StarRating } from './StarRating';
import { FaUser } from 'react-icons/fa'
import * as motion from "motion/react-client";
import { Link } from 'react-router-dom';
export const SingleProduct = ({addToCart}) => {

    const [item, setItems]= useState(null);
    const [cmntData, setCmntData] = useState();
    const {productId} = useParams();
    const [role, setRole] = useState(null);
    const [user_id, setUserId] = useState(null);
    const [found, setFound] = useState(null);
    const [averageRating, setAverageRating] = useState(null); 
    const [cartId, setCartID] = useState(null);
     const users = JSON.parse(localStorage.getItem("user"));
     
     useEffect(()=>{
      if(users?.user){
        setRole(users?.user?.role)
        setUserId(users?.user?.id)
      }else{
        setRole(users?.role)
        setUserId(users?.id)
      }
     }, [users])

   useEffect(()=>{
    console.log("Id",productId)
   const fetchdata = async()=>{
       let result = await fetch(`http://localhost:8000/api/getProduct/${productId}`)
        result =  await result.json()
        setItems(result)
        setCmntData(result.comment||"")
   }
   fetchdata();
   },[productId])
   let comments = [];
   if(cmntData){
     try{
   comments = JSON.parse(cmntData);
     }catch(e){
   comments = [{comment: cmntData}];
     }
   }
 useEffect(()=>{
  const fetchData = async ()=>{
    let result = await fetch(`http://127.0.0.1:8000/api/isInCarts/${productId}/${user_id}`)
    result = await result.json();
    setFound(result.exist)
    setCartID(result.cartId);
  }
  fetchData();
 }, [productId, user_id])

useEffect(() => {
   
    if (item?.rating && typeof item?.rating === 'string') {
      try {
        const ratingsArray = JSON.parse(item?.rating);
        console.log("Rating", ratingsArray);

        const numericRatings = ratingsArray.map(rating => parseInt(rating));
        const total = numericRatings.reduce((sum, rating) => sum + rating, 0);
        console.log("Total:", total);

        // Calculate and update average rating
        const avgRating = numericRatings.length > 0 ? total / numericRatings.length : 0;
        setAverageRating(avgRating.toFixed(1));  // Round to 1 decimal and update state
      } catch (error) {
        console.error("Error parsing ratings:", error);
      }
    } else {
      console.log("No valid ratings data available.");
    }
  }, [item?.rating]); // Dependency array ensures this runs when item.rating changes
  return (
    <div className={` ${role==='admin'?"mt-[70px] ":"mt-[100px] "} md:flex mb-[20px] justify-center items-center`}>
     

 <div key={item?.id} className={`px-2 mt-[50px] py-1 rounded-md border-2 border-green-500`}>
                        {/* Check if 'products' exist and render product info */}
                       
                            <div className='md:flex'>
                              <div className='px-5 pt-5 pb-2  justify-items-center'>
                              {
                            (item?.reason!==null)&& (
                                <span className="flex px-3 py-1 rounded-lg bg-rose-500 text-white">
                                {item?.reason} OFFER- {item?.amount}%
                            </span>
                            )
                        }
                                <motion.img
                                whileHover={{ scale: 1.2 }}
                                whileTap={{ scale: 0.95 }}
                                onHoverStart={() => console.log('hover started!')}
                                
                                    width="200px"
                                    className="pb-5"
                                    src={`http://127.0.0.1:8000/${item?.image}`}
                                    alt={item?.name}
                                />
                              
                           {averageRating !== null ? (
        <div className="average-rating  pt-2">  <StarRating rating={Math.round(averageRating)} />
        </div>
      ) : (
        <div className="average-rating">No ratings available</div>
      )}
              
                                <p className='font-bold text-xl py-1'>{item?.name} {found}</p>
                              
                                <p className='w-[300px]'>{item?.description}</p>
                                {
                            (item?.reason!==null)?(
                                <span className="font-semibold  mb-1">
                                     <p className='font-semibold '>Price : <span className='line-through'>{item?.price}</span> TK</p>
                              <p>Discount Price :  <span className='text-rose-500'> {
                                    ((100-item?.amount)*item?.price)/100
                                }</span>
                                TK</p>
                            </span>
                            ):<>   <p className='font-semibold'>{item.price} TK </p></>
                        }
                        {
                          found?
                            <Link  to={`/allCart/cart/${cartId}`}>
                             <button className='lg:px-5 text-sm py-2 px-2 rounded-md bg-green-900 text-white' >
                             My Cart Item
                             </button>
                             
                               </Link>
                           
                            :
                          <>
                           {role==='user'?<>  <p onClick={()=>addToCart(item)} className='lg:px-5 text-sm py-2 px-2 rounded-md bg-green-900 text-white'>Add To Cart</p>
                           </>:<></>}
                          </>
                        }
     
                               
                                {/* Optionally, you can show the user's details */}
                               
                            </div>
                           
                            <div className=" hover:scrollbar-thumb-green-700 h-[440px] overflow-y-scroll">
                            <p className='text-left font-bold'>Comments</p>
                        {Array.isArray(comments) && comments.length > 0 ? (
      comments.map((comment, index) => (
        <div key={index} className='text-left'>
  
          <p className='flex'><FaUser></FaUser><p className='font-semibold text-lg -mt-2 pl-1'>{comment?.user_name|| "Anonymus"}</p></p>
        
        
          <div className=""> <img
                                    width="100px"
                                    className="-mt-4"
                                    src={`http://127.0.0.1:8000/storage/${comment?.image}`}
                                    alt=""
                                />{
                                  comment?.image?<><p>{comment?.comment}</p></>:<><p className='-mt-4 pl-1'>{comment?.comment}</p></>
                                }
                               </div>
         
        </div>
      ))
    ) : (
      <p>No comments available.</p>
    )}
                            </div>
           </div>
                    </div>
    </div>
   
  )
}
