import { ArrowLeft, Check, Rocket, Share2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { motion } from 'motion/react'
import {  useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function Dashboard() {
  const navigate = useNavigate()
  const [websites, setWebsites] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [copiedId, setCopiedId] = useState(null)
  const { userData } = useSelector(state => state.user)

  const handleDeploy = async (id) => {
    try {
         const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/website/deploy/${id}`,{withCredentials:true})
         window.open(`${result.data.url}`,"_blank")
         setWebsites((prev)=>prev.map((w)=>w._id === id ? {...w, deployed:true, deployUrl:result.data.url}:w))
    } catch (error) {
         console.log(error)
    }
  }

  useEffect(() => {
    const handleGetAllWebsite = async () => {
      try {
        setLoading(true)
        const result = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/website/getall`, { withCredentials: true })
        setWebsites(result.data)
      } catch (error) {
        setError(error.response.data.message)
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    handleGetAllWebsite()
  }, [])

  const handleCopy = async(site)=>{
      await navigator.clipboard.writeText(site.deployUrl)
      setCopiedId(site._id)
      setTimeout(()=>setCopiedId(null), 2000)
  }
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* header */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/80 border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

          <div className="flex items-center gap-4">
            <button onClick={() => navigate("/")} className="p-2 rounded-lg hover:bg-slate-100 transition">
              <ArrowLeft size={16} />
            </button>
            <h1 className="text-lg font-semibold text-slate-900">Dashboard</h1>
          </div>

          <button onClick={() => navigate("/generate")} className="px-4 py-2 rounded-lg bg-slate-900 text-white shadow-sm text-sm font-semibold hover:scale-105 transition">
            + New Website
          </button>

        </div>
      </div>

      <div className="px-6 py-10 max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <p className="text-sm text-slate-500 mb-1">Welcome Back</p>
          <h1 className="text-3xl font-bold">{userData.name}</h1>
        </motion.div>

        {loading && <div className="mt-24 text-center text-slate-500">Loading your websites...</div>}
        {error && !loading && <div className="mt-24 text-center text-red-500">{error}</div>}
        {websites?.length === 0 && <div className="mt-24 text-center text-slate-500">You have no websites.</div>}
        {websites?.length > 0 &&
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
            {websites.map((w, i) => {
              const copied = copiedId === w._id
            return <motion.div
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
                  <h3 className="text-base font-semibold line-clamp-2">{w.title}</h3>
                  <p className="text-xs text-slate-500">
                    Last Updated {""}
                    {new Date(w.updatedAt).toLocaleDateString()}
                  </p>
                  {!w.deployed ? (
                    <button onClick={(e)=>{e.stopPropagation(); handleDeploy(w._id)}} className="mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 text-white hover:bg-indigo-700 hover:scale-105 transition shadow-sm">
                      <Rocket size={18} />
                      Deploy
                    </button>
                  ) : (
                    <motion.button 
                    onClick={(e)=>{e.stopPropagation(), handleCopy(w)}} 
                    whileTap={{scale:0.95}}
                    className={`mt-auto flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all 
                      ${copied ? "bg-emerald-50 text-emerald-600 border border-emerald-200":"bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700"}
                      `}
                    >
                      {copied ? <><Check size={14}/> Link Copied</>:<><Share2 size={14}/> Share Link</>}
                      
                    </motion.button>
                  )}
                </div>
              </motion.div>
})}
          </div>
        }
      </div>
    </div>
  );
}

export default Dashboard;