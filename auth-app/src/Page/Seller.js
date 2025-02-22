import { ellipse } from 'framer-motion/client';
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
export const Seller = () => {
    const [users, setUsers] = useState([]);
    const [sellerType, setSellerType] = useState();
    const [id, setId] = useState();
    const [singleUser, setSingleuser] = useState();
   
    useEffect(()=>{
           const fetchData = async ()=>{
             let result = await fetch("http://localhost:8000/api/allRequest");
             result  = await result.json();
             setUsers(result)
             
            
           }
           fetchData();
         }, [])


console.log("ID OUTSIDE", sellerType)

     const deleteUser = async(userId)=>{

 let result= fetch(`http://127.0.0.1:8000/api/deleteUser/${userId}`,{
                        method: 'GET'
                 })
                 alert(userId)
                 setUsers((prevProducts) => prevProducts.filter((product) => product.id !== userId));
                     Swal.fire({
                            title: "Request is removed",
                            icon: "success",
                            text: result.message,
                          });
     }

     const approveUser = async (e)=>{
      e.preventDefault();
      const formData = new FormData(e.target);
 
 let result= fetch(`http://127.0.0.1:8000/api/approveUser`,{
                        method: 'POST',
                        body: formData,
              headers: {
                  "Accept": "application/json"
              }
                 })
                 console.log(formData)
                 
                 setUsers((prevProducts) => prevProducts.filter((product) => product.id !== Number(formData.get("sellId")?.valueOf())));
                
                     Swal.fire({
                            title: "Request is approved",
                            icon: "success",
                            text: result.message,
                          });
     }
  return (
    <div className='mt-[70px] lg:ml-[150px]'>

{
  users.length!=0?<><p className='font-semibold text-xl text-rose-500 text-center py-4'>Seller Requests</p>
  <div className=' overflow-x-auto'>
   <table className="table-auto text-rose-800 w-full my-4 border-collapse border border-gray-200">
  <thead>
    <tr className="bg-gray-100 text-rose-500">
 
      <th className="border border-gray-300 px-4 py-2">Image</th>
      <th className="border border-gray-300 px-4 py-2">Name</th>
      <th className="border border-gray-300 px-4 py-2">Email</th>
      <th className="border border-gray-300 px-4 py-2">Phone</th>
      <th className="border border-gray-300 px-4 py-2">Category</th>
     
      <th className="border border-gray-300 px-4 py-2">Action</th>

    </tr>
  </thead>
  <tbody>
    
   {
      users.map((item)=>{
        if(item?.users){
          return  <tr className="hover:bg-gray-50">
          <td className="border border-gray-300 px-4 py-2"><img width="50px" src={"http://127.0.0.1:8000/"+item?.users?.image} /></td>
          <td className="border border-gray-300 px-4 py-2 text-center">{item?.users?.name}</td>
          <td className="border border-gray-300 px-4 py-2 text-center">{item?.users?.email}</td>
          <td className="border border-gray-300 px-4 py-2 text-center">{item?.users?.phone}</td>
          <td className="border border-gray-300 px-4 py-2 text-center">{item?.category}</td>
       
          <td className="border border-gray-300 px-4 py-2 text-center ">
            <form onSubmit={approveUser}>
              <input type='hidden'  name='sellerType' value={item?.category}/>
              <input type='hidden' name='id' value={item?.users?.id} />
              <input type='hidden' name='sellId' value={item?.id} />
           
            
              <input type='submit' 
              value='Approve'
              className='bg-blue-500 mr-1 mb-1 text-white px-3 py-1 rounded'/>
            </form>
     
             <button onClick={()=>deleteUser(item.id)} className="bg-red-500 text-white px-3 py-1 rounded">Remove</button>
       
      
                </td>
          
        </tr>
        }
       
      })
   }
   
    
  </tbody>
</table> </div></>:<><p className='text-center text-red-500 text-lg font-mono py-6'>No Requests</p></>
}

    
    </div>
  )
}
