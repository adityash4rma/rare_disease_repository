import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, Dna, Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import googleLogo from '../assets/google.svg'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setErrorMessage('')

    if (!email.trim() || !password.trim()) {
      setErrorMessage('Please enter your email and password.')
      return
    }

    try {
      setSubmitting(true)
      await login({ email: email.trim(), password })
      navigate('/')
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Unable to log in. Please verify your credentials.'
      setErrorMessage(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F4F7FE] flex items-center justify-center p-6 font-sans">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-indigo-200 rounded-full blur-[120px] opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
      
      <div className="bg-white w-full max-w-5xl h-[650px] rounded-[3rem] shadow-2xl shadow-indigo-100 flex overflow-hidden border border-white relative z-10">
        
        {/* Left Side: Branding & Info */}
        <div className="hidden md:flex w-1/2 bg-gradient-to-br from-[#7C5C9E] to-[#5A4175] p-12 text-white flex-col justify-between relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-12">
              <div className="w-10 h-10 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
                <Dna className="text-white rotate-45" size={24} />
              </div>
              <h1 className="text-2xl font-black uppercase tracking-tighter">Rare-X</h1>
            </div>
            
            <h2 className="text-4xl font-bold leading-tight mb-6 tracking-tight">
              Advancing Rare <br/> Disease Research <br/> Together.
            </h2>
            <p className="text-purple-100 text-sm font-medium leading-relaxed max-w-xs opacity-90">
              Join a global network of researchers and clinicians dedicated to data-driven discoveries.
            </p>
          </div>

          <div className="relative z-10 bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20">
            <div className="flex items-center gap-3 mb-2">
              <ShieldCheck className="text-teal-300" size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Enterprise Security</span>
            </div>
            <p className="text-[10px] text-purple-100 opacity-80 leading-relaxed font-medium">
              Your data is secured with AES-256 encryption and decentralized identity verification (DID).
            </p>
          </div>

          {/* Decorative SVG Circles */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-20 -mt-20"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-white/5 rounded-full -ml-10 -mb-10"></div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-12 lg:p-16 flex flex-col justify-center bg-white">
          <div className="mb-10">
            <h3 className="text-3xl font-black text-slate-800 mb-2 tracking-tight">Welcome Back</h3>
            <p className="text-slate-400 text-sm font-medium">Enter your credentials to access the repository.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-4 top-3.5 text-slate-300" size={18} />
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@institution.edu" 
                  className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-400 text-sm transition-all font-medium"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Password</label>
                <Link to="/forgot" className="text-[10px] font-bold text-indigo-600 uppercase hover:underline">Forgot?</Link>
              </div>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 text-slate-300" size={18} />
                <input 
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••" 
                  className="w-full bg-slate-50 border border-slate-100 p-4 pl-12 pr-12 rounded-2xl outline-none focus:ring-2 focus:ring-indigo-400 text-sm transition-all font-medium"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-slate-300 hover:text-indigo-500 transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {errorMessage && (
              <p className="text-red-500 text-[11px] font-bold bg-red-50 p-3 rounded-xl border border-red-100 animate-shake">
                {errorMessage}
              </p>
            )}

            <button 
              type="submit" 
              disabled={submitting}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.15em] shadow-xl shadow-indigo-100 hover:bg-indigo-700 disabled:opacity-70 transition-all flex items-center justify-center gap-3 mt-4"
            >
              {submitting ? 'Authenticating...' : 'Sign In'} <ArrowRight size={18} />
            </button>
          </form>

          <div className="mt-8 flex items-center gap-4 text-slate-200">
            <div className="h-px flex-1 bg-slate-100"></div>
            <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">OR CONTINUE WITH</span>
            <div className="h-px flex-1 bg-slate-100"></div>
          </div>

          <div className="mt-6 flex gap-4">
             <button type="button" className="flex-1 flex items-center justify-center gap-2 border border-slate-100 py-3 rounded-xl hover:bg-slate-50 transition-all shadow-sm">
                <img src={googleLogo} className="w-4 h-4" alt="Google" />
                <span className="text-[11px] font-bold text-slate-600 uppercase tracking-tighter">Google</span>
             </button>
             <button type="button" className="flex-1 border border-slate-100 py-3 rounded-xl hover:bg-slate-50 transition-all shadow-sm text-[11px] font-bold text-slate-600 uppercase tracking-tighter">
                Institution ID
             </button>
          </div>

          <p className="mt-10 text-center text-xs text-slate-400 font-medium">
            Don't have an account? <Link to="/signup" className="text-indigo-600 font-bold hover:underline">Sign Up</Link>
          </p>
        </div>
      </div>
    </main>
  )
}