import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, Search } from 'lucide-react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

import chartsImage from '../assets/charts.svg'
import googleLogo from '../assets/google.svg'
import waveImage from '../assets/wave.svg'

export function SignUp() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    setSubmitting(true)

    const fullName = `${firstName.trim()} ${lastName.trim()}`.trim()

    try {
      await register({
        email: email.trim(),
        password,
        full_name: fullName,
        role: 'researcher',
      })
      navigate('/')
    } catch (err: any) {
      const msg = err.response?.data?.detail || 'Registration failed. Email might already be registered.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }


  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0f0f0f] font-sans text-white">
      <header className="flex h-[72px] items-center gap-4 border-b-2 border-[#353535] bg-black px-5 md:h-[88px] md:px-10 xl:h-[100px] xl:px-16 2xl:h-[124px] 2xl:px-20">
        <a
          href="/"
          className="shrink-0 text-2xl font-bold text-white no-underline md:text-3xl 2xl:text-[40px]"
        >
          Rare-X
        </a>

        <label className="ml-auto hidden h-[42px] w-[clamp(220px,27vw,410px)] items-center gap-3 border border-[#3e3e3e] px-4 text-[#8c8c8c] lg:flex 2xl:h-[47px]">
          <Search size={22} aria-hidden="true" />

          <input
            type="search"
            aria-label="Search"
            placeholder="Search"
            className="w-full border-0 bg-transparent text-base text-white outline-none placeholder:text-[#8c8c8c]"
          />
        </label>

        <nav
          className="ml-auto flex shrink-0 gap-3 md:gap-5"
          aria-label="Account navigation"
        >
          <a
            href="/login"
            className="grid h-9 w-[76px] place-items-center border border-black bg-[#8cb394] text-xs font-medium text-black no-underline shadow-[2px_2px_0_#feeed5] md:h-10 md:w-[105px] md:text-base 2xl:h-[47px] 2xl:w-[138px] 2xl:text-xl"
          >
            Log in
          </a>

          <a
            href="/signup"
            className="grid h-9 w-[76px] place-items-center border border-black bg-[#5d6b8c] text-xs font-medium text-black no-underline shadow-[2px_2px_0_#feeed5] md:h-10 md:w-[105px] md:text-base 2xl:h-[47px] 2xl:w-[138px] 2xl:text-xl"
          >
            Sign up
          </a>
        </nav>
      </header>

      <div className="grid min-h-[calc(100vh-72px)] grid-cols-1 md:min-h-[calc(100vh-88px)] md:grid-cols-[55.67%_44.33%] xl:min-h-[calc(100vh-100px)] 2xl:min-h-[calc(100vh-124px)]">
        <aside
          className="relative hidden min-h-[calc(100vh-88px)] overflow-hidden bg-[#4f5b78] md:block xl:min-h-[calc(100vh-100px)] 2xl:min-h-[calc(100vh-124px)]"
          aria-hidden="true"
        >
          <div className="absolute left-[4.9%] top-[17%] z-20 h-[clamp(48px,7vh,78px)] w-[34.7%] rounded-[3px] bg-[#d9d9d9] shadow-[5px_6px_0_#0f0f0f]" />

          <div className="absolute right-[4.9%] top-[24%] z-20 h-[clamp(70px,10vh,121px)] w-[33.9%] rounded-[3px] bg-[#d9d9d9] shadow-[5px_6px_0_#0f0f0f]" />

          <div className="absolute bottom-[9%] left-[3.5%] z-20 h-[clamp(48px,7vh,78px)] w-[33.9%] rounded-[3px] bg-[#d9d9d9] shadow-[5px_6px_0_#0f0f0f]" />

          <img
            src={chartsImage}
            alt=""
            className="absolute left-1/2 top-[54%] z-10 w-[68%] max-w-[520px] -translate-x-1/2 -translate-y-1/2 md:w-[62%] lg:w-[54%] xl:w-[50%]"
          />

          <img
            src={waveImage}
            alt=""
            className="absolute bottom-0 left-0 block h-auto w-full"
          />
        </aside>

        <section className="flex min-h-[calc(100vh-72px)] min-w-0 items-center justify-center bg-[#0f0f0f] px-5 py-7 md:min-h-[calc(100vh-88px)] md:px-8 md:py-5 xl:min-h-[calc(100vh-100px)] 2xl:min-h-[calc(100vh-124px)]">
          <div className="w-full max-w-[444px] min-w-0">
            <h1 className="m-0 text-[clamp(1.7rem,2.4vw,2.2rem)] font-semibold leading-tight">
              Sign Up Account
            </h1>

            <p className="mb-6 mt-2 text-center text-[clamp(0.75rem,1.1vw,1.05rem)] text-[#c9c9c9] md:mb-7 2xl:mb-10 2xl:mt-4">
              Enter your personal data to create your account
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-900/40 border border-red-500 text-red-200 text-sm rounded">
                {error}
              </div>
            )}


            <div className="grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 md:gap-4 2xl:gap-9">
              <button
                type="button"
                className="flex h-10 items-center justify-center gap-2 whitespace-nowrap border border-[#feeed5] bg-[rgba(254,238,213,0.08)] px-2 text-sm font-medium text-[#feeed5] 2xl:h-[47px] 2xl:text-xl"
              >
                <img
                  src={googleLogo}
                  alt=""
                  className="h-5 w-5 2xl:h-[22px] 2xl:w-[22px]"
                />

                Google
              </button>

              <button
                type="button"
                className="flex h-10 items-center justify-center whitespace-nowrap border border-[#feeed5] bg-[rgba(254,238,213,0.08)] px-2 text-sm font-medium text-[#feeed5] 2xl:h-[47px] 2xl:text-xl"
              >
                Institution ID
              </button>
            </div>

            <div className="flex h-11 items-center gap-5 text-base tracking-[1.47px] text-[#686868] 2xl:h-16 2xl:text-[21px]">
              <span className="h-px flex-1 bg-[#686868]" />
              <span>or</span>
              <span className="h-px flex-1 bg-[#686868]" />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-[18px] 2xl:gap-[26px]">
                <label className="mb-2 flex flex-col gap-1.5 text-sm font-medium text-[#b4b4b4] 2xl:mb-3 2xl:gap-3 2xl:text-[19px]">
                  First Name

                  <input
                    type="text"
                    name="firstName"
                    value={firstName}
                    onChange={(event) => setFirstName(event.target.value)}
                    placeholder="John"
                    autoComplete="given-name"
                    required
                    className="h-10 w-full border-2 border-black bg-[#feeed5] px-3 text-base text-black shadow-[4px_6px_0_#feeed5] outline-none placeholder:text-black/40 2xl:h-[47px] 2xl:px-4 2xl:text-xl"
                  />
                </label>

                <label className="mb-2 flex flex-col gap-1.5 text-sm font-medium text-[#b4b4b4] 2xl:mb-3 2xl:gap-3 2xl:text-[19px]">
                  Last Name

                  <input
                    type="text"
                    name="lastName"
                    value={lastName}
                    onChange={(event) => setLastName(event.target.value)}
                    placeholder="Doe"
                    autoComplete="family-name"
                    required
                    className="h-10 w-full border-2 border-black bg-[#feeed5] px-3 text-base text-black shadow-[4px_6px_0_#feeed5] outline-none placeholder:text-black/40 2xl:h-[47px] 2xl:px-4 2xl:text-xl"
                  />
                </label>
              </div>

              <label className="mb-2 flex flex-col gap-1.5 text-sm font-medium text-[#b4b4b4] 2xl:mb-3 2xl:gap-3 2xl:text-[19px]">
                Email

                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="john@email.com"
                  autoComplete="email"
                  required
                  className="h-11 w-full border-2 border-black bg-[#feeed5] px-3 text-base text-black shadow-[4px_6px_0_#feeed5] outline-none placeholder:text-black/40 2xl:h-[58px] 2xl:px-4 2xl:text-xl"
                />
              </label>

              <label className="mb-2 flex flex-col gap-1.5 text-sm font-medium text-[#b4b4b4] 2xl:mb-3 2xl:gap-3 2xl:text-[19px]">
                Password

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    placeholder="•••••••••••••"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className="h-11 w-full border-2 border-black bg-[#feeed5] px-3 pr-12 text-base tracking-[4px] text-black shadow-[4px_6px_0_#feeed5] outline-none placeholder:text-black/30 2xl:h-[58px] 2xl:px-4 2xl:pr-14 2xl:text-xl"
                  />

                  <button
                    type="button"
                    onClick={() => {
                      setShowPassword((currentValue) => !currentValue)
                    }}
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center border-0 bg-transparent p-0 text-black/60"
                  >
                    {showPassword ? (
                      <Eye size={22} aria-hidden="true" />
                    ) : (
                      <EyeOff size={22} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </label>

              <p className="mb-4 mt-1 text-xs text-[#7e7e7e] 2xl:mb-7 2xl:text-base">
                Must be at least 8 characters
              </p>

              <button
                type="submit"
                disabled={submitting}
                className="mx-auto block h-12 w-full border-2 border-black bg-[#8db394] text-2xl font-semibold text-black sm:w-[80%] 2xl:h-[63px] 2xl:w-[353px] 2xl:text-[35px] disabled:opacity-50"
              >
                {submitting ? 'Signing up...' : 'Sign up'}
              </button>
            </form>

            <p className="mt-3 text-center text-xs tracking-[0.8px] text-[#868686] 2xl:mt-5 2xl:text-base 2xl:tracking-[1.26px]">
              Already have an Account?{' '}
              <Link
                to="/login"
                className="font-semibold text-[#feeed5] no-underline"
              >
                Login
              </Link>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}