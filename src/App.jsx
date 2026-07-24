import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Link, NavLink, Route, Routes, useLocation, useNavigate, useParams, useSearchParams } from 'react-router-dom'
import './App.css'

const API_URL = 'https://6a4791b7abfcbaade118ac80.mockapi.io/TripData/app_data'
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'

function normalizeTravelData(payload) {
  const source = Array.isArray(payload) ? payload[0] : payload || {}
  const banners = (source?.ui_data?.home?.banners || [])
    .filter((banner) => banner?.is_visible !== false)
    .map((banner, index) => ({
      title: banner?.title || `Featured destination ${index + 1}`,
      subtitle: banner?.subtitle || 'Live from your MockAPI feed',
      image: banner?.image || FALLBACK_IMAGE,
    }))

  const travelVibes = (source?.travel_vibes || [])
    .filter((item) => item?.is_visible !== false)
    .map((item) => ({
      vibe_id: item?.vibe_id || item?.title?.toLowerCase(),
      title: item?.title || 'Travel vibe',
      subtitle: item?.subtitle || 'Curated experience',
      image: item?.image || FALLBACK_IMAGE,
    }))

  const states = (source?.states || [])
    .filter((state) => state?.is_visible !== false)
    .map((state) => ({
      state_id: state?.state_id,
      name: state?.name || 'Unknown state',
      image: state?.image || FALLBACK_IMAGE,
      description: state?.description || `Explore travel ideas in ${state?.name || 'this region'}.`,
      cities: (state?.cities || [])
        .filter((city) => city?.is_visible !== false)
        .map((city) => ({
          city_id: city?.city_id,
          state_id: city?.state_id,
          name: city?.name || 'Unknown city',
          description: city?.description || 'Discover local highlights and must-see places.',
          image: city?.image || state?.image || FALLBACK_IMAGE,
          places: (city?.places || [])
            .filter((place) => place?.is_visible !== false)
            .map((place) => ({
              place_id: place?.place_id,
              name: place?.name || 'Place',
              day: place?.day || '1',
              time: place?.time || 'Flexible',
              place_img: place?.place_img || city?.image || state?.image || FALLBACK_IMAGE,
            })),
        })),
    }))

  return {
    banners,
    travelVibes,
    states,
    splash: source?.ui_data?.splash || {},
  }
}

function TravelApp() {
  const location = useLocation()
  const [searchValue, setSearchValue] = useState('')
  const [travelPayload, setTravelPayload] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const response = await fetch(API_URL)
        if (!response.ok) throw new Error('Failed to load data from the API')
        const payload = await response.json()
        if (isMounted) {
          setTravelPayload(payload)
          setError('')
        }
      } catch (err) {
        if (isMounted) {
          setError(err.message || 'Unable to load travel data right now.')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      isMounted = false
    }
  }, [])

  const appData = useMemo(() => normalizeTravelData(travelPayload), [travelPayload])

  const navItems = [
    { to: '/', label: 'Home', icon: '⌂' },
    { to: '/enquiry', label: 'Enquiry', icon: '✉' },
    { to: '/history', label: 'History', icon: '◷' },
  ]

  const handleSearch = (event) => {
    event.preventDefault()
    const query = searchValue.trim()
    if (query) {
      navigate(`/search?q=${encodeURIComponent(query)}`)
      setSearchValue('')
    }
  }

  return (
    <div className="travel-app">
      <header className={`top-nav ${location.pathname === '/' ? 'top-nav--hero' : ''}`}>
        <div className="container nav-shell">
          <Link to="/" className="brand">TripPlanner</Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
                {item.label}
              </NavLink>
            ))}
          </nav>
          <form className="search-box" onSubmit={handleSearch}>
            <input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Search destinations" />
            <button type="submit">Go</button>
          </form>
        </div>
      </header>

      <main className="content-area">
        <Routes>
          <Route path="/" element={<HomePage onSearch={handleSearch} searchValue={searchValue} setSearchValue={setSearchValue} appData={appData} loading={loading} error={error} />} />
          <Route path="/state/:stateId" element={<StatePage appData={appData} loading={loading} error={error} />} />
          <Route path="/city/:cityId" element={<CityPage appData={appData} loading={loading} error={error} />} />
          <Route path="/enquiry" element={<EnquiryPage />} />
          <Route path="/history" element={<HistoryPage appData={appData} />} />
          <Route path="/search" element={<SearchPage appData={appData} />} />
        </Routes>
      </main>

      <nav className="mobile-nav" aria-label="Mobile navigation">
        {navItems.map((item) => (
          <NavLink key={item.to} to={item.to} className={({ isActive }) => `mobile-nav-link ${isActive ? 'active' : ''}`}>
            <span>{item.icon}</span>
            <small>{item.label}</small>
          </NavLink>
        ))}
      </nav>
    </div>
  )
}

function HomePage({ onSearch, searchValue, setSearchValue, appData, loading, error }) {
  const totalPlaces = appData.states.reduce((count, state) => count + state.cities.reduce((cityCount, city) => cityCount + city.places.length, 0), 0)

  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Travel Blue • Smart planning</span>
            <h1>Your next journey begins here.</h1>
            <p>Explore {appData.states.length} states and {totalPlaces} curated places from your live MockAPI feed.</p>
            <form className="hero-search" onSubmit={onSearch}>
              <input value={searchValue} onChange={(event) => setSearchValue(event.target.value)} placeholder="Search cities, states or places" />
              <button type="submit">Start planning</button>
            </form>
            <div className="hero-stats">
              <div><strong>{appData.states.length}+</strong><span>States</span></div>
              <div><strong>{totalPlaces}+</strong><span>Places</span></div>
              <div><strong>4.9</strong><span>Traveler rating</span></div>
            </div>
          </div>
          <div className="hero-card">
            <p className="card-label">Live API snapshot</p>
            <h3>{appData.states[0]?.name || 'Featured destination'}</h3>
            <p>{appData.states[0]?.description || 'The latest destination data from your API is now displayed here.'}</p>
            <button type="button">View itinerary</button>
          </div>
        </div>
      </section>

      <section className="container sections">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Featured banners</p>
            <h2>Pick a vibe for your next escape</h2>
          </div>
          <Link to="/search" className="text-link">Browse all</Link>
        </div>
        {loading ? (
          <p className="empty-state">Loading travel data…</p>
        ) : error ? (
          <p className="empty-state">{error}</p>
        ) : (
          <div className="banner-grid">
            {appData.banners.map((banner) => (
              <article key={banner.title} className="banner-card">
                <img src={banner.image} alt={banner.title} />
                <div className="banner-text">
                  <h3>{banner.title}</h3>
                  <p>{banner.subtitle}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </>
  )
}

// Fallback component definitions to prevent compilation crashes
function StatePage() { return <div className="container">State Details Page</div> }
function CityPage() { return <div className="container">City Itinerary Page</div> }
function EnquiryPage() { return <div className="container">Enquiry Contact Form</div> }
function HistoryPage() { return <div className="container">Booking History Log</div> }
function SearchPage() { return <div className="container">Destination Search Results</div> }

// WRAPPER DEFINITION WITH REPOSITORY BASENAME ROUTING ADDED
export default function App() {
  return (
    <BrowserRouter basename="/WayoutWebsiteSC">
      <TravelApp />
    </BrowserRouter>
  )
}
