"use client";

import {
  createContext,
  useContext,
  useState,
  ReactNode,
} from "react";

interface CartDrawerContextType {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const CartDrawerContext = createContext<
  CartDrawerContextType | undefined
>(undefined);

export const CartDrawerProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const openDrawer = () =>
    setIsOpen(true);

  const closeDrawer = () =>
    setIsOpen(false);

  return (
    <CartDrawerContext.Provider
      value={{
        isOpen,
        openDrawer,
        closeDrawer,
      }}
    >
      {children}
    </CartDrawerContext.Provider>
  );
};

export const useCartDrawer = () => {
  const context = useContext(
    CartDrawerContext
  );

  if (!context) {
    throw new Error(
      "useCartDrawer must be used inside CartDrawerProvider"
    );
  }

  return context;
};