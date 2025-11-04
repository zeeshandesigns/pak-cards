"use client";
import { Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { useState } from "react";
import Image from "next/image";

import { CheckCircle2Icon, ArrowLeftIcon } from "lucide-react";

function CheckoutContent() {
  const searchParams = useSearchParams();
  const productId = searchParams.get("productId");
  const router = useRouter();

  const products = useSelector((state) => state.product.list);
  const product = products.find((p) => p.id === productId);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [paymentProof, setPaymentProof] = useState(null);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const currency = process.env.NEXT_PUBLIC_CURRENCY_SYMBOL || "$";

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-slate-800 mb-4">
            Product not found
          </h2>
          <button
            onClick={() => router.push("/")}
            className="text-green-600 hover:text-green-700 flex items-center gap-2 mx-auto"
          >
            <ArrowLeftIcon size={20} />
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Simulate order placement
    setTimeout(() => {
      setOrderPlaced(true);
      setLoading(false);
    }, 2000);
  };

  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-2xl shadow-xl">
          <div className="flex justify-center mb-6">
            <CheckCircle2Icon size={80} className="text-green-500" />
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-4">
            Order Placed Successfully!
          </h2>
          <p className="text-slate-600 mb-6">
            Your order has been received. You will receive your gift card code
            via email within 10 minutes.
          </p>
          <div className="bg-slate-50 p-4 rounded-lg mb-6">
            <p className="text-sm text-slate-500">Order for:</p>
            <p className="font-semibold text-slate-800">{product.name}</p>
            <p className="text-lg font-bold text-green-600 mt-2">
              {currency}
              {product.price}
            </p>
          </div>
          <button
            onClick={() => router.push("/")}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <button
          onClick={() => router.back()}
          className="text-slate-600 hover:text-slate-800 flex items-center gap-2 mb-6"
        >
          <ArrowLeftIcon size={20} />
          Back
        </button>

        <h1 className="text-3xl font-bold text-slate-800 mb-8">Checkout</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <form
              onSubmit={handleSubmit}
              className="bg-white rounded-xl shadow-sm p-6 space-y-6"
            >
              <div>
                <h2 className="text-xl font-semibold text-slate-800 mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="+92 300 1234567"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Address (Optional)
                    </label>
                    <textarea
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      placeholder="Your address"
                      rows="3"
                    />
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-xl font-semibold text-slate-800 mb-4">
                  Payment Information
                </h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-blue-800">
                    <strong>Bank Transfer Details:</strong>
                    <br />
                    Bank: HBL
                    <br />
                    Account: 1234-5678-9012
                    <br />
                    Account Title: PakCards
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Upload Payment Proof *
                  </label>
                  <input
                    type="file"
                    required
                    accept="image/*"
                    onChange={(e) => setPaymentProof(e.target.files[0])}
                    className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                  <p className="text-xs text-slate-500 mt-2">
                    Upload screenshot of your bank transfer
                  </p>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-4 rounded-lg hover:bg-green-700 transition font-semibold text-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading
                  ? "Processing..."
                  : `Place Order - ${currency}${product.price}`}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 sticky top-4">
              <h2 className="text-xl font-semibold text-slate-800 mb-4">
                Order Summary
              </h2>

              <div className="flex gap-4 mb-6">
                <div className="w-20 h-20 bg-slate-100 rounded-lg flex items-center justify-center shrink-0">
                  {product.images && product.images[0] && (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={60}
                      height={60}
                      className="object-contain"
                    />
                  )}
                </div>
                <div>
                  <h3 className="font-medium text-slate-800 text-sm">
                    {product.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Digital Gift Card
                  </p>
                  <p className="text-sm font-semibold text-slate-800 mt-2">
                    {currency}
                    {product.price}
                  </p>
                </div>
              </div>

              <div className="border-t border-slate-200 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium text-slate-800">
                    {currency}
                    {product.price}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Processing Fee</span>
                  <span className="font-medium text-green-600">FREE</span>
                </div>
                <div className="border-t border-slate-200 pt-3 flex justify-between">
                  <span className="text-lg font-semibold text-slate-800">
                    Total
                  </span>
                  <span className="text-xl font-bold text-green-600">
                    {currency}
                    {product.price}
                  </span>
                </div>
              </div>

              <div className="mt-6 bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-xs text-green-800">
                  ✓ Instant delivery within 10 minutes
                  <br />
                  ✓ 100% secure transaction
                  <br />✓ Original gift card codes
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <p>Loading checkout...</p>
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
}
