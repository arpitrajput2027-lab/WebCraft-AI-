import { ArrowRight, Sparkles, Zap, LayoutTemplate, Download, Code, Pencil } from "lucide-react"
import { motion } from "framer-motion"
import { useNavigate } from "react-router-dom"
import Navbar from "../components/Navbar"
import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import axios from "axios"

const Home = () => {    
    const navigate = useNavigate()
    const { userData } = useSelector(state => state.user)

    const [websites, setWebsites] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [renamingId, setRenamingId] = useState(null)
    const [renameValue, setRenameValue] = useState("")

    const handleDelete = async (e, id) => {
        e.stopPropagation()
        if(!window.confirm("Are you sure you want to delete this project?")) return;
        try {
            await axios.delete(`${import.meta.env.VITE_SERVER_URL}/api/website/delete/${id}`, { withCredentials: true })
            setWebsites((prev) => prev.filter((w) => w._id !== id))
        } catch (error) {
            console.log(error)
        }
    }

    const handleRenameStart = (e, w) => {
        e.stopPropagation()
        setRenamingId(w._id)
        setRenameValue(w.title)
    }

    const handleRenameSubmit = async (e, id) => {
        e.stopPropagation()
        if (!renameValue.trim()) return;
        try {
            const res = await axios.patch(`${import.meta.env.VITE_SERVER_URL}/api/website/rename/${id}`, { title: renameValue }, { withCredentials: true })
            setWebsites((prev) => prev.map((w) => w._id === id ? { ...w, title: res.data.title } : w))
        } catch (error) {
            console.log(error)
        } finally {
            setRenamingId(null)
            setRenameValue("")
        }
    }

    useEffect(() => {
        if (!userData) return;
        const handleGetAllWebsite = async () => {
            try {
                setLoading(true)
                const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/website/getall`, { withCredentials: true })
                setWebsites(result.data)
            } catch (error) {
                setError(error?.response?.data?.message || "Failed to fetch")
                console.log(error)
            } finally {
                setLoading(false)
            }
        }
        handleGetAllWebsite()
    }, [userData])

    const handleCopy = async(site)=>{
        await navigator.clipboard.writeText(site.deployUrl)
        setCopiedId(site._id)
        setTimeout(()=>setCopiedId(null), 2000)
    }

  return (
    <>
    <Navbar/>
    <section className="relative min-h-screen bg-slate-50 text-slate-900 overflow-hidden">

      {/* Background Gradient */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-br from-slate-100 to-white" />

      {/* Grid background */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "linear-gradient(to right, #00000010 1px, transparent 1px), linear-gradient(to bottom, #00000010 1px, transparent 1px)",
          backgroundSize: "40px 40px",
        }}
      />

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-32 pb-20 text-center">

        {/* Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-4 py-2 mb-8 border border-slate-200 rounded-full bg-white shadow-sm"
        >
          <Sparkles className="w-4 h-4 text-indigo-500" />
          <span className="text-sm text-slate-600">
            AI Website Builder
          </span>
        </motion.div>

        {/* Heading */}
        <motion.h1
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-5xl md:text-7xl font-bold leading-tight"
        >
          <img src="/logo_home_page.png" alt="WebCraft AI Logo" className="w-48 mx-auto mb-6" />
          Build Websites with
          <br />
          <span className="bg-linear-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AI in Seconds
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-2xl mx-auto mt-6 text-lg text-slate-600"
        >
          Generate stunning, responsive websites instantly using AI.
          No coding required. Perfect for startups, creators and freelancers.
        </motion.p>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row justify-center gap-4 mt-10"
        >
          <button onClick={()=>navigate('/generate')} className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white hover:bg-slate-800 rounded-xl font-semibold transition shadow-md">
            Start Building
            <ArrowRight size={18} />
          </button>
        </motion.div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20">

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition">
            <Zap className="text-yellow-500 mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              Instant Generation
            </h3>
            <p className="text-sm text-slate-500">
              Describe your website and AI generates it instantly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition">
            <LayoutTemplate className="text-indigo-500 mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              Responsive Layout
            </h3>
            <p className="text-sm text-slate-500">
              Websites look perfect on mobile, tablet and desktop.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition">
            <Download className="text-green-500 mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              Export Code
            </h3>
            <p className="text-sm text-slate-500">
              Download clean HTML, CSS and JS instantly.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm hover:border-indigo-300 hover:shadow-md transition">
            <Code className="text-blue-500 mb-4" />
            <h3 className="font-semibold text-lg mb-2">
              Edit & Regenerate
            </h3>
            <p className="text-sm text-slate-500">
              Refine your website iteratively using AI prompts.
            </p>
          </div>

        </div>

        {userData && (
          <div className="mt-32 text-left" id="projects">
            <h2 className="text-3xl font-bold mb-8 text-center">Your Projects</h2>
            
            {loading && <div className="text-center text-slate-500 py-10">Loading your websites...</div>}
            {error && !loading && <div className="text-center text-red-500 py-10">{error}</div>}
            {websites?.length === 0 && <div className="text-center text-slate-500 py-10">You have no websites yet.</div>}
            
            {websites?.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
                {websites.map((w, i) => {
                  return (
                    <motion.div
                      key={w._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      whileHover={{ y: -6 }}
                      onClick={()=>navigate(`/editor/${w._id}`)}
                      className="rounded-2xl bg-white border border-slate-200 shadow-sm overflow-hidden hover:shadow-md hover:border-indigo-300 transition flex flex-col cursor-pointer"
                    >
                      <div className="relative h-40 bg-slate-100 cursor-pointer">
                        <iframe srcDoc={w.latestCode} className="absolute inset-0 w-[140%] h-[140%] scale-[0.72] origin-top-left pointer-events-none bg-white" />
                        <div className="absolute inset-0 bg-transparent" />
                      </div>
                      <div className="p-5 flex flex-col gap-4 flex-1">
                        {renamingId === w._id ? (
                          <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                            <input
                              autoFocus
                              value={renameValue}
                              onChange={(e) => setRenameValue(e.target.value)}
                              onKeyDown={(e) => { if (e.key === 'Enter') handleRenameSubmit(e, w._id); if (e.key === 'Escape') setRenamingId(null); }}
                              className="flex-1 text-sm font-semibold border border-indigo-300 rounded-lg px-2 py-1 outline-none focus:ring-2 focus:ring-indigo-200"
                            />
                            <button onClick={(e) => handleRenameSubmit(e, w._id)} className="px-2 py-1 text-xs bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition">Save</button>
                            <button onClick={(e) => { e.stopPropagation(); setRenamingId(null); }} className="px-2 py-1 text-xs text-slate-400 hover:text-slate-600 transition">✕</button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 group/title">
                            <h3 className="text-base font-semibold line-clamp-2">{w.title}</h3>
                            <button onClick={(e) => handleRenameStart(e, w)} className="p-1 text-slate-500 hover:text-indigo-600 transition">
                              <Pencil size={13} />
                            </button>
                          </div>
                        )}
                        <p className="text-xs text-slate-500">
                          Last Updated {""}
                          {new Date(w.updatedAt).toLocaleDateString()}
                        </p>
                        
                        <div className="flex gap-2 mt-auto">
                          <button onClick={(e)=>{e.stopPropagation(); navigate(`/editor/${w._id}`)}} className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-700 transition shadow-sm">
                            Continue Building
                          </button>
                          <button onClick={(e) => handleDelete(e, w._id)} className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-200 hover:border-red-200 transition">
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )
                })}
              </div>
            )}
          </div>
        )}

      </div>
    </section>
    </>
  )
}

export default Home