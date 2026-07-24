import { useEffect, useMemo, useState } from 'react'
import { BrowserRouter, Link, Route, Routes, useParams } from 'react-router-dom'
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

function AppShell() {
  const [travelData, setTravelData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let isMounted = true

    async function loadData() {
      try {
        const response = await fetch(API_URL)
        if (!response.ok) throw new Error('Unable to load travel data')
        const payload = await response.json()
        if (isMounted) {
          setTravelData(payload)
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

  const appData = useMemo(() => normalizeTravelData(travelData), [travelData])
  const totalPlaces = appData.states.reduce((count, state) => count + state.cities.reduce((cityCount, city) => cityCount + city.places.length, 0), 0)
  const featuredState = appData.states[0]

  return (
    <div className="travel-app">
      <header className="top-nav top-nav--hero">
        <div className="container nav-shell">
          <Link className="brand" to="/">TripPlanner</Link>
          <div className="nav-actions">
            <nav className="desktop-nav" aria-label="Main navigation">
              <Link className="nav-link active" to="/">Home</Link>
              <Link className="nav-link" to="/enquiry">Enquiry</Link>
            </nav>
            <form className="search-box" onSubmit={(event) => event.preventDefault()}>
              <input placeholder="Search destinations" />
              <button type="submit">Go</button>
            </form>
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<HomePage appData={appData} loading={loading} error={error} totalPlaces={totalPlaces} featuredState={featuredState} />} />
        <Route path="/enquiry" element={<EnquiryPage />} />
        <Route path="/state/:stateId" element={<StatePage appData={appData} />} />
        <Route path="/city/:cityId" element={<CityPage appData={appData} />} />
        <Route path="/place/:placeId" element={<PlacePage appData={appData} />} />
      </Routes>
    </div>
  )
}

function HomePage({ appData, loading, error, totalPlaces, featuredState }) {
  return (
    <>
      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Travel Blue • Live itinerary feed</span>
            <h1>Your next journey begins here.</h1>
            <p>Discover destinations, travel moods, and city highlights directly from the live MockAPI response.</p>
            <form className="hero-search" onSubmit={(event) => event.preventDefault()}>
              <input placeholder="Search cities, states or places" />
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
            <h3>{featuredState?.name || 'Featured destination'}</h3>
            <p>{featuredState?.description || 'The latest destination data from the API is now shown here.'}</p>
            <button type="button">View itinerary</button>
          </div>
        </div>
      </section>

      <main>
        <section className="container sections">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Featured banners</p>
              <h2>Pick a vibe for your next escape</h2>
            </div>
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
                  <span>{state.cities.length} cities</span>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section className="container sections home-highlight-section">
          <div className="home-highlight-copy">
            <p className="eyebrow">Why travelers choose us</p>
            <h2>Plan every stop with calm confidence.</h2>
            <p>From lush hill stations to scenic coastlines, TripPlanner helps you organize your journey day by day with an elegant itinerary flow.</p>
            <ul>
              <li>Discover cities and places tailored to each day</li>
              <li>Browse curated travel moods and getaway ideas</li>
              <li>Keep your trip organized with clear itinerary sections</li>
            </ul>
          </div>
          <div className="home-photo-grid">
            <img src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80" alt="Travel landscape" />
            <img src="https://images.unsplash.com/photo-1527631746610-bca00a040d60?auto=format&fit=crop&w=800&q=80" alt="Roadtrip scenery" />
            <img src="https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?auto=format&fit=crop&w=800&q=80" alt="Mountain destination" />
          </div>
        </section>
      </main>
    </>
  )
}

function StatePage({ appData }) {
  const { stateId } = useParams()
  const currentState = appData.states.find((state) => state.state_id === Number.parseInt(stateId, 10))

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
              <span>Open itinerary →</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function CityPage({ appData }) {
  const { cityId } = useParams()
  const currentCity = useMemo(() => {
    for (const state of appData.states) {
      const city = state.cities.find((entry) => entry.city_id === Number.parseInt(cityId, 10))
      if (city) return { ...city, stateName: state.name }
    }
    return null
  }, [appData.states, cityId])

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
          <Link key={place.place_id} to={`/place/${place.place_id}`} className="place-card">
            <img src={place.place_img} alt={place.name} />
            <div>
              <div className="place-meta">
                <span>Day {place.day}</span>
                <span>{place.time}</span>
              </div>
              <h3>{place.name}</h3>
              <p>Tap to view this stop inside the full itinerary.</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}

function PlacePage({ appData }) {
  const { placeId } = useParams()
  const currentPlace = useMemo(() => {
    for (const state of appData.states) {
      for (const city of state.cities) {
        const place = city.places.find((entry) => entry.place_id === Number.parseInt(placeId, 10))
        if (place) return { place, city, state }
      }
    }
    return null
  }, [appData.states, placeId])

  if (!currentPlace) {
    return <div className="container empty-state">We could not find that place.</div>
  }

  const itineraryByDay = useMemo(() => {
    const groups = {}
    currentPlace.city.places.forEach((place) => {
      const day = place.day || '1'
      if (!groups[day]) groups[day] = []
      groups[day].push(place)
    })

    return Object.entries(groups).sort(([dayA], [dayB]) => Number(dayA) - Number(dayB))
  }, [currentPlace.city.places])

  return (
    <div className="container sections">
      <div className="page-hero">
        <div>
          <p className="eyebrow">Place itinerary</p>
          <h1>{currentPlace.place.name}</h1>
          <p>{currentPlace.city.name} • {currentPlace.state.name}</p>
        </div>
        <Link to={`/city/${currentPlace.city.city_id}`} className="text-link">Back to city</Link>
      </div>

      <div className="place-detail-card">
        <img src={currentPlace.place.place_img} alt={currentPlace.place.name} />
        <div>
          <p className="eyebrow">Selected stop</p>
          <h2>{currentPlace.place.name}</h2>
          <p>Planned for Day {currentPlace.place.day} at {currentPlace.place.time}.</p>
        </div>
      </div>

      <div className="itinerary-days">
        {itineraryByDay.map(([day, places]) => (
          <section key={day} className="day-section">
            <h3>Day {day}</h3>
            <div className="place-list">
              {places.map((place) => (
                <article key={place.place_id} className="place-card">
                  <img src={place.place_img} alt={place.name} />
                  <div>
                    <div className="place-meta">
                      <span>Day {place.day}</span>
                      <span>{place.time}</span>
                    </div>
                    <h3>{place.name}</h3>
                    <p>Included in the full itinerary for this destination.</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
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
        <p>Share your preferred destination, travel dates, and group size and we’ll help you shape the itinerary.</p>
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

function App() {
  return (
    <BrowserRouter basename="/WayoutWebsiteSC">
      <AppShell />
    </BrowserRouter>
  )
}

export default App
