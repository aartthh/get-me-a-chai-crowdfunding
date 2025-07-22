"use client"
import React, { useState, useRef, useEffect } from 'react'
import { Camera, Upload, User, Mail, AtSign, CreditCard, Lock, CheckCircle, Settings, Palette, Image } from 'lucide-react'
import { useSession } from "next-auth/react"
import { useRouter } from 'next/navigation'
import { signIn, update, signOut } from "next-auth/react"
import { fetchuser } from '@/actions/useractions'

const Dashboard = () => {
    const { data: session, status, update } = useSession()
    const router = useRouter()

    const [form, setForm] = useState({
        name: '',
        email: '',
        username: '',
        profilepic: '',
        coverpic: '',
        razorpayid: '',
        razorpaysecret: ''
    })
    const [loading, setLoading] = useState(false)
    const [preview, setPreview] = useState({ profile: '', cover: '' })
    const [uploading, setUploading] = useState({ profile: false, cover: false })
    const [activeSection, setActiveSection] = useState('profile')
    const [isVisible, setIsVisible] = useState(false)
    const fileInputRef = useRef({ profile: null, cover: null })

    useEffect(() => {
        // Don't show the dashboard until we know the authentication status
        if (status === "loading") {
            return; // Still loading, don't do anything yet
        }

        // If not authenticated, redirect to login immediately
        if (status === "unauthenticated" || !session) {
            router.push('/login');
            return;
        }

        // Only if authenticated, show the dashboard and fetch data
        if (status === "authenticated" && session) {
            setIsVisible(true);
            getData();
        }
    }, [status, session, router])

    const getData = async () => {
        try {
            if (!session?.user?.email) {
                console.error("No session or user email available");
                return;
            }

            console.log("Fetching user data for:", session.user.email);
            const userData = await fetchuser(session.user.email);

            if (userData) {
                console.log("User data fetched:", userData);
                setForm({
                    name: userData.name || '',
                    email: userData.email || '',
                    username: userData.to_user || '',
                    profilepic: userData.profilepic || '',
                    coverpic: userData.coverpic || '',
                    razorpayid: userData.razorpayid || '',
                    razorpaysecret: userData.razorpaysecret || ''
                });

                // Set preview images if they exist
                setPreview({
                    profile: userData.profilepic || '',
                    cover: userData.coverpic || ''
                });
            } else {
                // Fallback to session data
                setForm(prevForm => ({
                    ...prevForm,
                    name: session.user.name || '',
                    email: session.user.email || '',
                    username: session.user.to_user || session.user.email.split('@')[0]
                }));
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
            // Fallback to session data
            setForm(prevForm => ({
                ...prevForm,
                name: session.user.name || '',
                email: session.user.email || '',
                username: session.user.username || session.user.email.split('@')[0]
            }));
        }
    };

    // File upload function
    const uploadFile = async (file, type) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('type', type);
        formData.append('email', session.user.email);

        try {
            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error('Upload failed');
            }

            const data = await response.json();
            return data.url;
        } catch (error) {
            console.error('Upload error:', error);
            throw error;
        }
    };

    // Handle file selection and upload
    const handleFileChange = async (e, type) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (5MB limit)
        if (file.size > 5 * 1024 * 1024) {
            alert('File size should be less than 5MB');
            return;
        }

        setUploading({ ...uploading, [type]: true });

        try {
            // Create preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreview(prev => ({ ...prev, [type]: reader.result }));
            };
            reader.readAsDataURL(file);

            // Upload file
            const imageUrl = await uploadFile(file, type);

            // Update form with uploaded image URL
            const fieldName = type === 'profile' ? 'profilepic' : 'coverpic';
            setForm(prev => ({ ...prev, [fieldName]: imageUrl }));

        } catch (error) {
            console.error('File upload failed:', error);
            alert('Failed to upload image. Please try again.');
        } finally {
            setUploading({ ...uploading, [type]: false });
        }
    };

    const triggerFileInput = (type) => {
        fileInputRef.current[type]?.click();
    };

    // Handle form submission
    const handleSubmit = async () => {
        setLoading(true);

        try {
            const oldUsername = session.user.to_user;

            const response = await fetch('/api/updateProfile', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...form,
                    email: session.user.email,
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update profile');
            }

            const result = await response.json();

            if (result.success) {
                // If username changed, sign out and redirect to login
                if (oldUsername !== form.username) {
                    alert('Profile updated successfully!');
                    await update();
                } else {
                    alert('Profile updated successfully!');
                    // Optionally refresh the session to get updated data
                    window.location.reload();
                }
            } else {
                throw new Error(result.error || 'Update failed');
            }
        } catch (error) {
            console.error('Profile update error:', error);
            alert(`Failed to update profile: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const sections = [
        { id: 'profile', label: 'Profile', icon: User },
        { id: 'payment', label: 'Payment', icon: CreditCard },
    ]

    // Show loading screen while checking authentication
    if (status === "loading") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    // If not authenticated, don't render anything (redirect will happen in useEffect)
    if (status === "unauthenticated" || !session) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="mt-4 text-gray-600 font-medium">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    // Only render the dashboard if authenticated
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 mt-16">
            {/* Animated Background Elements */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-pink-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
            </div>

            <div className={`relative z-10 transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {/* Header */}
                <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            <div className="flex items-center space-x-4">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                                    <Palette className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold text-gray-900">Creator Studio</h1>
                                    <p className="text-sm text-gray-500">Manage your creator account</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                                    <CheckCircle className="w-5 h-5 text-green-600" />
                                </div>
                                <span className="text-sm text-green-600 font-medium">All changes saved</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                        {/* Sidebar Navigation */}
                        <div className="lg:col-span-1">
                            <nav className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-4 sticky top-24">
                                <div className="space-y-2">
                                    {sections.map((section, index) => {
                                        const Icon = section.icon
                                        return (
                                            <button
                                                key={section.id}
                                                onClick={() => setActiveSection(section.id)}
                                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-300 transform hover:scale-105 ${activeSection === section.id
                                                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                                                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                                                    }`}
                                                style={{ animationDelay: `${index * 100}ms` }}
                                            >
                                                <Icon className="w-5 h-5" />
                                                <span className="font-medium">{section.label}</span>
                                            </button>
                                        )
                                    })}
                                </div>
                            </nav>
                        </div>

                        {/* Main Content */}
                        <div className="lg:col-span-3">
                            <div className="space-y-8">
                                {/* Cover Photo Section */}
                                <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 overflow-hidden transform transition-all duration-500 hover:shadow-2xl">
                                    <div className="relative h-64 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600">
                                        <div
                                            className="absolute inset-0 flex items-center justify-center cursor-pointer bg-black/20 hover:bg-black/30 transition-all duration-300 backdrop-blur-sm"
                                            onClick={() => triggerFileInput('cover')}
                                        >
                                            {uploading.cover ? (
                                                <div className="text-center">
                                                    <div className="w-12 h-12 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto"></div>
                                                    <p className="mt-4 text-sm text-white font-medium">Uploading cover...</p>
                                                </div>
                                            ) : preview.cover || form.coverpic ? (
                                                <>
                                                    <img
                                                        src={preview.cover || form.coverpic}
                                                        alt="Cover"
                                                        className="w-full h-full object-cover"
                                                    />
                                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                                                        <div className="bg-black/50 rounded-full p-3">
                                                            <Camera className="w-6 h-6 text-white" />
                                                        </div>
                                                    </div>
                                                </>
                                            ) : (
                                                <div className="text-center">
                                                    <div className="bg-white/20 rounded-full p-4 mx-auto backdrop-blur-sm">
                                                        <Image className="w-8 h-8 text-white" />
                                                    </div>
                                                    <p className="mt-4 text-sm text-white font-medium">Click to add cover photo</p>
                                                    <p className="text-xs text-white/80">Recommended: 1200x400px</p>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                ref={el => fileInputRef.current.cover = el}
                                                onChange={(e) => handleFileChange(e, 'cover')}
                                                className="hidden"
                                                accept="image/*"
                                                disabled={uploading.cover}
                                            />
                                        </div>

                                        {/* Profile Picture */}
                                        <div className="absolute -bottom-16 left-8">
                                            <div
                                                className="w-32 h-32 rounded-full border-4 border-white bg-white shadow-xl flex items-center justify-center overflow-hidden cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl"
                                                onClick={() => triggerFileInput('profile')}
                                            >
                                                {uploading.profile ? (
                                                    <div className="text-center">
                                                        <div className="w-8 h-8 border-3 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                                                        <p className="mt-2 text-xs text-gray-500 font-medium">Uploading...</p>
                                                    </div>
                                                ) : preview.profile || form.profilepic ? (
                                                    <>
                                                        <img
                                                            src={preview.profile || form.profilepic}
                                                            alt="Profile"
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300 bg-black/50 rounded-full">
                                                            <Camera className="w-6 h-6 text-white" />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <div className="text-center">
                                                        <User className="w-10 h-10 text-gray-400 mx-auto" />
                                                        <p className="mt-1 text-xs text-gray-500">Add photo</p>
                                                    </div>
                                                )}
                                                <input
                                                    type="file"
                                                    ref={el => fileInputRef.current.profile = el}
                                                    onChange={(e) => handleFileChange(e, 'profile')}
                                                    className="hidden"
                                                    accept="image/*"
                                                    disabled={uploading.profile}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="p-8 pt-20">
                                        <div className="flex items-center justify-between mb-6">
                                            <div>
                                                <h2 className="text-2xl font-bold text-gray-900">{form.name || 'Your Name'}</h2>
                                                <p className="text-gray-500">@{form.username || 'username'}</p>
                                            </div>
                                            <div className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-2 rounded-full text-sm font-medium shadow-lg">
                                                Active Creator
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Form Sections */}
                                {activeSection === 'profile' && (
                                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-8 transform transition-all duration-500 hover:shadow-2xl">
                                        <div className="mb-6">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">Profile Information</h3>
                                            <p className="text-gray-600">Update your personal details and public profile</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            {[
                                                { label: "Full Name", name: "name", type: "text", icon: User, required: true },
                                                { label: "Email Address", name: "email", type: "email", icon: Mail, disabled: true },
                                                { label: "Username", name: "username", type: "text", icon: AtSign, required: true },
                                            ].map((field, index) => {
                                                const Icon = field.icon
                                                return (
                                                    <div key={field.name} className="group" style={{ animationDelay: `${index * 100}ms` }}>
                                                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                            {field.label} {field.required && <span className="text-red-500">*</span>}
                                                        </label>
                                                        <div className="relative">
                                                            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                                <Icon className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                                                            </div>
                                                            <input
                                                                type={field.type}
                                                                name={field.name}
                                                                value={form[field.name]}
                                                                onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                                                                disabled={field.disabled}
                                                                required={field.required}
                                                                className={`w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${field.disabled
                                                                    ? 'bg-gray-50 cursor-not-allowed text-gray-500'
                                                                    : 'bg-white hover:border-gray-300 focus:bg-white'
                                                                    }`}
                                                                placeholder={`Enter your ${field.label.toLowerCase()}`}
                                                            />
                                                        </div>
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                )}

                                {activeSection === 'payment' && (
                                    <div className="bg-white/80 backdrop-blur-xl rounded-2xl shadow-xl border border-gray-200/50 p-8 transform transition-all duration-500 hover:shadow-2xl">
                                        <div className="mb-6">
                                            <h3 className="text-xl font-bold text-gray-900 mb-2">Payment Settings</h3>
                                            <p className="text-gray-600">Configure your payment processing credentials</p>
                                        </div>

                                        <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-xl border border-blue-200/50 mb-6">
                                            <div className="flex items-center space-x-3 mb-4">
                                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                                    <CreditCard className="w-5 h-5 text-white" />
                                                </div>
                                                <div>
                                                    <h4 className="font-semibold text-gray-900">Razorpay Integration</h4>
                                                    <p className="text-sm text-gray-600">Secure payment processing for your supporters</p>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                {[
                                                    { label: "Razorpay Key ID", name: "razorpayid", type: "text", icon: CreditCard },
                                                    { label: "Razorpay Key Secret", name: "razorpaysecret", type: "password", icon: Lock },
                                                ].map((field, index) => {
                                                    const Icon = field.icon
                                                    return (
                                                        <div key={field.name} className="group" style={{ animationDelay: `${index * 100}ms` }}>
                                                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                                                {field.label}
                                                            </label>
                                                            <div className="relative">
                                                                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                                                                    <Icon className="w-5 h-5 text-gray-400 group-focus-within:text-blue-600 transition-colors duration-200" />
                                                                </div>
                                                                <input
                                                                    type={field.type}
                                                                    name={field.name}
                                                                    value={form[field.name]}
                                                                    onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
                                                                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-300"
                                                                    placeholder={field.name === 'razorpayid' ? 'rzp_test_xxxxxxxxxx' : 'Enter your secret key'}
                                                                />
                                                            </div>
                                                        </div>
                                                    )
                                                })}
                                                <div className="bg-blue-100 border border-blue-200 rounded-lg p-3 mt-4">
                                                    <p className="text-xs text-blue-700 flex items-center">
                                                        <Lock className="w-4 h-4 mr-2" />
                                                        Your credentials are encrypted and stored securely using industry-standard security practices.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Save Button */}
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleSubmit}
                                        disabled={loading || uploading.profile || uploading.cover}
                                        className={`group relative px-8 py-4 rounded-xl font-semibold text-white shadow-lg transform transition-all duration-300 ${loading || uploading.profile || uploading.cover
                                            ? 'bg-gray-400 cursor-not-allowed'
                                            : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 hover:scale-105 hover:shadow-xl'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
                                    >
                                        {loading ? (
                                            <span className="flex items-center">
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3"></div>
                                                Saving Changes...
                                            </span>
                                        ) : uploading.profile || uploading.cover ? (
                                            <span className="flex items-center">
                                                <Upload className="w-5 h-5 mr-3 animate-bounce" />
                                                Uploading...
                                            </span>
                                        ) : (
                                            <span className="flex items-center">
                                                <CheckCircle className="w-5 h-5 mr-3 group-hover:scale-110 transition-transform duration-200" />
                                                Save Changes
                                            </span>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard