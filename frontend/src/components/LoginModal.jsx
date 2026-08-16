import React from 'react'
import { motion } from 'motion/react'
import { Sparkles, X } from 'lucide-react'
import { signInWithPopup } from 'firebase/auth'
import { auth, provider } from '../firebase'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { setUserData } from '../redux/userSlice'

const LoginModal = ({ open, onClose }) => {
    const dispatch = useDispatch()
    const handleGoogleAuth = async () => {
        try {
            const result = await signInWithPopup(auth, provider)
            const { data } = await axios.post(`${import.meta.env.VITE_SERVER_URL}/api/auth/google`, {
                name: result.user.displayName,
                email: result.user.email,
                avatar: result.user.photoURL
            }, { withCredentials: true })
            dispatch(setUserData(data))
            onClose()
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            {open &&
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className='fixed inset-0 flex z-100 items-center justify-center bg-slate-900/40 backdrop-blur-sm px-4'>
                    <motion.div
                        initial={{ scale: 0.88, opacity: 0, y: 60 }}
                        animate={{ scale: 1, opacity: 1, y: 0 }}
                        exit={{ scale: 0.9, opacity: 0, y: 40 }}
                        transition={{ duration: 0.45, ease: "easeOut" }}
                        className='relative w-full max-w-md p-px rounded-3xl bg-transparent'
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className='relative rounded-3xl bg-white border border-slate-200 shadow-2xl overflow-hidden'>
                            <button onClick={onClose} className='absolute top-5 right-5 z-20 text-slate-400 hover:text-slate-900 transition text-lg'><X /></button>
                            <div className='relative px-8 pt-14 pb-10 text-center'>
                                <div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-slate-200 rounded-full bg-slate-50"
                                >
                                    <Sparkles className="w-4 h-4 text-indigo-500" />
                                    <span className="text-sm text-slate-600">
                                        AI Website Builder
                                    </span>
                                </div>
                                <h2 className='text-3xl font-semibold leading-tight mb-3 space-x-2 '>
                                    <span className='text-slate-900'>Welcome to</span>
                                    <span className='bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent'>WebCraft AI</span>
                                </h2>
                                <motion.button
                                    onClick={handleGoogleAuth}
                                    whileHover={{ scale: 1.04 }}
                                    whileTap={{ scale: 0.96 }}
                                    className='group relative w-full h-13 rounded-xl bg-white border border-slate-200 text-slate-900 font-semibold shadow-sm hover:bg-slate-50 transition overflow-hidden'>
                                    <div className='relative flex items-center justify-center gap-3'>
                                        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png" alt="" className='h-5 w-5' />
                                        Continue with Google
                                    </div>

                                </motion.button>

                                <div className='flex items-center gap-4 my-10'>
                                    <div className='h-px flex-1 bg-slate-200' />
                                    <span className='text-xs tracking-tight text-slate-500'>Secure Login</span>
                                    <div className='h-px flex-1 bg-slate-200' />
                                </div>

                                <p className='text-xs text-slate-500 leading-relaxed'>
                                    By continuing you agree to our{" "}
                                    <span className='underline cursor-pointer hover:text-slate-900'>Terms of Services</span>{" "}
                                    and{" "}
                                    <span className='underline cursor-pointer hover:text-slate-900'>Privacy Policy</span>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </motion.div>
            }
        </div>
    )
}

export default LoginModal
