import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';
export const UpdateProduct = () => {
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [price, setPrice] = useState('');
  const [qunt, setQunt] = useState('');
  const [type, setType] = useState('');
  const [inQ, setInQ]=useState(0);
  const [image, setImage] = useState(null);
   const {id} = useParams();

const [data, setData] = useState([]);


useEffect(()=>{
const fetchdata = async()=>{
    let result = await fetch(`http://localhost:8000/api/getProduct/${id}`)
     result =  await result.json()
   console.log("Result", result)
     setDesc(result.description)
     setImage(result.image)
     setName(result.name)
     setPrice(result.price)
     setQunt(result.quantity)
     setType(result.type)
     console.log(result.type)
}
fetchdata();
},[id])

console.log(data)

const handleUpdate = async(e)=>{
e.preventDefault();
const formData  = new FormData();
formData.append("id", id);
formData.append("name", name);
formData.append("desc", desc);
formData.append("image", image);
formData.append("price", price);
formData.append("qunt", inQ);
formData.append("type", type);

const response = await fetch(`http://localhost:8000/api/productUpdate`, {
  method : "POST",
  body: formData,
})
  const result = await response.json();
  console.log(result)
  if(response.ok){
    Swal.fire({
                           title: "Product is Updated",
                           icon: "success",
                           text: result.message || "You have successfully updated the product.",
                         });
}
}

return (
<div className='text-left  mt-[120px]'>
<p className="text-center text-2xl font-semibold text-green-500">Update Products</p>
<div className='grid justify-items-center'>
<form  encType="multipart/form-data" onSubmit={handleUpdate}>
      <input
        type="text"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter product name"
        className="border-2 border-green-500 mb-2 rounded-lg px-5 py-3 mb-3"
      /><br />
      
      <input
        type="text"
        name="desc"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        placeholder="Enter product description"
        className="border-2 border-green-500 rounded-lg px-5 py-3 mb-3"
      /><br />

      <input
        type="file"
        name="image"
        onChange={(e) => setImage(e.target.files[0])}
        className="border-2 border-green-300 rounded-lg px-3 py-3 mb-3"
      /><br />
<img src={"http://127.0.0.1:8000/"+image} alt="shoes" className='w-[200px] h-[160px]'/>

      <input
        type="number"
        name="price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
        placeholder="Enter product price"
        className="border-2 border-green-300 rounded-lg px-5 py-3 mb-3"
      /><br />
<p>Product Quantity  : {qunt}</p>
      <input
        type="number"
        name="qunt"
        
        onChange={(e) => setInQ(e.target.value)}
        placeholder="Increase product quantity"
        className="border-2 border-green-300 rounded-lg px-5 py-3 mb-3"
      /><br />

<select     className="border-2 text-left border-green-300 rounded-lg px-5 py-3"
          name='type' onChange={(e)=>setType(e.target.value)}>
                                <option value="Baby Shoe" className='ml-2 px-4 py-1 rounded-lg'>Baby Shoe</option>
                                <option value="Hill" className='ml-2 px-4 py-1 rounded-lg'>Hill</option>
                                <option value="Shoe" className='ml-2 px-4 py-1 rounded-lg'>Shoe</option>
                                  </select> 
          <br /><br />

      <button type="submit" className=" bg-green-500 text-white px-10 py-3 rounded-2xl my-4 hover:bg-gray-500 hover:text-black">
        Update Product
      </button>
    </form>
  </div>

</div>
)
}