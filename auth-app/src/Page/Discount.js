import React, { useState } from 'react'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2';
export const Discount = () => {
    const [reason, setReason] = useState("");
    const [amount, setAmount] = useState(0);
    const {id} = useParams();
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
  return (
    <div className=' flex justify-center items-center mt-[120px]'>
       
   <form onSubmit={handleSubmit} className='text-left '>
    <p className='text-center text-2xl text-green-600'> Discount   </p>
   <select     className="border-2 border-green-300  rounded-lg px-3 w-[350px] py-3 mb-3"
          name='reason' onChange={(e)=>setReason(e.target.value)} >
              <option  className='ml-2 px-4 py-1 rounded-lg ' >Select Discount Reason</option>
                           
                                <option value="Eid" className='ml-2 px-4 py-1 rounded-lg'>Eid </option>
                                <option value="Nababorsho" className='ml-2 px-4 py-1 rounded-lg'>Nababorsho</option>
                                                       </select> 
          <br />
 
          <input
            type="number"
            name="amount"
            value={amount}
            onChange={(e)=>setAmount(e.target.value)}
            placeholder=" Discount Parcentage"
            className="border-2 border-green-300  rounded-lg px-5 py-3 mb-3"
          /><br />
           <input
            type="hidden"
            value={id}
            name="id"
            placeholder=" Discount Parcentage"
            className="border-2 border-green-300  rounded-lg px-5 py-3 mb-3"
          /><br />
          <input type='submit' name='submit' value="Ok" className='px-5 py-2 w-[350px] rounded-md bg-green-500 text-white'/>
   </form>
    </div>
  )
}
