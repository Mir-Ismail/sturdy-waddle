// pages/Checkout.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
    FiPackage,
    FiMapPin,
    FiPhone,
    FiMail,
    FiUser,
    FiShoppingBag,
    FiCheckCircle,
    FiTruck,
    FiCreditCard,
    FiHome,
    FiAlertCircle,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

const Checkout = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useAuth();
    const [loading, setLoading] = useState(true);
    const [orderPlaced, setOrderPlaced] = useState(false);
    const [orderDetails, setOrderDetails] = useState(null);
    const [cartData, setCartData] = useState(null);

    const [shippingAddress, setShippingAddress] = useState({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "Pakistan",
    });

    const [notes, setNotes] = useState("");
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (!isAuthenticated) {
            navigate("/login");
            return;
        }

        fetchCart();

        // Pre-fill user information if available
        if (user) {
            const nameParts = (user.username || "").split(" ");
            setShippingAddress((prev) => ({
                ...prev,
                firstName: nameParts[0] || "",
                lastName: nameParts.slice(1).join(" ") || "",
                email: user.email || "",
            }));
        }
    }, [isAuthenticated, navigate, user]);

    const fetchCart = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("token");
            const res = await axios.get("http://localhost:5000/api/cart", {
                headers: { Authorization: `Bearer ${token}` },
            });

            // Extract cart data from response
            const cart = res.data?.cart || res.data?.data?.cart || res.data;

            if (!cart || !cart.items || cart.items.length === 0) {
                navigate("/cart");
                return;
            }

            setCartData(cart);
        } catch (error) {
            console.error("Error fetching cart:", error);
            alert("Failed to load cart. Please try again.");
            navigate("/cart");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setShippingAddress({
            ...shippingAddress,
            [e.target.name]: e.target.value,
        });
        if (errors[e.target.name]) {
            setErrors({ ...errors, [e.target.name]: "" });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!shippingAddress.firstName.trim())
            newErrors.firstName = "First name is required";
        if (!shippingAddress.lastName.trim())
            newErrors.lastName = "Last name is required";
        if (!shippingAddress.email.trim())
            newErrors.email = "Email is required";
        else if (!/\S+@\S+\.\S+/.test(shippingAddress.email))
            newErrors.email = "Email is invalid";
        if (!shippingAddress.phone.trim())
            newErrors.phone = "Phone is required";
        else if (!/^[\d\s\-\+\(\)]+$/.test(shippingAddress.phone))
            newErrors.phone = "Phone number is invalid";
        if (!shippingAddress.street.trim())
            newErrors.street = "Street address is required";
        if (!shippingAddress.city.trim())
            newErrors.city = "City is required";
        if (!shippingAddress.state.trim())
            newErrors.state = "State/Province is required";
        if (!shippingAddress.zipCode.trim())
            newErrors.zipCode = "Postal code is required";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) return;

        setLoading(true);
        try {
            const token = localStorage.getItem("token");
            const orderData = {
                shippingAddress: {
                    ...shippingAddress,
                    country: "Pakistan",
                },
                paymentMethod: "cash_on_delivery",
                notes: notes || "",
            };

            const response = await axios.post(
                "http://localhost:5000/api/user/orders",
                orderData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setOrderDetails(response.data.order);
            setOrderPlaced(true);
        } catch (error) {
            console.error("Error placing order:", error);
            alert(
                error.response?.data?.message || "Failed to place order. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40">
                <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mb-6" />
                <p className="text-gray-700 font-semibold text-lg">Loading checkout...</p>
            </div>
        );
    }

    if (orderPlaced) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white rounded-2xl shadow-2xl border border-gray-200/80 p-8 md:p-12 max-w-2xl w-full text-center"
                >
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.2, type: "spring" }}
                        className="w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
                    >
                        <FiCheckCircle className="w-12 h-12 text-white" />
                    </motion.div>

                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-gray-600 text-lg mb-6">
                        Thank you for your order. We've received your order and will process it shortly.
                    </p>

                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 mb-8 border border-blue-200/50">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <FiTruck className="w-6 h-6 text-blue-600" />
                            <h2 className="text-xl font-bold text-gray-900">
                                Estimated Delivery
                            </h2>
                        </div>
                        <p className="text-2xl font-bold text-blue-600 mb-2">
                            2-3 Working Days
                        </p>
                        <p className="text-gray-600 text-sm">
                            Your order will be delivered to your doorstep
                        </p>
                    </div>

                    {orderDetails && (
                        <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                            <h3 className="font-bold text-gray-900 mb-4 text-center">
                                Order Details
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Order ID:</span>
                                    <span className="font-mono font-semibold text-gray-900">
                                        #{orderDetails._id?.slice(-8)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal:</span>
                                    <span className="font-semibold text-gray-900">
                                        PKR {orderDetails.subtotal?.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Shipping:</span>
                                    <span className="font-semibold text-gray-900">
                                        {orderDetails.shippingCost === 0 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            `PKR ${orderDetails.shippingCost}`
                                        )}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Tax:</span>
                                    <span className="font-semibold text-gray-900">
                                        PKR {orderDetails.tax?.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-300">
                                    <span className="text-gray-900 font-bold">Total:</span>
                                    <span className="font-bold text-gray-900">
                                        PKR {orderDetails.total?.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between pt-2 border-t border-gray-300">
                                    <span className="text-gray-600">Payment Method:</span>
                                    <span className="font-semibold text-gray-900">
                                        Cash on Delivery
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Status:</span>
                                    <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-bold">
                                        {orderDetails.status}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3">
                        <button
                            onClick={() => navigate("/")}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg hover:shadow-blue-500/30 transition-all"
                        >
                            <FiHome className="w-5 h-5" />
                            Back to Home
                        </button>
                        <button
                            onClick={() => navigate("/products")}
                            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-white border-2 border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all"
                        >
                            <FiShoppingBag className="w-5 h-5" />
                            Continue Shopping
                        </button>
                    </div>
                </motion.div>
            </div>
        );
    }

    if (!cartData || !cartData.items || cartData.items.length === 0) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40">
                <FiAlertCircle className="w-16 h-16 text-gray-400 mb-4" />
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Cart is Empty</h2>
                <p className="text-gray-600 mb-6">Add items to your cart to checkout</p>
                <button
                    onClick={() => navigate("/products")}
                    className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
                >
                    Start Shopping
                </button>
            </div>
        );
    }

    const subtotal = cartData.totalPrice || 0;
    const shippingCost = subtotal > 5000 ? 0 : 200;
    const tax = Math.round(subtotal * 0.05);
    const total = subtotal + shippingCost + tax;

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/40 py-8 md:py-12">
            <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        Checkout
                    </h1>
                    <p className="text-gray-600">
                        Complete your order and get delivery in 2-3 working days
                    </p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Shipping Information */}
                    <div className="lg:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white rounded-2xl shadow-xl border border-gray-200/80 p-6 md:p-8"
                        >
                            <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
                                    <FiMapPin className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Shipping Information
                                    </h2>
                                    <p className="text-gray-600 text-sm">
                                        Enter your delivery details
                                    </p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">
                                            <FiUser className="inline w-4 h-4 mr-2" />
                                            First Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="firstName"
                                            value={shippingAddress.firstName}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all ${errors.firstName ? "border-red-500" : "border-gray-200"
                                                }`}
                                            placeholder="John"
                                        />
                                        {errors.firstName && (
                                            <p className="text-red-600 text-xs mt-1">{errors.firstName}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">
                                            Last Name *
                                        </label>
                                        <input
                                            type="text"
                                            name="lastName"
                                            value={shippingAddress.lastName}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all ${errors.lastName ? "border-red-500" : "border-gray-200"
                                                }`}
                                            placeholder="Doe"
                                        />
                                        {errors.lastName && (
                                            <p className="text-red-600 text-xs mt-1">{errors.lastName}</p>
                                        )}
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">
                                            <FiMail className="inline w-4 h-4 mr-2" />
                                            Email *
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={shippingAddress.email}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all ${errors.email ? "border-red-500" : "border-gray-200"
                                                }`}
                                            placeholder="john@example.com"
                                        />
                                        {errors.email && (
                                            <p className="text-red-600 text-xs mt-1">{errors.email}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">
                                            <FiPhone className="inline w-4 h-4 mr-2" />
                                            Phone Number *
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={shippingAddress.phone}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all ${errors.phone ? "border-red-500" : "border-gray-200"
                                                }`}
                                            placeholder="+92 300 1234567"
                                        />
                                        {errors.phone && (
                                            <p className="text-red-600 text-xs mt-1">{errors.phone}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">
                                        <FiMapPin className="inline w-4 h-4 mr-2" />
                                        Street Address *
                                    </label>
                                    <input
                                        type="text"
                                        name="street"
                                        value={shippingAddress.street}
                                        onChange={handleChange}
                                        className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all ${errors.street ? "border-red-500" : "border-gray-200"
                                            }`}
                                        placeholder="House/Flat number, Street name"
                                    />
                                    {errors.street && (
                                        <p className="text-red-600 text-xs mt-1">{errors.street}</p>
                                    )}
                                </div>

                                <div className="grid md:grid-cols-3 gap-5">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">
                                            City *
                                        </label>
                                        <input
                                            type="text"
                                            name="city"
                                            value={shippingAddress.city}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all ${errors.city ? "border-red-500" : "border-gray-200"
                                                }`}
                                            placeholder="Multan"
                                        />
                                        {errors.city && (
                                            <p className="text-red-600 text-xs mt-1">{errors.city}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">
                                            State/Province *
                                        </label>
                                        <input
                                            type="text"
                                            name="state"
                                            value={shippingAddress.state}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all ${errors.state ? "border-red-500" : "border-gray-200"
                                                }`}
                                            placeholder="Punjab"
                                        />
                                        {errors.state && (
                                            <p className="text-red-600 text-xs mt-1">{errors.state}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-sm font-bold text-gray-900 mb-2">
                                            Postal Code *
                                        </label>
                                        <input
                                            type="text"
                                            name="zipCode"
                                            value={shippingAddress.zipCode}
                                            onChange={handleChange}
                                            className={`w-full px-4 py-3 bg-gray-50 border-2 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all ${errors.zipCode ? "border-red-500" : "border-gray-200"
                                                }`}
                                            placeholder="60000"
                                        />
                                        {errors.zipCode && (
                                            <p className="text-red-600 text-xs mt-1">{errors.zipCode}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-900 mb-2">
                                        Order Notes (Optional)
                                    </label>
                                    <textarea
                                        value={notes}
                                        onChange={(e) => setNotes(e.target.value)}
                                        rows="3"
                                        className="w-full px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:bg-white focus:ring-4 focus:ring-blue-500/10 outline-none transition-all resize-none"
                                        placeholder="Any special instructions for delivery..."
                                    />
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white rounded-2xl shadow-xl border border-gray-200/80 p-6 sticky top-8"
                        >
                            <h2 className="text-2xl font-bold text-gray-900 mb-6">
                                Order Summary
                            </h2>

                            <div className="space-y-4 mb-6 pb-6 border-b border-gray-200 max-h-64 overflow-y-auto">
                                {cartData.items.map((item) => (
                                    <div key={item._id} className="flex gap-3">
                                        <img
                                            src={item.product?.images?.[0] || "/placeholder-product.jpg"}
                                            alt={item.product?.name || "Product"}
                                            className="w-16 h-16 object-cover rounded-lg bg-gray-100"
                                        />
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-semibold text-gray-900 text-sm line-clamp-1">
                                                {item.product?.name || "Product"}
                                            </h3>
                                            <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                                            <p className="font-bold text-gray-900 text-sm">
                                                PKR {((item.product?.price || 0) * item.quantity).toLocaleString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 mb-6 pb-6 border-b border-gray-200">
                                <div className="flex justify-between text-gray-700">
                                    <span>Subtotal ({cartData.totalItems} items)</span>
                                    <span className="font-semibold">
                                        PKR {subtotal.toLocaleString()}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-700">
                                    <span>Shipping Fee</span>
                                    <span className="font-semibold">
                                        {shippingCost === 0 ? (
                                            <span className="text-green-600">FREE</span>
                                        ) : (
                                            `PKR ${shippingCost}`
                                        )}
                                    </span>
                                </div>
                                {shippingCost === 0 && (
                                    <p className="text-xs text-green-600 font-medium">
                                        🎉 Free shipping on orders above PKR 5,000
                                    </p>
                                )}
                                <div className="flex justify-between text-gray-700">
                                    <span>Tax (5%)</span>
                                    <span className="font-semibold">PKR {tax.toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center mb-6 pb-6 border-b border-gray-200">
                                <span className="text-xl font-bold text-gray-900">Total</span>
                                <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                                    PKR {total.toLocaleString()}
                                </span>
                            </div>

                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 mb-6 border border-blue-200/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <FiCreditCard className="w-5 h-5 text-blue-600" />
                                    <span className="font-bold text-gray-900 text-sm">
                                        Payment Method
                                    </span>
                                </div>
                                <p className="text-sm text-gray-700 font-semibold">
                                    Cash on Delivery
                                </p>
                                <p className="text-xs text-gray-600 mt-1">
                                    Pay when you receive your order
                                </p>
                            </div>

                            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 mb-6 border border-green-200/50">
                                <div className="flex items-center gap-2 mb-2">
                                    <FiTruck className="w-5 h-5 text-green-600" />
                                    <span className="font-bold text-gray-900 text-sm">
                                        Delivery Time
                                    </span>
                                </div>
                                <p className="text-sm font-bold text-green-700">
                                    2-3 Working Days
                                </p>
                            </div>

                            <button
                                onClick={handlePlaceOrder}
                                disabled={loading}
                                className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-xl hover:shadow-blue-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {loading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        Processing...
                                    </>
                                ) : (
                                    <>
                                        <FiPackage className="w-5 h-5" />
                                        Place Order
                                    </>
                                )}
                            </button>

                            <p className="text-xs text-gray-500 text-center mt-4">
                                By placing your order, you agree to our terms and conditions
                            </p>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;