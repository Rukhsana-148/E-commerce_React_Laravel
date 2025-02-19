import React, { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

export const EditProfile = ({profile, setProfile, setNotify}) => {
    const [user, setUser] = useState();
    const fileInputRef = useRef(null);
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');
    const [image, setImage] = useState(null);
    const [role, setRole]  = useState('user');
    const [cat, setCat] = useState("");

    const {id} = useParams();
    const users = JSON.parse(localStorage.getItem("user"));
    console.log("Edit user", users?.user?.name||users?.name)
    console.log(id)
    useEffect(()=>{
        const fetchUser = async ()=>{
            let result = await fetch(`http://localhost:8000/api/editProfile/${id}`);
            result = await result.json();
            setUser(result);
            setName(result?.name||"")
            setEmail(result?.email||"")
            setPhone(result?.phone||"")
            setRole(result?.role||"")
        }
        fetchUser();
    }, [id])

    const handleImage  = ()=>{
        fileInputRef.current.click();
    }
  
    const handleUpdate = async (e) => {
      e.preventDefault();
  
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("phone", phone);
      if (image) {
          formData.append("image", image);
      }
  
      try {
          let response = await fetch(`http://127.0.0.1:8000/api/myProfile/${id}`, {
              method: "POST",  
              body: formData,
              headers: {
                  "Accept": "application/json"
              }
          });
  
          let result = await response.json();
  
          if (!response.ok) {
              console.error("Validation Error:", result.error || result);
              Swal.fire({
                  title: "Update Failed",
                  icon: "error",
                  text: result.error ? JSON.stringify(result.error) : "An error occurred.",
              });
              return; // Stop execution if there's an error
          }

          setProfile(result.user);
          setNotify("Profile is updated!");
  
          Swal.fire({
              title: "Profile Updated",
              icon: "success",
              text: "You have successfully updated your profile.",
          });
  
          localStorage.setItem("user", JSON.stringify(result.user));
  
      } catch (error) {
          console.error("Request Failed:", error);
          Swal.fire({
              title: "Error",
              icon: "error",
              text: "Something went wrong. Please try again.",
          });
      }
  };
  
    const sendRequest = async (e)=>{
     e.preventDefault();
     const data = {
      id ,
      cat
     }
     console.log("Request data", cat)
     let result = await fetch('http://localhost:8000/api/sendRequest', {
             method: 'POST',
             headers: {
               'Content-Type': 'application/json', // Set the header for JSON
             },
             body: JSON.stringify(data), // Send the data as JSON
           });
    console.log(data)
           const textResponse = await result.json(); // Read the response as text
           console.log(textResponse); 
            Swal.fire({
                         
                          icon: "success",
                          draggable: true,
                          title: textResponse.message,
                        });
    }
  return (
    <div>
        <div className="bg-blue-200 px-10 py-10  mt-[70px]">
       {
        users?.user?.image ?<img src={"http://127.0.0.1:8000/"+users?.user?.image}    onClick={handleImage}
        className='ml-[42%] my-2 border-b-2 border-solid-indigo-600 mx-6 w-[200px] rounded-full ' />
    :
        <img src={"http://127.0.0.1:8000/"+users?.image} onClick={handleImage}
        className='ml-[42%] my-2 border-b-2 border-solid-indigo-600 mx-6 w-[200px] rounded-full '/>
       }
      
         <form  encType="multipart/form-data" onSubmit={handleUpdate}>
      <input
        type="text"
        name="name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Enter product name"
        className="border-2 border-solid-black radius-lg px-5 py-3 mb-3"
      /><br />
      
       <input type="file" ref={fileInputRef} style={{display:'none'}} 
         onChange={(e) => setImage(e.target.files[0])}/>
       <input
        type="text"
        name="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
       
        className="border-2 border-solid-black radius-lg px-5 py-3 mb-3"
      /><br />
      <input
        type="text"
        name="phone"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
       
        className="border-2 border-solid-black radius-lg px-5 py-3 mb-3"
      /><br />
       <button type="submit" className="btn bg-black text-white px-10 py-2 radius-2xl mt-2 mb-4 hover:bg-gray-500 hover:text-black">
        Update Profile
      </button>
      </form>
      {
    (id!=2 && user?.role==='user')?<>
    <form onSubmit={sendRequest}>
    
    <input type='hidden' name='id' value={id} /> <br/>
    <p className='text-sm font-mono '>Please select product category that you ant to sell.</p>
    <select className="border-2 border-black radius-lg px-5 py-3 rounded-lg"
          name='cat' onChange={(e)=>setCat(e.target.value)}>
              <option value="All" className='ml-2 px-4 py-1 rounded-lg'>All</option>
                              
                                <option value="Shoe" className='ml-2 px-4 py-1 rounded-lg'> Shoe</option>
                                <option value="Dress" className='ml-2 px-4 py-1 rounded-lg'>Dress</option>
                                <option value="Electrical Equipments" className='ml-2 px-4 py-1 rounded-lg'>Electrical Equipments</option>
                                <option value="Cosmetics" className='ml-2 px-4 py-1 rounded-lg'>Cosmetics</option>
                               
                                  </select> <br/>
    <input type='submit'value="Send Request for Seller" className='px-5 py-2 my-2 rounded-lg border-2 bg-black text-white'/>
    </form></>:<></>
  }

        </div>
        </div>
  )
}
