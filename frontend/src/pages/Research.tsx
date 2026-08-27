import {
  useEffect,
  useMemo,
  useState,
  type ChangeEvent,
} from 'react'
import { Link, useLocation } from 'react-router-dom'
import {
  Activity,
  Bell,
  Building2,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  CircleHelp,
  Database,
  Dna,
  FileSearch,
  FlaskConical,
  Folder,
  Image,
  LockKeyhole,
  Mail,
  Menu,
  Network,
  Plus,
  Search,
  ShieldCheck,
  Stethoscope,
  X,
} from 'lucide-react'

import defaultProfileImage from '../assets/Ellipse.svg'
import rarexLogo from '../assets/rarex.svg'

type StudyType = 'clinical' | 'genetic' | 'imaging' | 'treatment'

type Study = {
  id: number
  name: string
  disease: string
  patients: string
  availability: 'Available' | 'Requested'
  types: StudyType[]
}

type StudiesResponse = {
  items?: Study[]
  studies?: Study[]
}

const sampleStudies: Study[] = [
  {
    id: 1,
    name: 'CF-Dataset-001',
    disease: 'Cystic Fibrosis',
    patients: '1,245',
    availability: 'Available',
    types: ['clinical', 'genetic', 'imaging'],
  },
  {
    id: 2,
    name: 'RareGen-2024',
    disease: 'Duchenne MD',
    patients: '932',
    availability: 'Available',
    types: ['clinical', 'genetic', 'treatment'],
  },
  {
    id: 3,
    name: 'SMA-Study-2024',
    disease: 'Spinal Muscular Atrophy',
    patients: '756',
    availability: 'Available',
    types: ['clinical', 'genetic', 'imaging'],
  },
  {
    id: 4,
    name: 'SCD-Registry-01',
    disease: 'Sickle Cell Disease',
    patients: '1,120',
    availability: 'Available',
    types: ['clinical', 'genetic', 'treatment'],
  },
  {
    id: 5,
    name: 'Epi-Rare-2024',
    disease: 'Rare Epileptic Encephalopathy',
    patients: '512',
    availability: 'Requested',
    types: ['clinical', 'genetic'],
  },
  {
    id: 6,
    name: 'CF-Dataset-001',
    disease: 'Cystic Fibrosis',
    patients: '1,245',
    availability: 'Available',
    types: ['clinical', 'genetic', 'imaging'],
  },
  {
    id: 7,
    name: 'RareGen-2024',
    disease: 'Duchenne MD',
    patients: '932',
    availability: 'Available',
    types: ['clinical', 'genetic'],
  },
  {
    id: 8,
    name: 'SMA-Study-2024',
    disease: 'Spinal Muscular Atrophy',
    patients: '756',
    availability: 'Available',
    types: ['clinical', 'genetic', 'imaging'],
  },
  {
    id: 9,
    name: 'SCD-Registry-01',
    disease: 'Sickle Cell Disease',
    patients: '1,120',
    availability: 'Available',
    types: ['clinical', 'genetic', 'treatment'],
  },
]

const navigation = [
  { label: 'Dashboard', path: '/', icon: Activity },
  { label: 'Disease Repository', path: '/repository', icon: Folder },
  { label: 'Dataset Explorer', path: '/datasets', icon: Database },
  { label: 'Research Studies', path: '/studies', icon: FlaskConical },
  { label: 'Access Requests', path: '/requests', icon: LockKeyhole },
  { label: 'Federated Learning', path: '/federated', icon: Network },
  { label: 'Institutions', path: '/institutions', icon: Building2 },
]

const typeStyles = {
  clinical: {
    icon: FileSearch,
    classes: 'bg-[#e9e6ff] text-[#6257d9]',
  },
  genetic: {
    icon: Dna,
    classes: 'bg-[#eceaff] text-[#675be0]',
  },
  imaging: {
    icon: Image,
    classes: 'bg-[#dcf7ef] text-[#00896c]',
  },
  treatment: {
    icon: Stethoscope,
    classes: 'bg-[#ffe6e3] text-[#d94949]',
  },
}

function StudyTypeIcon({ type }: { type: StudyType }) {
  const configuration = typeStyles[type]
  const Icon = configuration.icon

  return (
    <span
      title={type}
      className={`grid h-6 w-6 place-items-center rounded-[3px] ${configuration.classes}`}
    >
      <Icon size={13} strokeWidth={1.8} />
    </span>
  )
}

export default function Research() {
  const location = useLocation()

  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'studies' | 'dictionary'>(
    'studies',
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [activePage, setActivePage] = useState(1)
  const [studies, setStudies] = useState<Study[]>(sampleStudies)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [userName] = useState(() => {
    return localStorage.getItem('rarexUserName') || 'Researcher'
  })

  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem('rarexUserAvatar') || defaultProfileImage
  })

  useEffect(() => {
    const loadStudies = async () => {
      try {
        setLoading(true)
        setError('')

        const apiUrl =
          import.meta.env.VITE_API_URL || 'http://localhost:8000'

        const response = await fetch(`${apiUrl}/api/studies`)

        if (!response.ok) {
          throw new Error('Unable to load research studies')
        }

        const responseData = (await response.json()) as
          | Study[]
          | StudiesResponse

        let databaseStudies: Study[] = []

        if (Array.isArray(responseData)) {
          databaseStudies = responseData
        } else if (Array.isArray(responseData.items)) {
          databaseStudies = responseData.items
        } else if (Array.isArray(responseData.studies)) {
          databaseStudies = responseData.studies
        }

        if (databaseStudies.length > 0) {
          setStudies(databaseStudies)
        }
      } catch (requestError) {
        setError(
          requestError instanceof Error
            ? requestError.message
            : 'Unable to load research studies',
        )
      } finally {
        setLoading(false)
      }
    }

    void loadStudies()
  }, [])

  const handleProfileUpload = (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]

    if (!file || !file.type.startsWith('image/')) {
      return
    }

    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setProfileImage(reader.result)
        localStorage.setItem('rarexUserAvatar', reader.result)
      }
    }

    reader.readAsDataURL(file)
  }

  const filteredStudies = useMemo(() => {
    const query = searchTerm.trim().toLowerCase()

    if (!query) {
      return studies
    }

    return studies.filter((study) => {
      return (
        study.name.toLowerCase().includes(query) ||
        study.disease.toLowerCase().includes(query)
      )
    })
  }, [searchTerm, studies])

  return (
    <main className="min-h-screen bg-white font-sans text-[#191c1f]">
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-black/30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[219px] flex-col rounded-tr-[50px] border-r border-[#c7c4d7]/30 bg-[#bdc6e7] transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-[105px] items-center gap-3 px-7">
          <img
            src={rarexLogo}
            alt="RARE-X"
            className="h-14 w-[22px] object-contain"
          />

          <div>
            <h1 className="text-xl font-bold leading-7">RARE-X</h1>

            <p className="text-[10px] font-medium leading-[13px] text-[#67667a]">
              Rare Disease Research
              <br />
              Network
            </p>
          </div>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={() => setSidebarOpen(false)}
            className="ml-auto grid h-8 w-8 place-items-center rounded-lg text-[#302e59] lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mx-4 mt-7 flex h-[64px] items-center gap-3 rounded-lg border border-[#c7c4d7]/40 px-2">
          <label className="relative shrink-0 cursor-pointer">
            <img
              src={profileImage}
              alt={`${userName} profile`}
              className="h-10 w-10 rounded-full bg-[#d9d9d9] object-cover"
            />

            <input
              type="file"
              accept="image/*"
              onChange={handleProfileUpload}
              className="sr-only"
            />
          </label>

          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold">{userName}</p>

            <p className="mt-1 text-[11px] font-medium text-[#4343d5]">
              Researcher
            </p>
          </div>

          <ChevronDown size={15} />
        </div>

        <nav className="mt-28 flex flex-1 flex-col gap-1 overflow-y-auto px-4">
          {navigation.map((item) => {
            const Icon = item.icon
            const isActive =
              item.path === '/studies'
                ? location.pathname === '/studies'
                : location.pathname === item.path

            return (
              <Link
                key={item.label}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-4 rounded-lg px-4 py-3 text-xs font-semibold no-underline transition-colors ${
                  isActive
                    ? 'bg-[#a3bcba] text-[#00664c]'
                    : 'text-[#302e59] hover:bg-white/30'
                }`}
              >
                <Icon size={19} strokeWidth={1.8} />
                <span>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="px-4 pb-8">
          <p className="mb-5 text-[9px] font-medium text-[#67667a]">
            Secure • Decentralized • Trusted
          </p>

          <div className="flex items-center gap-2 rounded-md bg-[#a8d0cf] px-3 py-2">
            <ShieldCheck size={15} className="text-[#007b69]" />

            <div>
              <p className="text-[9px] font-semibold text-[#007b69]">
                Your session is secured
              </p>

              <p className="text-[7px] text-[#67667a]">
                DID: did:rarex:researcher:8f3a
              </p>
            </div>
          </div>
        </div>
      </aside>

      <div className="min-h-screen lg:pl-[219px]">
        <header className="flex min-h-[96px] items-center gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            aria-label="Open navigation"
            onClick={() => setSidebarOpen(true)}
            className="grid h-10 w-10 shrink-0 place-items-center rounded-lg border border-[#c7c4d7]/50 text-[#302e59] lg:hidden"
          >
            <Menu size={22} />
          </button>

          <label className="relative flex h-10 max-w-[672px] flex-1 items-center">
            <Search
              size={18}
              className="absolute left-4 text-[#6b7280]"
              aria-hidden="true"
            />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search for diseases, datasets, institutions..."
              className="h-full w-full rounded-full border border-[#c7c4d7]/50 bg-[#f2f3f7] pl-11 pr-4 text-[13px] outline-none placeholder:text-[#6b7280] focus:border-[#4343d5]"
            />
          </label>

          <div className="ml-auto hidden items-center gap-1 sm:flex">
            <button
              type="button"
              aria-label="Notifications"
              className="relative grid h-10 w-10 place-items-center rounded-full text-[#302e59] hover:bg-[#f2f3f7]"
            >
              <Bell size={19} />

              <span className="absolute right-1 top-0 grid h-4 min-w-4 place-items-center rounded-full border-2 border-white bg-[#4343d5] px-0.5 text-[8px] font-bold text-white">
                3
              </span>
            </button>

            <button
              type="button"
              aria-label="Messages"
              className="relative grid h-10 w-10 place-items-center rounded-full text-[#302e59] hover:bg-[#f2f3f7]"
            >
              <Mail size={19} />

              <span className="absolute right-1 top-0 grid h-4 min-w-4 place-items-center rounded-full border-2 border-white bg-[#4343d5] px-0.5 text-[8px] font-bold text-white">
                2
              </span>
            </button>

            <button
              type="button"
              aria-label="Help"
              className="grid h-10 w-10 place-items-center rounded-full text-[#302e59] hover:bg-[#f2f3f7]"
            >
              <CircleHelp size={19} />
            </button>

            <span className="mx-2 h-6 w-px bg-[#c7c4d7]/40" />

            <div className="flex h-9 items-center gap-2 rounded-full border border-[#4343d5]/20 bg-[#4343d5]/5 px-3 text-sm font-semibold text-[#4343d5]">
              <ShieldCheck size={14} />
              <span className="hidden xl:inline">Verified Researcher</span>
              <span className="h-2 w-2 rounded-full bg-[#00896c]" />
            </div>
          </div>
        </header>

        <section className="mx-auto w-full max-w-[1536px] px-4 pb-8 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 pt-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-2xl font-bold leading-tight sm:text-[28px]">
                Research Studies
              </h2>

              <p className="mt-1 text-xs font-medium text-[#67667a]">
                Manage and explore research studies.
              </p>
            </div>

            <button
              type="button"
              className="flex h-10 w-fit items-center gap-2 rounded-lg bg-[#5b4fe0] px-4 text-xs font-semibold text-white shadow-sm hover:bg-[#4c41c7]"
            >
              <Plus size={17} />
              Create New Study
            </button>
          </div>

          <div className="mt-8 flex gap-7 border-b border-[#c7c4d7]/40">
            <button
              type="button"
              onClick={() => setActiveTab('studies')}
              className={`border-b-2 px-1 pb-3 text-xs font-semibold ${
                activeTab === 'studies'
                  ? 'border-[#5b4fe0] text-[#4343d5]'
                  : 'border-transparent text-[#302e59]'
              }`}
            >
              All Studies
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('dictionary')}
              className={`border-b-2 px-1 pb-3 text-xs font-semibold ${
                activeTab === 'dictionary'
                  ? 'border-[#5b4fe0] text-[#4343d5]'
                  : 'border-transparent text-[#302e59]'
              }`}
            >
              Data Dictionary
            </button>
          </div>

          {activeTab === 'studies' ? (
            <>
              {loading && (
                <div className="mt-7 rounded-lg bg-[#f8f9fd] p-5 text-sm text-[#67667a]">
                  Loading research studies...
                </div>
              )}

              {error && (
                <div className="mt-7 rounded-lg bg-amber-50 p-5 text-sm text-amber-700">
                  {error}. Displaying sample data.
                </div>
              )}

              <div
                className={`mt-7 overflow-hidden border border-[#e3e2eb] ${
                  loading ? 'opacity-50' : ''
                }`}
              >
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[760px] border-collapse text-left">
                    <thead className="bg-[#dfc4f4] text-[10px] font-medium text-[#67667a]">
                      <tr>
                        <th className="px-6 py-3 font-medium">Study Name</th>
                        <th className="px-6 py-3 font-medium">Disease</th>
                        <th className="px-6 py-3 font-medium">Types</th>
                        <th className="px-6 py-3 font-medium">Patients</th>
                        <th className="px-6 py-3 font-medium">
                          Availability
                        </th>
                        <th className="px-6 py-3 text-center font-medium">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredStudies.map((study) => (
                        <tr
                          key={study.id}
                          className="border-b border-[#e3e2eb] text-xs last:border-b-0 hover:bg-[#f8f9fd]"
                        >
                          <td className="whitespace-nowrap px-6 py-3 font-medium">
                            {study.name}
                          </td>

                          <td className="whitespace-nowrap px-6 py-3 text-[#555466]">
                            {study.disease}
                          </td>

                          <td className="px-6 py-3">
                            <div className="flex gap-1.5">
                              {study.types.map((type) => (
                                <StudyTypeIcon
                                  key={`${study.id}-${type}`}
                                  type={type}
                                />
                              ))}
                            </div>
                          </td>

                          <td className="whitespace-nowrap px-6 py-3 text-[#555466]">
                            {study.patients}
                          </td>

                          <td className="px-6 py-3">
                            <span
                              className={`inline-flex rounded-full px-2 py-1 text-[9px] font-medium ${
                                study.availability === 'Available'
                                  ? 'bg-[#dcf7ef] text-[#00896c]'
                                  : 'bg-[#e7e7eb] text-[#67667a]'
                              }`}
                            >
                              {study.availability}
                            </span>
                          </td>

                          <td className="px-6 py-3 text-center">
                            <button
                              type="button"
                              className="text-xs font-medium text-[#4343d5]"
                            >
                              View
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="flex flex-col gap-4 bg-[#f8f9fd] px-5 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[10px] font-medium text-[#555466]">
                    Showing 1 to {filteredStudies.length} of 240 datasets
                  </p>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      aria-label="Previous page"
                      onClick={() =>
                        setActivePage((page) => Math.max(1, page - 1))
                      }
                      className="grid h-8 w-8 place-items-center rounded text-[#9a99a8] hover:bg-white"
                    >
                      <ChevronLeft size={16} />
                    </button>

                    {[1, 2, 3, 4, 5].map((page) => (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setActivePage(page)}
                        className={`grid h-8 w-8 place-items-center rounded text-xs font-medium ${
                          activePage === page
                            ? 'bg-[#ddd9ff] text-[#4343d5]'
                            : 'text-[#302e59] hover:bg-white'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button
                      type="button"
                      aria-label="Next page"
                      onClick={() =>
                        setActivePage((page) => Math.min(5, page + 1))
                      }
                      className="grid h-8 w-8 place-items-center rounded text-[#302e59] hover:bg-white"
                    >
                      <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-2">
                {[
                  { label: 'Clinical', icon: FileSearch },
                  { label: 'Genetic', icon: Dna },
                  { label: 'Imaging', icon: Image },
                  { label: 'Treatment', icon: Stethoscope },
                  { label: 'Outcome', icon: Activity },
                ].map((filter) => {
                  const Icon = filter.icon

                  return (
                    <button
                      key={filter.label}
                      type="button"
                      className="flex h-9 items-center gap-2 rounded-full border border-[#c7c4d7]/60 bg-white px-3 text-[10px] font-medium text-[#302e59] hover:bg-[#f8f9fd]"
                    >
                      <Icon size={15} className="text-[#6257d9]" />
                      {filter.label}
                    </button>
                  )
                })}
              </div>
            </>
          ) : (
            <div className="mt-7 rounded-lg border border-[#e3e2eb] bg-[#f8f9fd] p-8 text-sm text-[#67667a]">
              The data dictionary will appear here.
            </div>
          )}
        </section>
      </div>
    </main>
  )
}