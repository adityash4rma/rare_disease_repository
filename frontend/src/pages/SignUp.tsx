import { useState, type FormEvent } from 'react'
import { Eye, EyeOff, Search } from 'lucide-react'

import chartsImage from '../assets/charts.svg'
import googleLogo from '../assets/google.svg'

export function SignUp() {
  const [showPassword, setShowPassword] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-[#0f0f0f] font-sans text-white">
      <header className="flex min-h-14 flex-wrap items-center gap-3 border-b-2 border-[#353535] bg-black px-4 py-2 sm:min-h-14 sm:gap-4 sm:px-8 sm:py-0 lg:min-h-24 xl:min-h-[124px] xl:gap-10 xl:px-20">
        <a
          href="/"
          className="shrink-0 text-xl font-bold text-white no-underline sm:text-xl lg:text-3xl xl:text-[40px]"
        >
          Rare-X
        </a>

        <label className="ml-auto hidden h-[47px] w-[clamp(220px,28vw,410px)] items-center gap-3 border border-[#3e3e3e] px-4 text-[#8c8c8c] lg:flex">
          <Search size={24} aria-hidden="true" />

          <input
            type="search"
            aria-label="Search"
            placeholder="Search"
            className="w-full border-none bg-transparent text-lg text-white outline-none placeholder:text-[#8c8c8c]"
          />
        </label>

        <nav
          className="ml-auto flex shrink-0 gap-2 sm:gap-4 xl:gap-7"
          aria-label="Account navigation"
        >
          <a
            href="/login"
            className="grid h-7 w-[68px] place-items-center border border-black bg-[#8cb394] text-xs font-medium text-black no-underline shadow-[2px_2px_0_#feeed5] sm:h-7 sm:w-[68px] sm:text-xs lg:h-[47px] lg:w-[110px] lg:text-lg xl:w-[138px] xl:text-xl"
          >
            Log in
          </a>

          <a
            href="/signup"
            className="grid h-7 w-[68px] place-items-center border border-black bg-[#5d6b8c] text-xs font-medium text-black no-underline shadow-[2px_2px_0_#feeed5] sm:h-7 sm:w-[68px] sm:text-xs lg:h-[47px] lg:w-[110px] lg:text-lg xl:w-[138px] xl:text-xl"
          >
            Sign up
          </a>
        </nav>
      </header>

      <div className="grid min-h-[calc(100vh-56px)] grid-cols-1 sm:min-h-[calc(100vh-80px)] md:grid-cols-[56%_44%] lg:min-h-[calc(100vh-96px)] lg:grid-cols-[55.67%_44.33%] xl:min-h-[calc(100vh-124px)]">
        <aside
          className="relative hidden min-h-[calc(100vh-56px)] overflow-hidden bg-[#4f5b78] md:block sm:min-h-[calc(100vh-80px)] lg:min-h-[calc(100vh-96px)] xl:min-h-[calc(100vh-124px)]"
          aria-hidden="true"
        >
          <div className="absolute left-[4.9%] top-[17.6%] z-20 h-[clamp(48px,7vh,78px)] w-[34.7%] rounded-[3px] bg-[#d9d9d9] shadow-[5px_6px_0_#0f0f0f] md:h-[38px] lg:h-[clamp(48px,7vh,78px)]" />

          <div className="absolute right-[4.9%] top-[24.6%] z-20 h-[clamp(72px,10vh,121px)] w-[33.9%] rounded-[3px] bg-[#d9d9d9] shadow-[5px_6px_0_#0f0f0f] md:h-[59px] lg:h-[clamp(72px,10vh,121px)]" />

          <div className="absolute bottom-[9.1%] left-[3.5%] z-20 h-[clamp(48px,7vh,78px)] w-[33.9%] rounded-[3px] bg-[#d9d9d9] shadow-[5px_6px_0_#0f0f0f] md:bottom-[7.4%] md:h-[40px] lg:bottom-[9.1%] lg:h-[clamp(48px,7vh,78px)]" />

         <img
  src={chartsImage}
  alt=""
  className="absolute left-1/2 top-1/2 z-10 w-[68%] max-w-[520px] -translate-x-1/2 -translate-y-1/2 md:w-[62%] lg:w-[54%] xl:w-[50%]"
/>

        </aside>

        <section className="flex min-h-[calc(100vh-56px)] min-w-0 items-center justify-center bg-[#0f0f0f] px-5 py-8 sm:min-h-[calc(100vh-80px)] sm:px-8 md:px-0 md:py-3 lg:min-h-[calc(100vh-96px)] lg:px-8 lg:py-6 xl:min-h-[calc(100vh-124px)]">
          <div className="w-full max-w-[444px] min-w-0 md:max-w-[218px] lg:max-w-[444px]">
            <h1 className="m-0 text-[clamp(1.4rem,5vw,2.2rem)] font-semibold leading-tight md:text-[18px] lg:text-[clamp(1.4rem,5vw,2.2rem)] xl:text-[35px]">
              Sign Up Account
            </h1>

            <p className="mb-6 mt-3 text-center text-xs text-[#c9c9c9] sm:text-sm md:mb-4 md:mt-2 md:text-[9px] lg:mb-8 lg:mt-3 lg:text-sm xl:mb-10 xl:mt-5 xl:text-[19px]">
              Enter your personal data to create your account
            </p>

            <div className="grid grid-cols-1 gap-3 min-[430px]:grid-cols-2 md:gap-2 lg:gap-6">
              <button
                type="button"
                className="flex h-10 items-center justify-center gap-2 whitespace-nowrap border border-[#feeed5] bg-[rgba(254,238,213,0.08)] px-2 text-sm font-medium text-[#feeed5] sm:h-[47px] sm:text-base md:h-6 md:text-[9px] lg:h-[47px] lg:text-base xl:text-xl"
              >
                <img
                  src={googleLogo}
                  alt=""
                  className="h-[22px] w-[22px] md:h-3 md:w-3 lg:h-[22px] lg:w-[22px]"
                />

                Google
              </button>

              <button
                type="button"
                className="flex h-10 items-center justify-center whitespace-nowrap border border-[#feeed5] bg-[rgba(254,238,213,0.08)] px-2 text-sm font-medium text-[#feeed5] sm:h-[47px] sm:text-base md:h-6 md:text-[9px] lg:h-[47px] lg:text-base xl:text-xl"
              >
                Institution ID
              </button>
            </div>

            <div className="flex h-14 items-center gap-5 text-lg tracking-[1.47px] text-[#686868] md:h-8 md:gap-2 md:text-[10px] md:tracking-[0.7px] lg:h-14 lg:gap-5 lg:text-lg xl:h-16 xl:text-[21px]">
              <span className="h-px flex-1 bg-[#686868]" />
              <span>or</span>
              <span className="h-px flex-1 bg-[#686868]" />
            </div>

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 gap-0 sm:grid-cols-2 sm:gap-[26px]">
                <label className="mb-3 flex flex-col gap-2 text-base font-medium text-[#b4b4b4] md:mb-2 md:gap-1 md:text-[10px] lg:mb-3 lg:gap-2 lg:text-base xl:gap-3 xl:text-[19px]">
                  First Name

                  <input
                    type="text"
                    name="firstName"
                    placeholder="John"
                    autoComplete="given-name"
                    required
                    className="h-[47px] w-full border-2 border-black bg-[#feeed5] px-4 text-lg text-black shadow-[4px_6px_0_#feeed5] outline-none placeholder:text-black/40 md:h-6 md:px-2 md:text-[10px] md:shadow-[2px_3px_0_#feeed5] lg:h-[47px] lg:px-4 lg:text-lg lg:shadow-[4px_6px_0_#feeed5] xl:text-xl"
                  />
                </label>

                <label className="mb-3 flex flex-col gap-2 text-base font-medium text-[#b4b4b4] md:mb-2 md:gap-1 md:text-[10px] lg:mb-3 lg:gap-2 lg:text-base xl:gap-3 xl:text-[19px]">
                  Last Name

                  <input
                    type="text"
                    name="lastName"
                    placeholder="Doe"
                    autoComplete="family-name"
                    required
                    className="h-[47px] w-full border-2 border-black bg-[#feeed5] px-4 text-lg text-black shadow-[4px_6px_0_#feeed5] outline-none placeholder:text-black/40 md:h-6 md:px-2 md:text-[10px] md:shadow-[2px_3px_0_#feeed5] lg:h-[47px] lg:px-4 lg:text-lg lg:shadow-[4px_6px_0_#feeed5] xl:text-xl"
                  />
                </label>
              </div>

              <label className="mb-3 flex flex-col gap-2 text-base font-medium text-[#b4b4b4] md:mb-2 md:gap-1 md:text-[10px] lg:mb-3 lg:gap-2 lg:text-base xl:gap-3 xl:text-[19px]">
                Email

                <input
                  type="email"
                  name="email"
                  placeholder="john@email.com"
                  autoComplete="email"
                  required
                  className="h-[52px] w-full border-2 border-black bg-[#feeed5] px-4 text-lg text-black shadow-[4px_6px_0_#feeed5] outline-none placeholder:text-black/40 md:h-7 md:px-2 md:text-[10px] md:shadow-[2px_3px_0_#feeed5] lg:h-[52px] lg:px-4 lg:text-lg lg:shadow-[4px_6px_0_#feeed5] xl:h-[58px] xl:text-xl"
                />
              </label>

              <label className="mb-3 flex flex-col gap-2 text-base font-medium text-[#b4b4b4] md:mb-2 md:gap-1 md:text-[10px] lg:mb-3 lg:gap-2 lg:text-base xl:gap-3 xl:text-[19px]">
                Password

                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    placeholder="•••••••••••••"
                    autoComplete="new-password"
                    minLength={8}
                    required
                    className="h-[52px] w-full border-2 border-black bg-[#feeed5] px-4 pr-14 text-lg tracking-[4px] text-black shadow-[4px_6px_0_#feeed5] outline-none placeholder:text-black/30 md:h-7 md:px-2 md:pr-7 md:text-[10px] md:tracking-[2px] md:shadow-[2px_3px_0_#feeed5] lg:h-[52px] lg:px-4 lg:pr-14 lg:text-lg lg:tracking-[4px] lg:shadow-[4px_6px_0_#feeed5] xl:h-[58px] xl:text-xl"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword((currentValue) => !currentValue)
                    }
                    aria-label={
                      showPassword ? 'Hide password' : 'Show password'
                    }
                    className="absolute right-3 top-1/2 grid h-[30px] w-[30px] -translate-y-1/2 place-items-center border-none bg-transparent p-0 text-black/60 md:right-1 md:h-5 md:w-5 lg:right-3 lg:h-[30px] lg:w-[30px]"
                  >
                    {showPassword ? (
                      <Eye size={26} aria-hidden="true" />
                    ) : (
                      <EyeOff size={26} aria-hidden="true" />
                    )}
                  </button>
                </div>
              </label>

              <p className="mb-6 mt-1 text-sm text-[#7e7e7e] md:mb-3 md:text-[9px] lg:mb-6 lg:text-sm xl:mb-8 xl:text-lg">
                Must be at least 8 characters
              </p>

              <button
                type="submit"
                className="mx-auto block h-14 w-full border-2 border-black bg-[#8db394] text-2xl font-semibold text-black sm:w-[80%] md:h-8 md:w-[80%] md:text-base lg:h-14 lg:text-2xl xl:h-[63px] xl:w-[353px] xl:text-[35px]"
              >
                Sign up
              </button>
            </form>

            <p className="mt-5 text-center text-sm tracking-[1px] text-[#868686] md:mt-3 md:text-[9px] md:tracking-[0.5px] lg:mt-5 lg:text-sm lg:tracking-[1px] xl:mt-[23px] xl:text-lg xl:tracking-[1.26px]">
              Already have an Account?{' '}
              <a
                href="/login"
                className="font-semibold text-[#feeed5] no-underline"
              >
                Login
              </a>
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}