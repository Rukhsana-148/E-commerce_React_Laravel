import React, {useState, useContext} from 'react';
import { Login } from './Login';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';

export const Register = () => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [image, setImage] = useState(null);
    const [phone, setPhone] = useState();
    const [role, setRole] = useState('user');
    const [password, setPassword] = useState();
   const {loginHandle} = useContext(AuthContext);
   const navigate = useNavigate();
  

    async function signup(){
         const formData  = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("image", image);
        formData.append("role", role);
        formData.append("phone", phone);
        formData.append("password", password);
        
        
       
        console.log("FormData Entries:", Array.from(formData.entries()));
  
        let result = await fetch("http://127.0.0.1:8000/api/auth/register",{
            method : "POST",
            body : formData,
            headers: {
                "Accept" : "application/json"
            }
        })
        result = await result.json();
       
      
        localStorage.setItem("users", JSON.stringify(result))
        console.log("Local Storage users:", JSON.parse(localStorage.getItem("users")));
        loginHandle(result);
        navigate('/')

    }
  return (
    <div className='mt-[70px]'>

    <p className='text-center text-green-600 text-2xl font-bold py-[20px]'>Registration</p>
    <div className="form grid justify-items-center ml-[10%]">
      <div className='text-left'>
      <input type="text" name="name"  value={name} onChange={(e)=>setName(e.target.value)} placeholder='Enter your name' className='border-2 mt-1 border-green-300 rounded-lg pb-2 px-5 py-3'/><br/>
    <input type="email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Enter your email' className='border-2 mt-1 border-green-300 rounded-lg pb-3 px-5 py-3'/><br/>
    <input
            type="file"
            name="image"
            onChange={(e) => setImage(e.target.files[0])}
            className="border-2 border-green-300 rounded-lg px-4 mt-1 py-3 mb-3"
          /> 
           <br/>
    
    <input type="hidden" name='role' value={role} />
  
          <input type="number" name="phone" value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder='Enter your phone' className='border-2 mt-1 border-green-300 rounded-lg px-5 py-3'/><br/>
   
    <input type="password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Enter your password' className='border-2 mt-1 border-green-300 rounded-lg px-5 py-3'/>
  <br/> <button onClick={signup} className='bg-green-500 text-white px-10 py-2 rounded-2xl my-4 hover:bg-gray-500 hover:text-black'>Registration</button>
   
      </div>
  </div>
    </div>
  )
}