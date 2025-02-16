import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { StarRating } from './StarRating'
import { FaUser } from 'react-icons/fa'
export const SingleProduct = ({addToCart}) => {

    const [item, setItems]= useState(null);
    const [cmntData, setCmntData] = useState();
    const {id} = useParams();
   
    const [averageRating, setAverageRating] = useState(null); // State to store average rating
     const users = localStorage.getItem("user");
     console.log("In the single product", users)

   useEffect(()=>{
    console.log("Id",id)
   const fetchdata = async()=>{
       let result = await fetch(`http://localhost:8000/api/getProduct/${id}`)
        result =  await result.json()
        setItems(result)
        setCmntData(result.comment||"")
   }
   fetchdata();
   },[id])
   let comments = [];
   if(cmntData){
     try{
   comments = JSON.parse(cmntData);
     }catch(e){
   comments = [{comment: cmntData}];
     }
   }
// Check if item?.rating exists and is a valid JSON string
useEffect(() => {
    // Check if item?.rating exists and is a valid JSON string
    if (item?.rating && typeof item?.rating === 'string') {
      try {
        const ratingsArray = JSON.parse(item?.rating);
        console.log("Rating", ratingsArray);

        // Map to integers and calculate total
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
    <div className="flex justify-center items-center">
 <div key={item?.id} className='px-2    mt-[100px]  py-1 rounded-md border-2 border-green-500'>
                        {/* Check if 'products' exist and render product info */}
                       
                            <div className='flex'>
                              <div className='px-5 justify-items-center'>
                          
                                <img
                                    width="200px"
                                    className="pt-3"
                                    src={`http://127.0.0.1:8000/${item?.image}`}
                                    alt={item?.name}
                                />
                           {averageRating !== null ? (
        <div className="average-rating  pt-2">  <StarRating rating={Math.round(averageRating)} />
        </div>
      ) : (
        <div className="average-rating">No ratings available</div>
      )}
              
                                <p className='font-bold text-xl py-1'>{item?.name}</p>
                                <p>{item?.description}</p>
                                <p>Product Price: <span className='font-bold pl-1 '>{item?.price}Tk.</span></p>
                          {users?<> <p onClick={()=>addToCart(item)} className='lg:px-5 text-sm py-2 px-2 rounded-md bg-green-900 text-white'>Add To Cart</p>
                          </>:<></>}
                               
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
