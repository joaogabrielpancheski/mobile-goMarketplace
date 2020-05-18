import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      // TODO LOAD ITEMS FROM ASYNC STORAGE
    }

    loadProducts();
  }, []);

  const increment = useCallback(
    async id => {
      setProducts(
        products.map(product => {
          return product.id === id
            ? { ...product, quantity: product.quantity + 1 }
            : product;
        }),
      );
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      setProducts(
        products.map(product => {
          return product.id === id
            ? { ...product, quantity: product.quantity - 1 }
            : product;
        }),
      );
    },
    [products],
  );

  const addToCart = useCallback(
    async product => {
      const prod = products.findIndex(element => element.id === product.id);

      if (prod >= 0) {
        increment(product.id);
      } else {
        setProducts([...products, product]);
      }
    },
    [products, increment],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };
