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

      <section className="container sections">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Travel vibes</p>
            <h2>Browse experiences by style</h2>
          </div>
        </div>
        <div className="vibe-grid">
          {appData.travelVibes.map((item) => (
            <article key={item.vibe_id} className="vibe-card">
              <img src={item.image} alt={item.title} />
              <div>
                <h3>{item.title}</h3>
                <p>{item.subtitle}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="container sections">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Destinations</p>
            <h2>Popular states to explore</h2>
          </div>
        </div>
        <div className="state-grid">
          {appData.states.map((state) => (
            <Link key={state.state_id} to={`/state/${state.state_id}`} className="state-card">
              <img src={state.image} alt={state.name} />
              <div className="state-card-body">
                <h3>{state.name}</h3>
                <p>{state.description}</p>
                <span>Explore cities →</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  )
}

function StatePage({ appData, loading, error }) {
  const { stateId } = useParams()
  const currentState = appData.states.find((state) => state.state_id === Number.parseInt(stateId, 10))

  if (loading) {
    return <div className="container empty-state">Loading travel data…</div>
  }

  if (error) {
    return <div className="container empty-state">{error}</div>
  }

  if (!currentState) {
    return <div className="container empty-state">We could not find that destination.</div>
  }

  return (
    <div className="container sections">
      <div className="page-hero">
        <div>
          <p className="eyebrow">State overview</p>
          <h1>{currentState.name}</h1>
          <p>{currentState.description}</p>
        </div>
        <Link to="/" className="text-link">Back home</Link>
      </div>

      <div className="state-grid state-grid--compact">
        {currentState.cities.map((city) => (
          <Link key={city.city_id} to={`/city/${city.city_id}`} className="state-card">
            <img src={city.image} alt={city.name} />
            <div className="state-card-body">
              <h3>{city.name}</h3>
              <p>{city.description}</p>
              <span>See places →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function CityPage({ appData, loading, error }) {
  const { cityId } = useParams()
  const currentCity = useMemo(() => {
    for (const state of appData.states) {
      const city = state.cities.find((entry) => entry.city_id === Number.parseInt(cityId, 10))
      if (city) return { ...city, stateName: state.name }
    }
    return null
  }, [appData.states, cityId])

  if (loading) {
    return <div className="container empty-state">Loading travel data…</div>
  }

  if (error) {
    return <div className="container empty-state">{error}</div>
  }

  if (!currentCity) {
    return <div className="container empty-state">We could not find that city.</div>
  }

  return (
    <div className="container sections">
      <div className="page-hero">
        <div>
          <p className="eyebrow">City itinerary</p>
          <h1>{currentCity.name}</h1>
          <p>{currentCity.description}</p>
          <p className="pill">{currentCity.stateName}</p>
        </div>
        <Link to="/" className="text-link">Back home</Link>
      </div>

      <div className="place-list">
        {currentCity.places.map((place) => (
          <article key={place.place_id} className="place-card">
            <img src={place.place_img} alt={place.name} />
            <div>
              <div className="place-meta">
                <span>Day {place.day}</span>
                <span>{place.time}</span>
              </div>
              <h3>{place.name}</h3>
              <p>Visit this iconic stop during your trip and add it to your personal itinerary.</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  )
}

function EnquiryPage() {
  return (
    <div className="container sections">
      <div className="section-card">
        <p className="eyebrow">Enquiry</p>
        <h1>Plan your next escape with a specialist</h1>
        <p>Tell us your travel style, dates, group size, and destination preferences.</p>
        <form className="enquiry-form">
          <input placeholder="Your name" />
          <input placeholder="Email address" />
          <input placeholder="Destination" />
          <textarea rows="5" placeholder="Tell us about your travel plan" />
          <button type="submit">Send enquiry</button>
        </form>
      </div>
    </div>
  )
}

function HistoryPage({ appData }) {
  const historyItems = [
    { id: 1, label: 'Latest API state', title: appData.states[0]?.name || 'Featured destination', type: 'state' },
    { id: 2, label: 'Latest API city', title: appData.states[0]?.cities[0]?.name || 'Popular city', type: 'city' },
  ]

  return (
    <div className="container sections">
      <div className="section-card">
        <p className="eyebrow">History</p>
        <h1>Your saved and recently viewed travel ideas</h1>
        <div className="history-list">
          {historyItems.map((item) => (
            <div key={item.id} className="history-item">
              <div>
                <h3>{item.title}</h3>
                <p>{item.label}</p>
              </div>
              <span className="pill">{item.type}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function SearchPage({ appData }) {
  const [searchParams] = useSearchParams()
  const query = searchParams.get('q')?.toLowerCase() ?? ''

  const results = useMemo(() => {
    const matches = []
    appData.states.forEach((state) => {
      const stateMatch = state.name.toLowerCase().includes(query)
      const cityMatches = state.cities.filter((city) => city.name.toLowerCase().includes(query) || city.description.toLowerCase().includes(query))
      const placeMatches = state.cities.flatMap((city) =>
        city.places.filter((place) => place.name.toLowerCase().includes(query))
      )

      if (stateMatch || cityMatches.length || placeMatches.length) {
        matches.push({ type: 'state', item: state })
        cityMatches.forEach((city) => matches.push({ type: 'city', item: city }))
        placeMatches.forEach((place) => matches.push({ type: 'place', item: place }))
      }
    })

    return matches
  }, [appData.states, query])

  return (
    <div className="container sections">
      <div className="section-card">
        <p className="eyebrow">Search</p>
        <h1>{query ? `Results for “${query}”` : 'Search your next destination'}</h1>
        {!query ? (
          <p>Use the search bar to find states, cities, and places.</p>
        ) : results.length === 0 ? (
          <p>No matching destinations yet. Try another keyword.</p>
        ) : (
          <div className="history-list">
            {results.map((result, index) => (
              <div key={`${result.type}-${index}`} className="history-item">
                <div>
                  <h3>{result.type === 'state' ? result.item.name : result.item.name}</h3>
                  <p>{result.type === 'state' ? result.item.description : result.type === 'city' ? result.item.description : 'Place itinerary match'}</p>
                </div>
                <span className="pill">{result.type}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <TravelApp />
    </BrowserRouter>
  )
}

export default App
s</div> }

// WRAPPER DEFINITION WITH REPOSITORY BASENAME ROUTING ADDED
export default function App() {
  return (
    <BrowserRouter basename="/WayoutWebsiteSC">
      <TravelApp />
    </BrowserRouter>
  )
}
