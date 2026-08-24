"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  size: string;
  quantity: number;
  stock: number;
};

type Offer = {
  id: number;
  name: string;
  min_quantity: number;
  discount_percent: number;
  active: number;
  applies_to_all: number;
};

type CartContextType = {
  cart: CartItem[];

  addToCart: (item: CartItem) => void;

  removeFromCart: (id: string, size: string) => void;

  increaseQuantity: (id: string, size: string) => void;

  decreaseQuantity: (id: string, size: string) => void;

  clearCart: () => void;

  totalItems: number;

  subtotal: number;

  discountPercent: number;

  discountAmount: number;

  totalPrice: number;

  activeOffer: Offer | null;

  offers: Offer[];

  isCartOpen: boolean;

  setIsCartOpen: (open: boolean) => void;
};

const CartContext = createContext<CartContextType | undefined>(
  undefined
);

export function CartProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const [isCartOpen, setIsCartOpenState] =
    useState(false);

  const [offers, setOffers] = useState<Offer[]>([]);

  /*
   * Load cart from localStorage
   */
  useEffect(() => {
    try {
      const savedCart =
        localStorage.getItem("ayraz-cart");

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart) as CartItem[];

        // Older carts were saved before stock was included. Keep them valid
        // and prevent them from increasing until fresh product data is added.
        setCart(
          parsedCart.map((item) => ({
            ...item,
            stock: Math.max(
              Number(item.stock) || 0,
              Number(item.quantity) || 1
            ),
          }))
        );
      }
    } catch (error) {
      console.error(
        "Failed to load cart:",
        error
      );
    }
  }, []);

  /*
   * Save cart to localStorage
   */
  useEffect(() => {
    localStorage.setItem(
      "ayraz-cart",
      JSON.stringify(cart)
    );
  }, [cart]);

  /*
   * Load offers from database
   */
  useEffect(() => {
    async function loadOffers() {
      try {
        const res = await fetch(
          "/api/offers",
          {
            cache: "no-store",
          }
        );

        if (!res.ok) {
          throw new Error(
            "Failed to load offers"
          );
        }

        const data = await res.json();

        if (Array.isArray(data)) {
          setOffers(data);
        } else if (
          Array.isArray(data.offers)
        ) {
          setOffers(data.offers);
        }
      } catch (error) {
        console.error(
          "Failed to load offers:",
          error
        );
      }
    }

    loadOffers();

    /*
     * Refresh offers periodically so
     * admin changes appear without
     * requiring a full restart.
     */
    const interval = setInterval(
      loadOffers,
      30000
    );

    return () => clearInterval(interval);
  }, []);

  /*
   * Add product to cart
   */
  function addToCart(item: CartItem) {
    setCart((prev) => {
      const existing = prev.find(
        (i) =>
          i.id === item.id &&
          i.size === item.size
      );

      const currentProductQuantity = prev
        .filter((cartItem) => cartItem.id === item.id)
        .reduce((sum, cartItem) => sum + cartItem.quantity, 0);

      const quantityToAdd = Math.min(
        item.quantity,
        Math.max(0, item.stock - currentProductQuantity)
      );

      if (quantityToAdd === 0) {
        return prev;
      }

      if (existing) {
        return prev.map((i) =>
          i.id === item.id &&
          i.size === item.size
            ? {
              ...i,
              stock: item.stock,
              quantity:
                  i.quantity + quantityToAdd,
              }
            : i
        );
      }

      return [
        ...prev,
        {
          ...item,
          quantity: quantityToAdd,
        },
      ];
    });
  }

  /*
   * Remove product
   */
  function removeFromCart(
    id: string,
    size: string
  ) {
    setCart((prev) =>
      prev.filter(
        (item) =>
          !(
            item.id === id &&
            item.size === size
          )
      )
    );
  }

  /*
   * Increase quantity
   */
  function increaseQuantity(
    id: string,
    size: string
  ) {
    setCart((prev) => {
      const currentProductQuantity = prev
        .filter((item) => item.id === id)
        .reduce((sum, item) => sum + item.quantity, 0);

      return prev.map((item) =>
        item.id === id &&
        item.size === size &&
        currentProductQuantity < item.stock
          ? {
              ...item,
              quantity: item.quantity + 1,
            }
          : item
      );
    });
  }

  /*
   * Decrease quantity
   */
  function decreaseQuantity(
    id: string,
    size: string
  ) {
    setCart((prev) =>
      prev
        .map((item) =>
          item.id === id &&
          item.size === size
            ? {
                ...item,
                quantity:
                  item.quantity - 1,
              }
            : item
        )
        .filter(
          (item) =>
            item.quantity > 0
        )
    );
  }

  /*
   * Clear cart
   */
  function clearCart() {
    setCart([]);
  }

  /*
   * Total number of shirts
   *
   * Example:
   *
   * Shirt A x2
   * Shirt B x1
   *
   * totalItems = 3
   */
  const totalItems = cart.reduce(
    (sum, item) =>
      sum + item.quantity,
    0
  );

  /*
   * Cart subtotal before offer
   */
  const subtotal = cart.reduce(
    (sum, item) =>
      sum +
      Number(item.price) *
        item.quantity,
    0
  );

  /*
   * Find the best qualifying offer
   *
   * Example:
   *
   * Buy 2 = 10%
   * Buy 3 = 20%
   *
   * Customer buys 3
   *
   * Result = 20%
   */
  const activeOffer =
    offers
      .filter(
        (offer) =>
          Number(offer.active) === 1 &&
          Number(
            offer.applies_to_all
          ) === 1 &&
          totalItems >=
            Number(
              offer.min_quantity
            )
      )
      .sort(
        (a, b) =>
          Number(
            b.discount_percent
          ) -
          Number(
            a.discount_percent
          )
      )[0] || null;

  /*
   * Current discount percentage
   */
  const discountPercent =
    activeOffer
      ? Number(
          activeOffer.discount_percent
        )
      : 0;

  /*
   * Actual money saved
   */
  const discountAmount =
    subtotal *
    (discountPercent / 100);

  /*
   * Final cart total
   */
  const totalPrice =
    subtotal - discountAmount;

  return (
    <CartContext.Provider
      value={{
        cart,

        addToCart,

        removeFromCart,

        increaseQuantity,

        decreaseQuantity,

        clearCart,

        totalItems,

        subtotal,

        discountPercent,

        discountAmount,

        totalPrice,

        activeOffer,

        offers,

        isCartOpen,

        setIsCartOpen:
          setIsCartOpenState,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context =
    useContext(CartContext);

  if (!context) {
    throw new Error(
      "useCart must be used inside CartProvider"
    );
  }

  return context;
}
