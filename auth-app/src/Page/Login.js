import React, {useState, useContext} from 'react'
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../App';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
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
      
        if (result) {
          // Save the user and token in localStorage
          localStorage.setItem("user", JSON.stringify(result));
          console.log("Local Storage users:", JSON.parse(localStorage.getItem("user")));
         loginHandle(result); // You should set the logged-in state here
          navigate('/'); // Redirect to homepage after login
        } else {
       
          alert("Login failed");
        }
      }
  return (
    <div className='mt-[70px]'>
        <p className='text-center text-2xl text-green-500 font-bold py-[20px]'>Login</p>
    <div className="form grid justify-items-center">
     <input type="email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Enter your email' className='border-2 border-green-300 rounded-lg px-5 py-3'/><br/>
    <input type="password" name="password" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Enter your password' className='border-2 border-green-300 rounded-lg px-5 py-3'/>
   <span className='pt-2'><Link to="/forgetPassword" className='text-green-900 no-underline'>Forget Password?</Link></span>
   <button onClick={login} className=' bg-green-500  text-white px-10 py-2 rounded-2xl my-2 hover:bg-gray-500 hover:text-black'>Login</button>
   </div>
    </div>
  )
}
