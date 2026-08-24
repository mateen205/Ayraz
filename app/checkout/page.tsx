"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { useCart } from "../components/CartContext";

import ContactForm from "./components/ContactForm";
import ShippingForm from "./components/ShippingForm";
import DeliveryMethod from "./components/DeliveryMethod";
import PaymentSection from "./components/PaymentSection";
import OrderNotes from "./components/OrderNotes";
import OrderSummary from "./components/OrderSummary";
import ReturnPolicy from "./components/ReturnPolicy";

export default function CheckoutPage() {

  const router = useRouter();

  const {
    cart,
    subtotal,
    discountPercent,
    discountAmount,
    totalPrice,
    activeOffer,
    clearCart,
  } = useCart();

  // Customer

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  // Shipping

  const [country] = useState("Pakistan");

  const [province, setProvince] =
    useState("Punjab");

  const [city, setCity] = useState("");

  const [postalCode, setPostalCode] =
    useState("");

  const [address, setAddress] =
    useState("");

  // Delivery

  const [deliveryMethod, setDeliveryMethod] =
    useState("standard");

  // Payment

  const [paymentMethod, setPaymentMethod] =
    useState("cod");

  // Notes

  const [notes, setNotes] = useState("");

  const [loading, setLoading] =
    useState(false);

  const shipping =
    deliveryMethod === "express"
      ? 350
      : 0;

  async function placeOrder() {

    if (!name.trim())
      return alert("Enter your name.");

    if (!phone.trim())
      return alert("Enter phone number.");

    if (!city.trim())
      return alert("Enter city.");

    if (!address.trim())
      return alert("Enter address.");

    if (cart.length === 0)
      return alert("Your cart is empty.");

    setLoading(true);

    try {

      const response =
        await fetch("/api/orders", {

          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            customer_name: name,

            phone,

            email,

            city,

            province,

            postal_code: postalCode,

            address,

            payment_method:
              paymentMethod,

            delivery_method:
              deliveryMethod,

            notes,

            items: cart,

          }),

        });

      const data =
        await response.json();

      if (!response.ok) {

        throw new Error(
          data.message ||
          "Order Failed"
        );

      }

      clearCart();

      router.push("/success");

    }

    catch (error: any) {

      alert(error.message);

    }

    finally {

      setLoading(false);

    }

  }

  return (

    <main className="min-h-screen bg-black text-white pt-28 pb-24">

      <div className="mx-auto max-w-7xl px-5 lg:px-8">

        <h1 className="mb-12 text-5xl font-bold">
          Checkout
        </h1>

        <div className="grid xl:grid-cols-3 gap-10">

          {/* LEFT */}

          <div className="xl:col-span-2 space-y-8">

            <ContactForm

              name={name}
              setName={setName}

              phone={phone}
              setPhone={setPhone}

              email={email}
              setEmail={setEmail}

            />

            <ShippingForm

              country={country}

              province={province}
              setProvince={setProvince}

              city={city}
              setCity={setCity}

              postalCode={postalCode}
              setPostalCode={setPostalCode}

              address={address}
              setAddress={setAddress}

            />

            <DeliveryMethod

              deliveryMethod={
                deliveryMethod
              }

              setDeliveryMethod={
                setDeliveryMethod
              }

            />

            <PaymentSection

              paymentMethod={
                paymentMethod
              }

              setPaymentMethod={
                setPaymentMethod
              }

            />

            <OrderNotes

              notes={notes}

              setNotes={setNotes}

            />

            <ReturnPolicy />

          </div>

          {/* RIGHT */}

          <OrderSummary

            cart={cart}

            subtotal={subtotal}

            discountPercent={discountPercent}

            discountAmount={discountAmount}

            activeOffer={activeOffer}

            discountedSubtotal={totalPrice}

            shipping={shipping}

            loading={loading}

            placeOrder={placeOrder}

          />

        </div>

      </div>

    </main>

  );

}
