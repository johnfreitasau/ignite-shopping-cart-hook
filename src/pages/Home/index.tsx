import axios from "axios";
import React, { useEffect, useMemo, useState } from "react";
import { MdAddShoppingCart } from "react-icons/md";
import { useCart } from "../../hooks/useCart";
import { formatPrice } from "../../util/format";
import { ProductList } from "./styles";

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { addProduct, cart } = useCart();

  const cartItemsAmount = useMemo(() => {
    return cart.reduce((sumAmount, product) => {
      const newSumAmount = { ...sumAmount };

      newSumAmount[product.id] = product.amount;

      return newSumAmount;
    }, {} as CartItemsAmount);
  }, [cart]);

  useEffect(() => {
    async function loadProducts() {
      // TODO
      const response = await axios.get<Product[]>(
        "http://localhost:3333/products"
      );

      const data = response.data.map((product) => ({
        ...product,
        priceFormatted: formatPrice(product.price),
      }));

      setProducts(data);
    }

    loadProducts();
  }, []);

  function handleAddProduct(id: number) {
    addProduct(id);
  }

  return (
    <ProductList>
      {products.map((product) => (
        <li key={product.id}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{product.priceFormatted}</span>
          <button
            type="button"
            data-testid="add-product-button"
            onClick={() => handleAddProduct(product.id)}
          >
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
              {cartItemsAmount[product.id] || 0}
            </div>

            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}
    </ProductList>
  );
};

export default Home;
