import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';

export const Carts = ({cartCount}) => {
    const [items, setItems] = useState([]);
    const [status, setStatus] = useState(false);
    const [user_id, setUserId] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 3;

    const users = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        if (users?.user) {
            setUserId(users?.user?.id);
        } else {
            setUserId(users?.id);
        }
    }, [users]);

    useEffect(() => {
        const fetchdata = async () => {
            if (user_id) {
                let result = await fetch(`http://127.0.0.1:8000/api/allCart/${user_id}`);
                result = await result.json();
                setItems(result||[]);
                setStatus((result.length||[]) > 0);
            }
        };
        fetchdata();
    }, [user_id]);

    async function deleteCart(id) {
        await fetch(`http://127.0.0.1:8000/api/deleteCart/${id}`, { method: 'GET' });
        setItems(prevProducts => {
          const updateItems =   prevProducts.filter(product => product.id !== id);
            cartCount(updateItems.length)
            return updateItems;
        }
            );
    //    cartCount(items.length)
        Swal.fire({
            title: "Cart Item is removed",
            icon: "success",
            text: "Cart has been deleted from your cart list",
        });
    }

    // Pagination logic

    const totalPages = Math.ceil((items.length||0) / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

    const nextPage = () => setCurrentPage(prev => (prev < totalPages ? prev + 1 : prev));
    const prevPage = () => setCurrentPage(prev => (prev > 1 ? prev - 1 : prev));

    return (
        <div className="container mx-auto p-4  mt-[70px]">
            {status ? (
                <>
                    <p className='text-center py-5 font-semibold font-mono text-lg text-green-800'>Your Cart Items</p>
           <div className="overflow-x-auto">
           <table className="table-auto  w-full border-collapse border border-green-200">
                        <thead>
                            <tr className="bg-green-600">
                                <th className="border-1 border-green-300 px-4 py-2">Name</th>
                                <th className="border-1 border-green-300 px-4 py-2">Product Name</th>
                                <th className="border-1 border-green-300 px-4 py-2">Image</th>
                                <th className="border-1 border-green-300 px-4 py-2">Price</th>
                                <th className="border-1 border-green-300 px-4 py-2">Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map((item) => (
                                item?.products && (
                                    <tr key={item.id} className="hover:bg-gray-50">
                                        <td className="border border-green-300 px-4 py-2 text-center">{item?.users?.name}</td>
                                        <td className="border border-green-300 px-4 py-2">{item?.products?.name}</td>
                                        <td className="border border-green-300 px-4 py-2">
                                            <img width="50px" src={`http://127.0.0.1:8000/${item?.products?.image}`} alt="product" />
                                        </td>
                                        <td className="border border-green-300 px-4 py-2">{item?.products?.price}</td>
                                        <td className="border border-green-300 px-4 py-2 text-center">
                                            <Link to={`cart/${item.id}`}>
                                                <button className="bg-blue-500 text-white px-3 mb-2 py-1 rounded">Order</button>
                                            </Link>
                                            <button onClick={() => deleteCart(item.id)} className="bg-red-500 text-white px-3 py-1 rounded ml-2">Remove</button>
                                        </td>
                                    </tr>
                                )
                            ))}
                        </tbody>
                    </table>
           </div>
                   
                    {/* Pagination Controls */}
                    <div className="flex justify-center my-5">
                        <button onClick={prevPage} disabled={currentPage === 1} className="px-3 py-2 mx-2 bg-green-300 rounded-lg">Previous</button>
                        <span className="px-4 py-2 text-black">Page {currentPage} of {totalPages}</span>
                        <button onClick={nextPage} disabled={currentPage >= totalPages} className="px-3 py-2 mx-2 bg-green-300 rounded-lg">Next</button>
                    </div>
                </>
            ) : (
                <p className="text-center py-5 font-semibold font-mono text-lg">You have no cart items.</p>
            )}
        </div>
    );
};
