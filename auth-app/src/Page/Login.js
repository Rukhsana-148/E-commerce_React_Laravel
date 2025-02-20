import React, {useState, useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
export const Login = () => {
    const [email, setEmail] = useState();
 
    const [password, setPassword] = useState();
    const navigate = useNavigate();
   const {loginHandle} = useContext(AuthContext)

    async function login() {
        let item = { email, password };

        let response = await fetch("http://127.0.0.1:8000/api/auth/login", {
          method: "POST",
          headers: {
            "Content-type": "application/json",
            "Accept": "application/json",
          },
          body: JSON.stringify(item),
        });
      
        let result = await response.json();
        console.log(response)
        if (response.ok) {
     
          // Save the user and token in localStorage
          localStorage.setItem("user", JSON.stringify(result));
          const users = JSON.parse(localStorage.getItem("user"));
          console.log("Local Storage users:", JSON.parse(localStorage.getItem("user")));
         loginHandle(result); // You should set the logged-in state here
        
            navigate('/');
          
          // Redirect to homepage after login
        } else {
       
          Swal.fire({
            title: "Error!",
            icon: "error",
            text: "Please enter correct information.",
          });
        }
      }
  return (
    <div className='mt-[70px]'>
        <p className='text-center text-2xl text-rose-400 font-bold py-[20px]'>Login</p>
    <div className="form grid justify-items-center">
     <input type="email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Enter your email' className='border-2 border-rose-300 outline-rose-600 rounded-lg px-2  py-3 w-[200px] lg:w-[400px]'/><br/>
    <input type="password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Enter your password' className='border-2 border-rose-300 outline-rose-600  rounded-lg px-2 w-[200px] lg:w-[400px] py-3'/>
   <span className='pt-2'><Link to="/forgetPassword" className='text-rose-900 no-underline'>Forget Password?</Link></span>
   <button onClick={login} className=' bg-rose-500  text-white px-10 py-2 rounded-2xl my-2 hover:bg-rose-800 hover:text-black'>Login</button>
   </div>
    </div>
  )
}
