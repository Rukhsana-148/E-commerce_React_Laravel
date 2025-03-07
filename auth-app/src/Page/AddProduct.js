import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import allCategroy from './Category.json'

export const AddProduct = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [qunt, setQunt] = useState('');
  const [mainType, setMainType]= useState('')
  const [type, setType] = useState('');
  const [image, setImage] = useState(null);
  const [owner, setId] = useState(null);

  const users = JSON.parse(localStorage.getItem("user"));
  useEffect(()=>{
    if(users?.user){
      setId(users?.user?.id)
      setMainType(users?.user?.sellerType)
    }else{
      setId(users?.id)
      setMainType(users?.sellerType)
    }
  })
 
  async function addProduct(e) {
    e.preventDefault();  // Prevent default form submission

    const formData = new FormData();
    formData.append('name', name);
    formData.append('desc', desc);
    formData.append('price', price);
    formData.append('qunt', qunt);
    formData.append('mainType', mainType);
    formData.append('type', type);
    formData.append('image', image);
    formData.append('owner', owner);
    let result = await fetch('http://127.0.0.1:8000/api/addProduct', {
      method: 'POST',
      body: formData,
    });
console.log(formData)
    result = await result.json();
    
     Swal.fire({
               title: "Producted is Created!",
               icon: "success",
               draggable: true,
               
               text: "Product has been Created !",
             });
  }

  return (
    <div className='text-left mt-[70px]'>
      <p className="text-center text-2xl font-semibold py-[20px] text-rose-400">Add Products</p>
       <div className="ml-[60%]">
     
       </div>
     
      <div className="grid justify-items-center">
        <form onSubmit={addProduct} encType="multipart/form-data">
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            className="border-2 border-rose-300 rounded-lg md:px-5 px-2 py-3 mb-3"
          /><br />
          
          <input
            type="text"
            name="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Enter product description"
            className="border-2 border-rose-300 outline-rose-600 rounded-lg md:px-5 px-2 py-3 mb-3"
          /><br />

          <input
            type="file"
            name="image"
            onChange={(e) => setImage(e.target.files[0])}
            className="border-2 border-rose-300 outline-rose-600  rounded-lg md:px-3 px-2 py-3 mb-3"
          /><br />

          <input
            type="number"
            name="price"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter product price"
            className="border-2 border-rose-300 outline-rose-600 rounded-lg md:px-5 px-2 py-3 mb-3"
          /><br />

          <input
            type="number"
            name="qunt"
            min="1"
            value={qunt}
            onChange={(e) => setQunt(e.target.value)}
            placeholder="Enter product quantity"
            className="border-2 border-rose-300 outline-rose-600  rounded-lg md:px-5 px-2 py-3 mb-3"
          /><br />

       You can add product of  :    <input type='text' name='mainType' value={mainType} 
        className="border-ose-300 outline-rose-600 rounded-lg md:px-3 px-2 py-3"/> <br/>
                          
 <select     className="border-2 border-ose-300 outline-rose-600 rounded-lg md:px-3 px-2 py-3"
          name='type' onChange={(e)=>setType(e.target.value)}>
              <option  className='ml-2 md:px-4 py-1 rounded-lg'>Select Product Subcategory</option>
                           {
                            allCategroy.map((item)=>{
                              if(item.category===mainType){
                              return  item.subCategory.map((subC)=>{
                                  return  <option value={subC.name}  className='ml-2 md:px-4 py-1 rounded-lg'>{subC.name}</option>
             
                                })
                              }
                            })
                           }
                      
                    
                               </select> 
          <br />

          <button type="submit" className=" bg-rose-600 text-white  px-10 py-3 rounded-2xl my-4 hover:bg-gray-500 hover:text-black">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}