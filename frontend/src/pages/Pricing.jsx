import { ArrowLeft, Check, Coins, Loader2 } from 'lucide-react'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'motion/react'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'


const plans = [
    {
        id: "free",
        name: "Free",
        price: '₹0',
        credits: 100,
        description: "Perfect to explore WebCraft AI",
        features: [
            "AI website generation",
            "Responsive html outputs",
            "Basic animations"
        ],
        popular: false,
        button: "Get Started"
    },
    {
        id: "pro",
        name: "Pro",
        price: '₹499',
        credits: 500,
        description: "For serious creators and freelancers",
        features: [
            "Everything in Free",
            "Faster Generations",
            "Edit and regenerate",
            "Download Source code"
        ],
        popular: true,
        button: "Upgrade to Pro"
    },
    {
        id: "enterprise",
        name: "Enterprise",
        price: '₹1499',
        credits: 1000,
        description: "For teams and power users",
        features: [
            "Unlimited Iterations",
            "Highest Priority",
            "Team Collaboration",
            "Dedicated Support"
        ],
        popular: false,
        button: "Contact Sales"
    },
]

const Pricing = () => {
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const [loadingId, setLoadingId] = useState(null)

    const handlePayment = async (plan) => {
        if (plan.id === "free") {
            navigate("/")
            return
        }
        try {  
            setLoadingId(plan.id)
            // Simulate network delay for "payment processing"
            await new Promise(r => setTimeout(r, 1500))
            const result = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/payment/demo`, {
                planId: plan.id,
                credits: plan.credits
            }, { withCredentials: true })
           
            dispatch(setUserData(result.data.user))
            alert(`Demo Payment Successful! Added ${plan.credits} credits to your account.`)
            navigate('/')
        } catch (error) {
            console.log(error)
            alert("Something went wrong with the demo payment.")
        } finally {
            setLoadingId(null)
        }
    }
    return (
        <div className='relative min-h-screen overflow-hidden bg-slate-50 text-slate-900 px-6 pt-16 pb-24'>
            <div className='absolute inset-0 pointer-events-none bg-gradient-to-br from-slate-100 to-white' />
            <button onClick={() => navigate("/")} className='relative z-10 mb-8 flex items-center gap-2 text-sm text-slate-600 hover:text-slate-900 transition'>
                <ArrowLeft size={16} />
                Back
            </button>
            <motion.div
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                className='relative z-10 max-w-4xl mx-auto text-center mb-14'
            >
                <h1 className='text-4xl md:text-5xl font-bold mb-4'>Simple, transparent pricing</h1>
                <p className='text-slate-600 text-lg'>Buy credit once. Build anytime.</p>
            </motion.div>

            <div className='relative z-10 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8'>
                {plans.map((p, i) => (
                    <motion.div
                        key={i}
                        initial={{ oapcity: 0, y: 40 }}
                        whileInView={{ oapcity: 1, y: 0 }}
                        transition={{ delay: i * 0.12 }}
                        whileHover={{ y: -14, scale: 1.03 }}
                        className={`relative rounded-3xl p-8 border backdrop-blur-xl transition-all 
                            ${p.popular ? "border-indigo-500 bg-white shadow-xl shadow-indigo-100" :
                                "border-slate-200 bg-white shadow-sm hover:border-indigo-300 hover:shadow-md"}`}
                    >
                        {p.popular && <span className='absolute top-5 right-5 px-3 py-1 text-xs rounded-full bg-indigo-500 text-white'>Most Popular</span>}
                        <h1 className='text-xl font-semibold mb-2'>{p.name}</h1>
                        <p className='text-slate-500 text-sm mb-6'>{p.description}</p>
                        <div className='flex items-end gap-1 mb-4'>
                            <span className='text-4xl font-bold'>{p.price}</span>
                            <span className='text-sm text-slate-500 mb-1'>/one-time</span>
                        </div>
                        <div className='flex items-center gap-2 mb-8'>
                            <Coins size={18} className='text-yellow-500' />
                            <span className='font-semibold'>{p.credits} Credits</span>
                        </div>
                        <ul className='space-y-3 mb-10'>
                            {p.features.map((f) => (
                                <li key={f} className='flex items-center gap-2 text-sm text-slate-600'>
                                    <Check size={16} className='text-green-500' />
                                    {f}
                                </li>
                            ))}
                        </ul>
                        <motion.button
                            disabled={loadingId === p.id}
                            onClick={() => handlePayment(p)}
                            whileTap={{ scale: 0.96 }}
                            className={`w-full flex justify-center items-center py-3 rounded-xl font-semibold transition ${p.popular ? "bg-indigo-600 text-white hover:bg-indigo-700" :
                                "bg-slate-100 text-slate-800 hover:bg-slate-200"} disabled:opacity-60`}
                        >
                            {loadingId === p.id ? <span className='flex items-center gap-2'><Loader2 className='animate-spin' size={18}/> Processing...</span> : p.button}
                        </motion.button>
                    </motion.div>
                ))}
            </div>
        </div>
    )
}

export default Pricing
