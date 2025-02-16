import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

export const AddProduct = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [qunt, setQunt] = useState('');
  const [type, setType] = useState('');
  const [image, setImage] = useState(null);
  const [owner, setId] = useState(null);

  const users = JSON.parse(localStorage.getItem("user"));
  useEffect(()=>{
    if(users?.user){
      setId(users?.user?.id)
    }else{
      setId(users?.id)
    }
  })
  
  async function addProduct(e) {
    e.preventDefault();  // Prevent default form submission

    const formData = new FormData();
    formData.append('name', name);
    formData.append('desc', desc);
    formData.append('price', price);
    formData.append('qunt', qunt);
    formData.append('type', type);
    formData.append('image', image);
    formData.append('owner', owner);
    let result = await fetch('http://127.0.0.1:8000/api/addProduct', {
      method: 'POST',
      body: formData,
    });

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
      <p className="text-center text-2xl font-semibold py-[20px] text-green-400">Add Products</p>
      <div className="grid justify-items-center">
        <form onSubmit={addProduct} encType="multipart/form-data">
          <input
            type="text"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter product name"
            className="border-2 border-green-300 rounded-lg px-5 py-3 mb-3"
          /><br />
          
          <input
            type="text"
            name="desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            placeholder="Enter product description"
            className="border-2 border-green-300  rounded-lg px-5 py-3 mb-3"
          /><br />

          <input
            type="file"
            name="image"
            onChange={(e) => setImage(e.target.files[0])}
            className="border-2 border-green-300  rounded-lg px-3 py-3 mb-3"
          /><br />

          <input
            type="number"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Enter product price"
            className="border-2 border-green-300  rounded-lg px-5 py-3 mb-3"
          /><br />

          <input
            type="number"
            name="qunt"
            value={qunt}
            onChange={(e) => setQunt(e.target.value)}
            placeholder="Enter product quantity"
            className="border-2 border-green-300  rounded-lg px-5 py-3 mb-3"
          /><br />
 <select     className="border-2 border-green-300  rounded-lg px-3 py-3"
          name='type' onChange={(e)=>setType(e.target.value)}>
                                <option value="Baby Shoe" className='ml-2 px-4 py-1 rounded-lg'>Baby Shoe</option>
                                <option value="Hill" className='ml-2 px-4 py-1 rounded-lg'>Hill</option>
                                <option value="Shoe" className='ml-2 px-4 py-1 rounded-lg'>Shoe</option>
                                  </select> 
          <br />

          <button type="submit" className=" bg-green-600 text-white  px-10 py-3 rounded-2xl my-4 hover:bg-gray-500 hover:text-black">
            Add Product
          </button>
        </form>
      </div>
    </div>
  );
}