import { useParams } from "react-router-dom";

export const NewPage = () => {
  const { productId, cartId } = useParams(); // Extract the params

  return (
    <div>
      <h2>Product ID: {productId}</h2>
      <h2>Cart ID: {cartId}</h2>
    </div>
  );
};


