import { createContext, useContext, useState } from 'react';

const CarritoContext = createContext();

export function useCarrito() {
  return useContext(CarritoContext);
}

export function CarritoProvider({ children }) {
  const [carritoCount, setCarritoCount] = useState(0);

  return (
    <CarritoContext.Provider value={{ carritoCount, setCarritoCount }}>
      {children}
    </CarritoContext.Provider>
  );
}