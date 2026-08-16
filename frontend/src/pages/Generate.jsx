import { ArrowLeft } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import axios from 'axios'
import { useDispatch, useSelector } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const PHASES = [
    "Analyzing your idea...",
    "Designing layout and structure...",
    "Writing HTML and CSS...",
    "Adding animation and interaction...",
    "Final quality checks..."
]

const Generate = () => {

    const navigate = useNavigate()
    const dispatch = useDispatch()

    const [prompt, setPrompt] = useState("")
    const [loading, setLoading] = useState(false)
    const [progress, setProgress] = useState(0)
    const [phaseIndex, setPhaseIndex] = useState(0)
    const [error, setError] = useState("")
    const {userData} = useSelector(state=>state.user)

    const handleKeyDown = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (prompt.trim() && !loading) {
                handleGenerateWebsite();
            }
        }
    }

    const handleGenerateWebsite = async () => {

        try {

            setLoading(true)

            const res = await axios.post(
                `${import.meta.env.VITE_SERVER_URL}/api/website/generate`,
                { prompt },
                { withCredentials: true }
            )

            setProgress(100)
            console.log(res)
            dispatch(setUserData({...userData, credits:res.data.remainingCredits}))
            navigate(`/editor/${res.data.websiteId}`)

        } catch (error) {

            setError(error.response?.data?.message || "Something went wrong")

        } finally {

            setLoading(false)

        }

    }

    useEffect(() => {

        if (!loading) {
            setPhaseIndex(0)
            setProgress(0)
            return
        }

        let value = 0
        let phase = 0

        const interval = setInterval(() => {

            const increment =
                value < 20
                    ? Math.random() * 1.5
                    : value < 60
                        ? Math.random() * 1.2
                        : Math.random() * 0.6

            value += increment

            if (value >= 93) value = 93

            phase = Math.min(
                Math.floor((value / 100) * PHASES.length),
                PHASES.length - 1
            )

            setProgress(Math.floor(value))
            setPhaseIndex(phase)

        }, 1200)

        return () => clearInterval(interval)

    }, [loading])

    return (

        <div className='relative min-h-screen bg-slate-50 text-slate-900 overflow-hidden'>

            {/* Background Gradient */}
            <div className='absolute inset-0 pointer-events-none bg-gradient-to-br from-slate-100 to-white' />

            {/* header */}
            <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-slate-200 shadow-sm">

                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center">

                    <div className="flex items-center gap-4">

                        <button
                            onClick={() => navigate("/")}
                            className="p-2 rounded-lg hover:bg-slate-100 transition"
                        >
                            <ArrowLeft size={16} />
                        </button>

                        <h1 className="text-lg font-semibold text-slate-900">WebCraft AI</h1>

                    </div>

                </div>

            </div>

            <div className='max-w-6xl mx-auto px-6 py-16 relative z-10'>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className='text-center mb-16'
                >

                    <h1 className='text-4xl md:text-5xl font-bold mb-5 leading-tight'>
                        Build Website with

                        <span className='block bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>
                            Real AI Power
                        </span>

                    </h1>

                    <p className='text-slate-600 max-w-2xl mx-auto'>
                        This process may take several minutes. WebCraft AI focuses on quality not shortcuts
                    </p>

                </motion.div>

                <div className='mb-10'>

                    <h1 className='text-xl font-semibold mb-2'>
                        Describe Your Website
                    </h1>

                    <div className='relative'>

                        <textarea
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className='w-full h-56 p-6 rounded-3xl bg-white border border-slate-200 shadow-sm outline-none resize-none text-sm leading-relaxed focus:ring-2 focus:ring-indigo-100 text-slate-900'
                            placeholder='Describe your website in detail...'
                        />

                    </div>

                    {error && (
                        <p className='mt-4 text-sm text-red-500'>
                            {error}
                        </p>
                    )}

                </div>

                <div className='flex justify-center'>

                    <motion.button
                        onClick={handleGenerateWebsite}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.96 }}
                        disabled={!prompt.trim() || loading}
                        className={`px-14 py-4 rounded-2xl font-semibold text-lg transition shadow-sm
                        ${
                            prompt.trim() && !loading
                                ? "bg-slate-900 text-white hover:bg-slate-800"
                                : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                    >

                        Generate Website

                    </motion.button>

                </div>

                {loading && (

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className='max-w-xl mx-auto mt-12'
                    >

                        <div className='flex justify-between mb-2 text-xs text-slate-500'>
                            <span>{PHASES[phaseIndex]}</span>
                            <span>{progress}%</span>
                        </div>

                        <div className='h-2 w-full bg-slate-200 rounded-full overflow-hidden'>

                            <motion.div
                                animate={{ width: `${progress}%` }}
                                transition={{ ease: "easeOut", duration: 0.8 }}
                                className='h-full bg-slate-900'
                            />

                        </div>

                        <div className='text-center text-xs text-slate-500 mt-4'>

                            Estimated time remaining:{" "}
                            <span className='text-slate-900 font-medium'>
                                ~8-12 minutes
                            </span>

                        </div>

                    </motion.div>

                )}

            </div>

        </div>
    )
}

export default Generate