import './App.css';
import { useState, useEffect, createContext } from 'react';
import { Navbar, Nav, NavDropdown } from 'react-bootstrap';
import { BrowserRouter as Router, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { Register } from './Page/Register';
import { Login } from './Page/Login';
import { Home } from './Page/Home';
import ForgetPassword from './Page/ForgetPassword';
import ResetPassword from './Page/ResetPassword';
import { EditProfile } from './Page/EditProfile';
import { AddProduct } from './Page/AddProduct';
import { Products } from './Page/Products';
import Swal from 'sweetalert2';
import { FaShoppingCart, FaSignInAlt, FaSignOutAlt, FaUserPlus, FaBars, FaAccessibleIcon, FaBraille } from 'react-icons/fa';
import { Carts } from './Page/Carts';
import { SingleCart } from './Page/SingleCart';
import { MyProducts } from './Page/MyProducts';
import { SingleProduct } from './Page/SingleProduct';
import { UpdateProduct } from './Page/UpdateProduct';
import { Inventory } from './Page/Inventory';
import { Seller } from './Page/Seller';
import { Discount } from './Page/Discount';
import { NotFound } from './Page/NotFound';
import PredefinedRoutes from './Page/PredefinedRoutes';

export const AuthContext = createContext();

function App() {
  const [notification, setNotification] = useState([]);
  const [visible, setVisible] = useState(false);
  const [show, setShow] = useState(false);
  const [profile, setProfile] = useState(null);
  const [product, setProduct] = useState([]);
  const [count, setCount] = useState(0);
  const [loggedIn, setLoggedIn] = useState(false);
  const [user_id, setUserId] = useState(null);
  const [menu, setMenu] = useState(false);
  const navigate = useNavigate();

  const users = JSON.parse(localStorage.getItem("user"));
  
  const location = useLocation();

  // Exclude Navbar on the NotFound page
  const excludeNavbar = !PredefinedRoutes.some(route => location.pathname.match(new RegExp(route.replace(/:\w+/g, '\\w+'))));

  console.log("Navbar",excludeNavbar)
  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const id = storedUser?.user?.id||storedUser?.id;
    const userProfile = storedUser?.user||storedUser;
    if (storedUser?.user) {
    
      setUserId(id);
     setProfile(userProfile)
      setLoggedIn(true);
    } else {
      
      setUserId(id);
      setProfile(userProfile)
      setLoggedIn(true);
    }
  }, []);


  useEffect(() => {
    if (user_id !== null) {
      console.log("User ID found:", user_id);
    }
  }, [user_id]);
  
  useEffect(() => {
    if (loggedIn) {
      setNotification("You have successfully logged in!");
      setVisible(false);
    }
  }, [loggedIn]);

 

  const loginHandle = (user) => {
    if(user){
setLoggedIn(true);
setProfile(user);
setUserId(user.id)
localStorage.setItem("user",JSON.stringify(user))
    }else{
setLoggedIn(false)
setProfile(null)
setUserId(null)


localStorage.removeItem(user)

    }
  };

  const notificationSee = () => {
    setVisible(!visible);
  };

  useEffect(() => {
    const fetchData = async () => { 
      let result = await fetch("http://127.0.0.1:8000/api/products");
      result = await result.json();
     //last logged out time
     const lasatLoggedOutTime = localStorage.getItem('lastLoggedOut');

     if(lasatLoggedOutTime) {
      const logoutTime = new Date(lasatLoggedOutTime);
      result = result.map(product => ({
        ...product,
        isNew: new Date(product.added_at) > logoutTime, // Assuming "added_at" is the product's timestamp
      }));
     }

      setProduct(result);
    };
    fetchData();
  }, []);

  const cartHandle = (number) => {
    setCount(number);
  };
useEffect(() => {

          const fetchData = async ()=>{
            let result = await fetch(`http://localhost:8000/api/totalCart/${users?.user?.id||users?.id}`);
            result  = await result.json();
            setCount(result);
          }
          fetchData();
  }, [users?.user?.id||users?.id]);

  const countHandle = async (product) => {

   if((profile?.user?.id||profile?.id)!=="null"){

    const data = {
      user_id: profile?.user?.id||profile?.id,
      product_id: product.id,
    };
console.log(data)
   try {
       // Send the request to add to cart
       const response = await fetch('http://localhost:8000/api/addCart', {
         method: 'POST',
         headers: {
           'Content-Type': 'application/json',
         },
         body: JSON.stringify(data),
       });
   
       const result = await response.json();
   console.log("Response in the Home", result)
       if (response.ok) {
         // Update cart count from API response
         const fetchData = async ()=>{
          let result = await fetch(`http://localhost:8000/api/totalCart/${users?.user?.id||users?.id}`);
          result  = await result.json();
          setCount(result);
        }
        fetchData();
 
         // Show success message
         Swal.fire({
           title: "Product Added To Cart!",
           icon: "success",
           text: "Product has been added to your cart!",
           timer: 2000,
           showConfirmButton: false
         });
       } else {
         // Show an error message if the product is already in the cart
         Swal.fire({
           title: "Product Already in Cart",
           icon: "warning",
           text: result.message || "You have already added this product to your cart.",
         });
       }
     } catch (error) {
       console.error("Error adding to cart:", error);
       Swal.fire({
         title: "Product Already in Cart",
         icon: "warning",
         text: "You have already added this product to your cart!",
       });
     }
  }else{
    Swal.fire({
      title: "Error",
      icon: "error",
      text: "You must be logged in to add products to the cart.",
    });
  }
  };

  const logOut = () => {
    setLoggedIn(false);
   
    localStorage.removeItem("user");
    setProfile(null);
    const logoutTimeMe = new Date().toISOString(); // Get the current logout time in ISO format
    localStorage.setItem(`lastLoggedOut_${user_id}`, logoutTimeMe);
    setCount(0);
    navigate('/login')
    Swal.fire({
      title: "Log Out",
      icon: "success",
      text: "You are logged out.",
    });
  };

  return (
    <div className="App">
     {

     excludeNavbar ?
      <AuthContext.Provider value={{ loginHandle, setNotification }}>
      
          <div className="body border-b-2 border-green-700 rounded-b-xl bg-white   shadow-b-lg flex justify-between items-cnter h-[75px]  text-white py-2 pl-4 fixed w-full top-0 left-0 z-50">
            <div className="flex  pt-[2px] ">
            
              <Link to="/">
                <img
                  src="logo.png"
                  alt="logo"
                  className="-mt-[15px] h-[50px] md:h-[60px] w-auto   mr-[10px] md:rounded-full"
                />
              </Link>
            </div>
           
            <div className="right pt-[20px]  lg:bg-white">
            <p className='block lg:hidden text-black fixed top-4 right-4 z-50' onClick={()=>setMenu(!menu)} ><FaBars></FaBars></p>
        
              <ul className={`${menu?"block border-2 border-green-500 mt-2":"hidden"} lg:flex bg-white  rounded-lg   lg:bg-white lg:-mt-[57px] flex-col lg:flex-row lg:items-center text-left `}>
                {profile ? (
                  <>
                    {(profile?.role || profile?.user?.role) === "admin" && (
                      <>
                      <li className="lg:mt-[30px]  text-sm py-1 -ml-6   px-3 rounded-lg">
                        <NavLink to="/addProduct" 
                        className={({isActive}) =>
    isActive
      ? "no-underline text-green-600 lg:px-3 "  
      : "no-underline text-black lg:px-3 " 
  }>
                          Add Products
                        </NavLink>
                      </li>
                      <li className="lg:mt-[30px]  text-sm py-1 -ml-4   px-2 rounded-lg">
                    <NavLink 
                    className={({isActive}) =>
                      isActive
                    ? "no-underline text-green-600 lg:px-3"  
                    : "no-underline text-black lg:px-3" 
                    } 
                        to={`/inventory/${profile?.user?.id || profile?.id}`}
                      >
                        Inventory
                      </NavLink>
                    
                    </li>
                      </>
                    )}
                    {(profile?.id || profile?.user?.id) === 2 && (
                      <li className="lg:mt-[30px]  text-sm py-1 -ml-6 px-3 rounded-lg">
                      <NavLink 
                        className={({isActive}) =>
                          isActive
                        ? "no-underline text-green-600 lg:px-3 "  
                        : "no-underline text-black lg:px-3 " 
                        }
                        to="/sellers">
                          Seller
                        </NavLink>
                      </li>
                    )}
                    <li className="lg:mt-[30px]  text-sm py-1 -ml-6  px-2 rounded-lg">
                      <NavLink 
                        className={({isActive}) =>
                          isActive
                        ? "no-underline text-green-600 lg:px-3 "  
                        : "no-underline text-black lg:px-3 " 
                        }
                       to="/products">
                        Products
                      </NavLink>
                    </li>
                    <li className="lg:mt-[30px]  text-sm py-1 -ml-4   px-2 rounded-lg">
                      <NavLink
                        className={({isActive}) =>
                          isActive
                        ? "no-underline text-green-600 lg:px-3 "  
                        : "no-underline text-black lg:px-3 " 
                        }
                        to={`/myProducts/${profile?.user?.id || profile?.id}`}
                      >
                        My Products
                      </NavLink>
                    </li>
                    <li className="lg:mt-[30px]  text-sm py-1 -ml-4   px-2 rounded-lg">
                      <sup className='text-black text-md'>{count}</sup>
                      <NavLink
                        className={({isActive}) =>
                          isActive
                        ? "no-underline text-green-600 lg:px-3 "  
                        : "no-underline text-black lg:px-3  " 
                        }  to="/allCart">
                        <FaShoppingCart></FaShoppingCart>
                      </NavLink>
                    </li>

                   
                
                    <Nav className="font-mono">
                      <NavDropdown
                        title={
                          <span>
                            <img
                              src={
                                profile?.image
                                  ? `http://127.0.0.1:8000/${profile.image}`
                                  : profile?.user?.image
                                  ? `http://127.0.0.1:8000/${profile.user.image}`
                                  : "default-avatar.png"
                              }
                              alt="Profile"
                              className="w-[40px]  lg:mt-3 -ml-2 lg:pt-5  h-[50px] rounded-full"
                            />
                          </span>
                        }
                      >
                        <NavDropdown.Item>
                          <Link
                            className="no-underline text-black hover:bg-gray-400 px-2 py-1 hover:rounded-sm"
                            to={`editProfile/${profile?.id || profile?.user?.id}`}
                          >
                            Edit Profile
                          </Link>
                        </NavDropdown.Item>
                        <NavDropdown.Item>
                          <p className="capitalize hover:bg-gray-400 px-2 py-1 transition duration-300 delay-200 hover:rounded-sm">{profile?.role || profile?.user?.role}</p>
                        </NavDropdown.Item>
                        <NavDropdown.Item>
                          <p className="hover:bg-gray-400 px-2 py-1 hover:rounded-sm">{profile?.name || profile?.user?.name}</p>
                        </NavDropdown.Item>
                        <NavDropdown.Item onClick={logOut} ><p className=' px-2 py-1 text-xl text-green-600'>
                          <FaSignOutAlt></FaSignOutAlt>
                          </p></NavDropdown.Item>
                      </NavDropdown>
                    </Nav>
                  
            
                  </>
                ) : (
                  <>
                    <li className="mx-2 text-xl -mt-6 lg:mt-5 lg:text-xl">
                      <NavLink 
                        className={({isActive}) =>
                          isActive
                            ? "no-underline  py-2  text-green-600"  
                            : "no-underline text-black px-3 py-2 " 
                        }
                       to="/register"><FaUserPlus></FaUserPlus></NavLink>
                    </li>
                    <li className="mx-2 text-xl -mt-6  lg:mt-5 lg:text-xl">
                      <NavLink className={({isActive}) =>
                          isActive
                            ? "no-underline  py-2 text-green-600"  
                            : "no-underline text-black px-3 py-2 " 
                        }
                       to="/login"><FaSignInAlt></FaSignInAlt></NavLink>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          <Routes>
            <Route path="/register" element={<Register />} />
            <Route
              path="/editProfile/:id"
              element={<EditProfile profile={profile} setProfile={setProfile} setNotify={setNotification} />}
            />
            <Route path="/login" element={<Login />} />
            <Route path="/addProduct" element={<AddProduct />} />
            <Route path="/forgetPassword" element={<ForgetPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="/" element={<Home mainPage={cartHandle} />} />
            <Route path="/products" element={<Products product={product} addToCart={countHandle} />} />
            <Route path="/allCart" element={<Carts cartCount={setCount}/>} />
            <Route path="/allCart/cart/:id" element={<SingleCart cartCount={setCount}/>} />
            <Route path="/myProducts/:id" element={<MyProducts />} />
            <Route path="/detail/:id" element={<SingleProduct addToCart={countHandle} />} />
            <Route path="/updateProduct/:id" element={<UpdateProduct />} />
            <Route path="/inventory/:id" element={<Inventory />} />
            <Route path="/discount/:id" element={<Discount />} />
            <Route path="/sellers" element={<Seller />} />
            <Route path="*" element={<NotFound/>}/>
                      </Routes>
        
      </AuthContext.Provider>:<></>}
    </div>
  );
}

export default App;
