import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
export const Seller = () => {
    const [users, setUsers] = useState([]);
    useEffect(()=>{
           const fetchData = async ()=>{
             let result = await fetch("http://localhost:8000/api/allRequest");
             result  = await result.json();
             setUsers(result)
           }
           fetchData();
         })
     const deleteUser = async(userId)=>{

 let result= fetch(`http://127.0.0.1:8000/api/deleteUser/${userId}`,{
                        method: 'GET'
                 })
                 setUsers((prevProducts) => prevProducts.filter((product) => product.id !== userId));
                     Swal.fire({
                            title: "Request is removed",
                            icon: "success",
                            text: result.message,
                          });
     }

     const approveUser = async (userId)=>{
 let result= fetch(`http://127.0.0.1:8000/api/approveUser/${userId}`,{
                        method: 'GET'
                 })
                 setUsers((prevProducts) => prevProducts.filter((product) => product.id !== userId));
             
                     Swal.fire({
                            title: "Request is approved",
                            icon: "success",
                            text: result.message,
                          });
     }
  return (
    <div className='mt-[70px]'>

{
  users.length!=0?<><p className='font-semibold text-xl text-center py-4'>Seller Requests</p>
   <table className="table-auto w-full my-4 border-collapse border border-gray-200">
  <thead>
    <tr className="bg-gray-100">
 
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
       
          <td className="border border-gray-300 px-4 py-2 text-center">
<button onClick={()=>approveUser(item?.users?.id)}  className="bg-blue-500 text-white px-3 py-1 rounded">Approve</button>
       
             <button onClick={()=>deleteUser(item.id)} className="bg-red-500 text-white px-3 py-1 rounded">Remove</button>
       
      
                </td>
          
        </tr>
        }
       
      })
   }
   
    
  </tbody>
</table></>:<><p className='text-center text-red-500 text-lg font-mono py-6'>No Requests</p></>
}

    
    </div>
  )
}
