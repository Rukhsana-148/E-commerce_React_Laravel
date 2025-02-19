import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { FaStar } from 'react-icons/fa';

export const MyProducts = () => {
    const [products, setProducts] = useState([]);
    const [rating, setRating] = useState({});
    const [comment, setComment] = useState("");
    const[userName, setUserName] = useState("");
      const [image, setImage] = useState(null);
    const[id, setId] = useState(null);
    const[name, setName] = useState(null);

    const users = JSON.parse(localStorage.getItem("user"))
 
    useEffect(() => {
        if(users?.user){
            setId(users?.user?.id)
            setName(users?.user?.name);
         }else{
           setId(users?.id)
           setName(users?.name)
         }
         
        const fetchData = async () => {
            const response = await fetch(`http://localhost:8000/api/myProducts/${id}`); // Replace with your API endpoint
            const data = await response.json();
            setProducts(data);
            //console.log("Data Product", data)
        };

        fetchData();
    }, [users]);


    const handleReview = async (e, productId, id) => {
        e.preventDefault();
        if(rating[id] < 1 && (comment === "" || !image)){
           
                Swal.fire({
                    title: "No Ratng!",
                    icon: "error",
                    text: "You Should provide comment or image.",
                  });
            
          
        }else{
            const reviewData = new FormData();
            reviewData.append("id", productId);
            
            reviewData.append("rating", rating[id]||"0");
            if(comment!==""){
                reviewData.append("name", name);
                reviewData.append("comment", comment);
            }
        //    reviewData.append("name", name);
            
            
            if (image) {
                reviewData.append("image", image);
            }
        
     
        for (let pair of reviewData.entries()) {
            console.log(pair[0], pair[1]);
        }

    try {
        const response = await fetch("http://127.0.0.1:8000/api/review", {
            method: "POST",
            body: reviewData
        });

        const data = await response.json();
        console.log("Response:", data);
         console.log(data)
        if (response.ok) {
             Swal.fire({
                                      title: "Review is Done",
                                      icon: "success",
                                      text: data.message || "Thanks for your review",
                                    });
        } else {
            let errorData = await response.json();
            if(errorData.errors){
                Object.entries(errorData.errors).forEach(([field, message])=>{
                    Swal.fire({
                        title: "Validation Error",
                        icon: "error",
                        text: data.message || "Something is wrong.",
                      });
                  }
                )
            }else{
                Swal.fire({
                    title: 'Error',
                    text: errorData.message || 'Something went wrong!',
                    icon: 'error',
                  });
            }

        }   
    }catch (error) {
        console.error("Error submitting review:", error);
      
        Swal.fire({
            title: "Something is wrong",
            icon: "error",
            text: "Network error. Please check your connection.",
          });
        
}
        }
    };
    const handleRating = (productId, value)=>{
        setRating((prev) => ({ ...prev, [productId]: value }));
    }
    return (
        <div className='  mt-[70px]'>
            <p className='text-center py-3 text-green-700 font-semibold text-xl font-mono'>My Products List</p>
            <div className="md:grid md:grid-cols-3  gap-2 my-5 mx-3">
                {
                    products.map((item)=>{
                        if(item?.products){
                            return   <div key={item.id} className='px-2 my-2  py-1 rounded-md border-2 border-green-400'>
                            {/* Check if 'products' exists and render product info */}
                           
                                <div>
                                    <div className="h-[250px]">
                                    {
                            (item?.products?.reason!==null)&& (
                                <span className="flex px-3 py-1 w-[150px] absolute font-mono rounded-lg bg-rose-500 text-white">
                                {item?.products?.reason} OFFER- {item?.products?.amount}%
                            </span>
                            )
                        }


                                    <img
                                        width="200px"
                                       
                                        className="pt-3"
                                        src={`http://127.0.0.1:8000/${item?.products?.image}`}
                                        alt={item?.products?.name}
                                    />
                                    </div>
                                   
                                  
                                    <p  className='text-left mt-2'>{item?.products?.name}</p>


                                    {
                            (item?.products?.reason!==null)?(
                                <span className="font-semibold  mb-1 text-left ">
                                     <p className='font-semibold  text-left '>Product Price: : <span className='line-through'>{item?.products?.price} TK</span></p>
                               <p className='text-left text-rose-500'>Discount Price :  
                                {
                                    ((100-item?.products?.amount)*item?.products?.price)/100
                                } TK
                                </p>
                            </span>
                            ):<>   <p className='font-semibold text-left'>Product Price: {item?.products?.price} TK</p></>
                        }
                                     <p className='text-left mt-2'>Total Price: {item?.price}Tk</p>
                                   <p className='font-bold text-center'>Please Give Review</p>
                                    {/* Optionally, you can show the user's details */}
                                    <div className="text-left border-1 border-solid-black px-3 py-2 rounded-lg font-mono">     <form onSubmit={(e)=>handleReview(e, item?.products?.id, item?.id)} >
                                   
                                   <input type="hidden" name="id" value={item?.product_id}/>
                                   <label>Rating</label>
                                 
                                   <div className="flex space-x-2 my-2 ">
                       {[1, 2, 3, 4, 5].map((star) => (
                         <FaStar
                           key={star}
                           className={`cursor-pointer text-3xl transition-colors duration-300 ${
                             star <= (rating[item?.id] || 0)
                               ? "text-green-800"
                               : "text-gray-500"
                           }`}
                           onClick={() => handleRating(item?.id, star)}
                         />
                       ))}
                     </div>
                                
                           <br/>
               <input type="hidden" name="rating" value={rating[item?.id||"0"]} />
   
                               <input type="hidden" name="username" value={name} onChange={(e)=>setUserName(e.target.value)}/>
                               <label>Comment : </label>  <br/>
                               <textarea name="comment" onChange={(e)=>setComment(e.target.value)} className='px-4 py-2 border-2 border-solid-gray-400'></textarea>
                               <br/>
                               <label>You can upload image if you want for review : </label>
                               <br/>
                               <input type="file"
                            id="image"
                            name="image"
                           accept="image/png, image/jpeg, image/gif"
                           onChange={(e) => setImage(e.target.files[0])} 
                            className='text-center text-sm text-orange-700 py-2 px-2 my-2 
                               rounded-lg border-2 border-solid-black  text-black'/>
                              

                               
                               
                                 <input type='submit' name="Submit" value="Submit" className='text-center py-2 px-5 my-2 rounded-lg bg-green-500 text-black'/>
                                      </form></div>
                              
                                </div>
                            
                        </div>
                        }
                    })
                }
               
            </div>
        </div>
    );
};
