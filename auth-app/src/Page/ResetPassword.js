import React, { Children, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useParams } from "react-router-dom";
import Swal from "sweetalert2";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { token } = useParams();
  console.log("Token",token)
  
  const email = new URLSearchParams(location.search).get("email");
  console.log(email)
  const handleResetPassword = async () => {
    if (!password) {
      setError("Please enter a new password.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ email, token, password }),
      });

      const data = await response.json();
      if (data.success) {
        Swal.fire({
             title: "Done",
             icon: "success",
             text: "Now login",
           });
        navigate("/login");
      } else {
        setError(data.message || "An error occurred.");
      }
    } catch (error) {
      console.error("Error:", error);
      console.log(error)
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="py-12 text-lg">Reset Password</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="password"
        placeholder="Enter new password"
        value={password}
        onChange={(e) => setPassword(e.target.value)} className="border-2 border-solid-black rounded-md 
        py-3 px-5"
      /> <br/>
      <button onClick={handleResetPassword} disabled={loading} className="my-2 rounded-lg bg-blue-500 text-white px-5 py-2">
        {loading ? "Resetting..." : "Reset Password"}
      </button>
    </div>
  );
};

export default ResetPassword;
