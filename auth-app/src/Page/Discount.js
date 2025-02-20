import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2';
export const Discount = () => {
    const [reason, setReason] = useState(null);
    const [amount, setAmount] = useState(null);
    const [items, setItems] = useState(null)
    const {id} = useParams();

useEffect(()=>{
   const fetchdata = async()=>{
       let result = await fetch(`http://localhost:8000/api/getProduct/${id}`)
        result =  await result.json()
        setItems(result)
        setAmount(result?.amount)
        setReason(result?.reason)
     
   }
   fetchdata();
   },[id])
console.log(items)
    const handleSubmit = async (e)=>{

        e.preventDefault()
      
        const data = {
            id: id,
            reason : reason,
            amount : amount
        }
        console.log(data)
        const response = await fetch(`http://localhost:8000/api/discountProduct`, {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
          });
          
          const result = await response.json();
          console.log(result)
          if(response.ok){
            Swal.fire({
                                   title: "Ok",
                                   icon: "success",
                                   text: "You have successfully crated discount.",
                                 });
        }
    }

   

    const resetDiscount = async (productId) => {
      try {
        const response = await fetch(`http://127.0.0.1:8000/api/resetDiscount/${productId}`, {
          method: 'GET', // Use PUT or POST
        });
    
        if (!response.ok) {
          throw new Error("Failed to reset the discount");

        }
    
        Swal.fire({
          title: "Success",
          icon: "success",
          text: "Discount is reset",
        });
        setAmount("0");
        setReason(null)
      } catch (error) {
        Swal.fire({
          title: "Error",
          icon: "error",
          text: error.message || "Something went wrong while resetting the discount",
        });
      }
    };
    
  return (
    <div className=' mt-[70px] '>
       <div className="flex justify-center items-center">
   <form onSubmit={handleSubmit} className='md:text-left '>
    <p className='text-center text-2xl text-rose-600 py-3'> Discount   </p>
   <select     className="border-2 border-rose-300 outline-rose-600  rounded-lg px-3 md:w-[350px] py-3 mb-3"
          name='reason' required onChange={(e)=>setReason(e.target.value)} >
            {
              (reason ? <><option value={items?.reason} className='ml-2 px-4 py-1 rounded-lg'>{items?.reason} </option>
                              <option value="Nababorsho" className='ml-2 px-4 py-1 rounded-lg'>Nababorsho</option>
                     
                              </>:<> <option  className='ml-2 px-4 py-1 rounded-lg'>Select Discount Reason</option>
                               
                               <option value="Eid" className='ml-2 px-4 py-1 rounded-lg'>Eid </option>
                               <option value="Nababorsho" className='ml-2 px-4 py-1 rounded-lg'>Nababorsho</option>
                     
                              </>)
            }
                                              </select> 
          <br />
 
          <input
            type="number"
            required
            min="1"
            name="amount"
            value={amount}
            onChange={(e)=>setAmount(e.target.value)}
            placeholder="Discount Parcentage"
            className="border-2 w-[200px] md:w-[350px] border-rose-300 outline-rose-600  rounded-lg px-5 py-3 mb-3"
          />
           <input
            type="hidden"
            value={id}
            name="id"
            placeholder=" Discount Parcentage"
            className="border-2 border-rose-300 outline-rose-600  rounded-lg px-5 py-3"
          /><br/>
          <input type='submit' name='submit' value="Ok" className='px-5  py-1 md:w-[350px] rounded-md bg-green-500 text-white'/>
   </form>
   <br/>
   </div>
<div>
{
            reason && <><button onClick={()=>resetDiscount(id)} className='px-5 py-2 mt-2 md:w-[350px] rounded-md bg-rose-500 text-white'>Reset</button>
  </>
          }
</div>
    </div>
  )
}
