import { AnimatePresence, motion } from "framer-motion"
import { useState } from "react"
import LoginModal from "./LoginModal"
import { useDispatch, useSelector } from "react-redux"
import { Coins } from "lucide-react"
import axios from "axios"
import { setUserData } from "../redux/userSlice"
import { useNavigate } from "react-router-dom"

const Navbar = () => {

  const [openLogin, setOpenLogin] = useState(false)
  const [openProfile, setOpenProfile] = useState(false)

  const { userData } = useSelector(state => state.user)

  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleLogout = async () => {
    try {
      await axios.get(
        `${import.meta.env.VITE_SERVER_URL}/api/auth/logout`,
        { withCredentials: true }
      )

      dispatch(setUserData(null))
      setOpenProfile(false)

    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <motion.nav
        initial={{ y: -40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-white/80 border-b border-slate-200 shadow-sm"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">

          {/* Logo */}
          <div
            onClick={() => navigate("/")}
            className="flex items-center gap-2 cursor-pointer bg-slate-50 p-2 px-4 rounded-2xl border border-slate-200 shadow-sm"
          >
            <img src="/logo.png" className="w-7" />

            <span className="font-semibold text-lg text-slate-900">
              WebCraft AI
            </span>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-5">

            {/* Pricing */}
            {/* <button
              onClick={() => navigate("/pricing")}
              className="hidden md:block text-sm text-zinc-400 hover:text-white transition"
            >
              Pricing
            </button> */}

            {/* Credits */}
            {userData && (
              <motion.div
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate("/pricing")}
                className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200 text-sm cursor-pointer hover:bg-slate-100 transition shadow-sm"
              >
                <Coins size={14} className="text-yellow-500" />
                <span className="text-slate-900 font-medium">{userData.credits}</span>
                <span className="text-slate-500">Credits</span>
                <span className="font-semibold text-slate-500">+</span>
              </motion.div>
            )}

            {/* Profile OR Login */}
            {userData ? (

              <div className="relative">

                <button
                  onClick={() => setOpenProfile(!openProfile)}
                  className="flex items-center"
                >
                  <img
                    referrerPolicy="no-referrer"
                    className="w-9 h-9 rounded-full border border-slate-200 object-cover hover:scale-105 transition shadow-sm"
                    src={
                      userData?.avatar ||
                      `https://ui-avatars.com/api/?name=${userData.name}`
                    }
                  />
                </button>

                <AnimatePresence>
                  {openProfile && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-60 rounded-xl bg-white border border-slate-200 shadow-lg overflow-hidden"
                    >

                      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50">
                        <p className="text-sm font-medium truncate text-slate-900">
                          {userData.name}
                        </p>

                        <p className="text-xs text-slate-500 truncate">
                          {userData.email}
                        </p>
                      </div>

                      <button
                        onClick={() => navigate("/")}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-slate-50 text-slate-700 font-medium"
                      >
                        Projects
                      </button>

                      <button
                        onClick={() => navigate("/pricing")}
                        className="md:hidden w-full px-4 py-3 flex items-center gap-2 text-slate-700 text-sm hover:bg-slate-50 font-medium"
                      >
                        <Coins size={14} className="text-yellow-500" />
                        {userData.credits} Credits
                      </button>

                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm hover:bg-red-50 text-red-600 font-medium border-t border-slate-100"
                      >
                        Logout
                      </button>

                    </motion.div>
                  )}
                </AnimatePresence>

              </div>

            ) : (

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setOpenLogin(true)}
                className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 font-semibold text-sm transition text-white shadow-md"
              >
                Login
              </motion.button>

            )}

          </div>

        </div>
      </motion.nav>

      {openLogin && (
        <LoginModal
          open={openLogin}
          onClose={() => setOpenLogin(false)}
        />
      )}
    </>
  )
}

export default Navbar





