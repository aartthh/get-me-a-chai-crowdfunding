"use client"

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import Script from 'next/script';
import { fetchPayments, initiate, fetchuser } from '@/actions/useractions';
import { Heart, Users, Trophy, Star, Coffee, Gift, ChevronRight, Play, Check } from 'lucide-react';

const ModernCreatorHomepage = ({ username }) => {
    const { data: session, status } = useSession();
    const [paymentform, setPaymentform] = useState({});
    const [currentUser, setCurrentUser] = useState({});
    const [Payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isVisible, setIsVisible] = useState(false);

    const actualUsername =
        session?.user?.to_user ||
        username ||
        session?.user?.email?.split("@")[0];

    useEffect(() => {
        setIsVisible(true);
        const loadData = async () => {
            try {
                setLoading(true);

                if (actualUsername) {
                    // Fetch user data
                    const userData = await fetchuser(actualUsername);
                    setCurrentUser(userData || {});

                    // Fetch only successful payments
                    const paymentsData = await fetchPayments(actualUsername);
                    setPayments(paymentsData || []);
                }
            } catch (error) {
                console.error('Failed to load data:', error);
                setCurrentUser({});
                setPayments([]);
            } finally {
                setLoading(false);
            }
        };

        // Only load data if we have a username and session is loaded
        if (status !== 'loading') {
            loadData();
        }
    }, [actualUsername, status]);

    const handleChange = (e) => {
        setPaymentform({ ...paymentform, [e.target.name]: e.target.value });
    };

    const pay = async (amount) => {
        try {
            // Validate required fields
            if (!paymentform.name || paymentform.name.trim() === '') {
                alert('Please enter your name before making a payment');
                return;
            }

            if (!amount || amount <= 0) {
                alert('Please enter a valid amount');
                return;
            }

            if (!actualUsername) {
                alert('Username not found. Please refresh the page.');
                return;
            }

            console.log("Initiating payment with:", { amount, actualUsername, paymentform });

            // Get the order details from server
            let orderData = await initiate(amount, actualUsername, paymentform);

            console.log("Order data received:", orderData);

            if (!orderData || !orderData.key_id) {
                throw new Error("Invalid order data received from server");
            }

            var options = {
                "key": orderData.key_id,
                "amount": orderData.amount,
                "currency": "INR",
                "name": "Buy Me a Chai",
                "description": "Support Creator",
                "image": "/favicon.ico",
                "order_id": orderData.id,

                "prefill": {
                    "name": paymentform.name || "Guest",
                    "email": session?.user?.email || "user@example.com",
                    "contact": "9000090000"
                },
                "notes": {
                    "address": "Razorpay Corporate Office"
                },
                "theme": {
                    "color": "#3399cc"
                },
                "handler": function (response) {
                    fetch('/api/razorpay', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature
                        })
                    }).then(r => {
                        if (r.ok) {
                            alert("Payment confirmed—thank you!");
                            window.location.reload();
                        } else {
                            alert("Payment succeeded but confirmation failed. Please contact support.");
                        }
                    });
                },
                "modal": {
                    "ondismiss": function () {
                        console.log('Payment cancelled');
                    }
                }
            };

            if (typeof Razorpay === 'undefined') {
                throw new Error("Razorpay library not loaded");
            }

            var rzp1 = new Razorpay(options);
            rzp1.on('payment.failed', function (response) {
                console.error("Payment failed:", response.error);
                alert("Payment failed: " + response.error.description);
            });

            rzp1.open();
        } catch (error) {
            console.error("Payment failed:", error);
            alert("Payment initiation failed: " + error.message);
        }
    };

    const membershipTiers = [
        {
            name: "Gaming Enthusiast",
            price: 5,
            benefits: ["Early access to videos", "Discord community", "Monthly Q&A"],
            color: "from-blue-500 to-purple-600",
            icon: "🎮"
        },
        {
            name: "Animation Lover",
            price: 15,
            benefits: ["All previous benefits", "Behind-the-scenes content", "Character sketches", "Vote on storylines"],
            color: "from-purple-500 to-pink-600",
            icon: "🎬",
            popular: true
        },
        {
            name: "VIP Creator",
            price: 50,
            benefits: ["All previous benefits", "Monthly video call", "Custom character design", "Producer credits"],
            color: "from-pink-500 to-red-600",
            icon: "👑"
        }
    ];

    // Show loading state while session is loading
    if (status === 'loading') {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                    <p className="text-white text-xl">Loading...</p>
                </div>
            </div>
        );
    }

    // Show error if no username is available
    if (!actualUsername) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
                <div className="text-center text-white">
                    <h1 className="text-2xl font-bold mb-4">User Not Found</h1>
                    <p className="text-gray-300">Unable to load user profile. Please check the URL or login again.</p>
                </div>
            </div>
        );
    }

    return (
        <>
            <Script src="https://checkout.razorpay.com/v1/checkout.js"></Script>
            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                {/* Hero Section with Cover Image */}
                <div className="relative overflow-hidden">
                    {/* Cover Image - Removed purple overlay */}
                    {currentUser?.coverpic && (
                        <div className="absolute inset-0 z-0">
                            <img
                                src={currentUser.coverpic}
                                alt="Cover"
                                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                            />
                            {/* Subtle dark gradient only at bottom for text readability */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                        </div>
                    )}

                    {/* Animated background elements - Only show if no cover image */}
                    {!currentUser?.coverpic && (
                        <div className="absolute inset-0 opacity-20 z-10">
                            <div className="absolute top-20 left-20 w-32 h-32 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur-xl animate-pulse"></div>
                            <div className="absolute top-40 right-32 w-24 h-24 bg-gradient-to-r from-pink-400 to-red-500 rounded-full blur-lg animate-bounce"></div>
                            <div className="absolute bottom-32 left-1/3 w-40 h-40 bg-gradient-to-r from-green-400 to-blue-500 rounded-full blur-2xl animate-pulse"></div>
                        </div>
                    )}

                    <div className="relative z-20 px-6 pt-20 pb-32">
                        <div className={`max-w-6xl mx-auto transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            {/* Creator Profile */}
                            <div className="text-center mb-16">
                                <div className="relative inline-block mb-8 group">
                                    <div className="w-40 h-40 mx-auto rounded-full bg-gradient-to-r from-purple-500 to-pink-500 p-1 shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:shadow-purple-500/50">
                                        <img
                                            src={currentUser?.profilepic || "https://images.unsplash.com/photo-1596256603429-01eeed02b443?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3"}
                                            alt="Creator Profile"
                                            className="w-full h-full rounded-full object-cover border-4 border-white/20 transition-all duration-300 group-hover:border-white/40"
                                        />
                                    </div>
                                    <div className="absolute -bottom-2 -right-2 bg-green-500 w-10 h-10 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-125 group-hover:bg-green-400">
                                        <div className="w-4 h-4 bg-white rounded-full animate-pulse"></div>
                                    </div>
                                </div>

                                <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight drop-shadow-2xl transition-all duration-300 hover:scale-105 cursor-default">
                                    @{actualUsername}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"> Red Earth®</span>
                                </h1>

                                <p className="text-xl md:text-2xl text-gray-200 mb-8 max-w-3xl mx-auto leading-relaxed drop-shadow-md transition-all duration-300 hover:text-white cursor-default">
                                    {currentUser?.bio || "Creating epic modern warfare gaming content and groundbreaking animated series that redefine storytelling"}
                                </p>

                                <div className="flex flex-wrap justify-center gap-8 text-gray-200 mb-12">
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg cursor-pointer">
                                        <Users className="w-5 h-5 text-purple-400 transition-colors duration-300 hover:text-purple-300" />
                                        <span className="font-semibold">{Payments.length}</span> supporters
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg cursor-pointer">
                                        <Trophy className="w-5 h-5 text-yellow-400 transition-all duration-300 hover:text-yellow-300 hover:rotate-12" />
                                        <span className="font-semibold">836</span> posts
                                    </div>
                                    <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full transition-all duration-300 hover:bg-white/20 hover:scale-105 hover:shadow-lg cursor-pointer">
                                        <Heart className="w-5 h-5 text-red-400 transition-all duration-300 hover:text-red-300 hover:scale-125" />
                                        <span className="font-semibold">15.2K</span> likes
                                    </div>
                                </div>

                                {/* CTA Buttons */}
                                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                    <button className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-full text-lg hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 hover:from-purple-500 hover:to-pink-500 transform hover:-translate-y-1">
                                        Become a Member
                                    </button>
                                    <button className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-full text-lg hover:bg-white/20 transition-all duration-300 flex items-center gap-2 border border-white/20 hover:border-white/40 hover:scale-105 transform hover:-translate-y-1">
                                        <Play className="w-5 h-5 transition-transform duration-300 hover:scale-125" />
                                        Watch Trailer
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Membership Tiers */}
                <div className="px-6 py-20 bg-white/5 backdrop-blur-md">
                    <div className="max-w-6xl mx-auto">
                        <div className="text-center mb-16">
                            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 transition-all duration-300 hover:scale-105 cursor-default">Choose Your Adventure</h2>
                            <p className="text-xl text-gray-300 transition-colors duration-300 hover:text-white cursor-default">Join thousands of fans supporting epic content creation</p>
                        </div>

                        <div className="grid md:grid-cols-3 gap-8">
                            {membershipTiers.map((tier, index) => (
                                <div key={index} className={`relative p-8 rounded-3xl backdrop-blur-md transition-all duration-500 hover:scale-110 hover:-translate-y-4 hover:rotate-1 cursor-pointer group ${tier.popular
                                    ? 'bg-gradient-to-br from-purple-600/20 to-pink-600/20 border-2 border-purple-400 hover:border-purple-300 hover:shadow-2xl hover:shadow-purple-500/50'
                                    : 'bg-white/10 border border-white/20 hover:bg-white/15 hover:border-white/40 hover:shadow-2xl hover:shadow-white/20'
                                    }`}>
                                    {tier.popular && (
                                        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 transition-all duration-300 group-hover:scale-110">
                                            <span className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold animate-pulse">
                                                Most Popular
                                            </span>
                                        </div>
                                    )}

                                    <div className="text-center mb-8">
                                        <div className="text-4xl mb-4 transition-all duration-300 group-hover:scale-125 group-hover:animate-bounce">{tier.icon}</div>
                                        <h3 className="text-2xl font-bold text-white mb-2 transition-colors duration-300 group-hover:text-purple-300">{tier.name}</h3>
                                        <div className="flex items-baseline justify-center">
                                            <span className="text-4xl font-bold text-white transition-all duration-300 group-hover:scale-110 group-hover:text-purple-300">${tier.price}</span>
                                            <span className="text-gray-400 ml-2 transition-colors duration-300 group-hover:text-gray-300">/month</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-4 mb-8">
                                        {tier.benefits.map((benefit, i) => (
                                            <li key={i} className="flex items-center gap-3 text-gray-300 transition-all duration-300 group-hover:text-white group-hover:translate-x-2">
                                                <Check className="w-5 h-5 text-green-400 flex-shrink-0 transition-all duration-300 group-hover:scale-125 group-hover:text-green-300" />
                                                {benefit}
                                            </li>
                                        ))}
                                    </ul>

                                    <button
                                        onClick={() => pay(tier.price)}
                                        className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-300 bg-gradient-to-r ${tier.color} hover:scale-105 hover:shadow-lg transform hover:-translate-y-1 hover:brightness-110`}
                                    >
                                        Join Now
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Support Section */}
                <div className="px-6 py-20">
                    <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
                        {/* Supporters List */}
                        <div className="bg-white/10 backdrop-blur-md rounded-3xl p-8 border border-white/20 transition-all duration-500 hover:scale-105 hover:bg-white/15 hover:border-white/30 hover:shadow-2xl hover:shadow-white/10">
                            <div className="flex items-center gap-3 mb-8">
                                <Trophy className="w-8 h-8 text-yellow-400 transition-all duration-300 hover:scale-125 hover:rotate-12" />
                                <h2 className="text-3xl font-bold text-white transition-colors duration-300 hover:text-yellow-300">Top Supporters</h2>
                            </div>

                            <div className="space-y-6">
                                {loading && (
                                    <div className="text-center py-8">
                                        <div className="animate-spin w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                                        <p className="text-gray-400">Loading supporters...</p>
                                    </div>
                                )}

                                {!loading && Payments.length === 0 && (
                                    <div className="text-center py-8">
                                        <Coffee className="w-16 h-16 text-gray-600 mx-auto mb-4 transition-all duration-300 hover:scale-110 hover:text-gray-500" />
                                        <p className="text-gray-400 transition-colors duration-300 hover:text-gray-300">Be the first to show your support!</p>
                                    </div>
                                )}

                                {!loading && Payments.map((p, i) => (
                                    <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-all duration-300 hover:scale-105 hover:translate-x-2 cursor-pointer group">
                                        <div className="w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-xl transition-all duration-300 group-hover:scale-110">
                                            <img width={48} height={48} src="/avatar.gif" alt="user avatar" className="rounded-full transition-transform duration-300 group-hover:rotate-6" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-semibold text-white transition-colors duration-300 group-hover:text-purple-300">{p.name}</span>
                                                <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-2 py-1 rounded-full text-sm font-bold transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                                                    ₹{p.amount}
                                                </span>
                                            </div>
                                            <p className="text-gray-300 text-sm transition-colors duration-300 group-hover:text-white">"{p.message}"</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Form */}
                        <div className="bg-gradient-to-br from-purple-600/20 to-pink-600/20 backdrop-blur-md rounded-3xl p-8 border border-purple-400/30 transition-all duration-500 hover:scale-105 hover:border-purple-400/50 hover:shadow-2xl hover:shadow-purple-500/20">
                            <div className="flex items-center gap-3 mb-8">
                                <Gift className="w-8 h-8 text-pink-400 transition-all duration-300 hover:scale-125 hover:rotate-12" />
                                <h2 className="text-3xl font-bold text-white transition-colors duration-300 hover:text-pink-300">Support the Creator</h2>
                            </div>

                            <div className="space-y-6">
                                <div>
                                    <label className="block text-gray-300 font-medium mb-2 transition-colors duration-300 hover:text-white">Your Name</label>
                                    <input
                                        onChange={handleChange}
                                        name="name"
                                        value={paymentform.name || ''}
                                        type="text"
                                        className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:bg-white/15 hover:border-white/30 focus:scale-105"
                                        placeholder="Enter your name"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 font-medium mb-2 transition-colors duration-300 hover:text-white">Message (Optional)</label>
                                    <input
                                        onChange={handleChange}
                                        name="message"
                                        value={paymentform.message || ''}
                                        type="text"
                                        className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:bg-white/15 hover:border-white/30 focus:scale-105"
                                        placeholder="Leave an encouraging message"
                                    />
                                </div>

                                <div>
                                    <label className="block text-gray-300 font-medium mb-2 transition-colors duration-300 hover:text-white">Custom Amount</label>
                                    <input
                                        onChange={handleChange}
                                        name="amount"
                                        value={paymentform.amount || ''}
                                        type="number"
                                        min="1"
                                        className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all duration-300 hover:bg-white/15 hover:border-white/30 focus:scale-105"
                                        placeholder="Enter amount (₹)"
                                    />
                                </div>

                                <button
                                    onClick={() => pay(paymentform.amount)}
                                    disabled={!paymentform.name || paymentform.name.trim() === '' || !paymentform.amount}
                                    className="w-full py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-purple-500/50 transform hover:-translate-y-1 hover:from-purple-500 hover:to-pink-500"
                                >
                                    <Heart className="w-5 h-5 transition-all duration-300 hover:scale-125" />
                                    Send Support
                                </button>

                                <div className="grid grid-cols-3 gap-3">
                                    {[10, 20, 30].map(amount => (
                                        <button
                                            key={amount}
                                            onClick={() => pay(amount)}
                                            disabled={!paymentform.name || paymentform.name.trim() === ''}
                                            className="py-3 bg-white/10 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:hover:bg-white/10 hover:scale-110 hover:shadow-lg transform hover:-translate-y-1"
                                        >
                                            ₹{amount}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer CTA */}
                <div className="px-6 py-20 text-center">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-4xl md:text-6xl font-bold text-white mb-6 transition-all duration-300 hover:scale-105 cursor-default">
                            Ready to Join the
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 animate-pulse"> Adventure?</span>
                        </h2>
                        <p className="text-xl text-gray-300 mb-8 transition-colors duration-300 hover:text-white cursor-default">
                            Be part of an exclusive community shaping the future of gaming and animation
                        </p>
                        <button className="px-12 py-6 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xl rounded-full hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-purple-500/50 flex items-center gap-3 mx-auto transform hover:-translate-y-2 hover:from-purple-500 hover:to-pink-500">
                            Start Supporting Now
                            <ChevronRight className="w-6 h-6 transition-transform duration-300 hover:translate-x-1" />
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ModernCreatorHomepage;