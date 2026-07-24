import { useEffect, useMemo, useState } from 'react'
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

function App() {
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
  const featuredCity = featuredState?.cities?.[0]
  const featuredPlaces = featuredCity?.places?.slice(0, 4) || []

  return (
    <div className="travel-app">
      <header className="top-nav top-nav--hero">
        <div className="container nav-shell">
          <a className="brand" href="#">TripPlanner</a>
          <nav className="desktop-nav" aria-label="Main navigation">
            <a className="nav-link active" href="#">Home</a>
            <a className="nav-link" href="#">About</a>
            <a className="nav-link" href="#">Packages</a>
          </nav>
          <form className="search-box" onSubmit={(event) => event.preventDefault()}>
            <input placeholder="Search destinations" />
            <button type="submit">Go</button>
          </form>
        </div>
      </header>

      <section className="hero-section">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="eyebrow">Travel Blue • Live itinerary feed</span>
            <h1>Your next journey begins here.</h1>
            <p>
              Discover destinations, travel moods, and city highlights directly from the live MockAPI response.
            </p>
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
              <article key={state.state_id} className="state-card">
                <img src={state.image} alt={state.name} />
                <div className="state-card-body">
                  <h3>{state.name}</h3>
                  <p>{state.description}</p>
                  <span>{state.cities.length} cities</span>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="container sections">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Featured itinerary</p>
              <h2>{featuredCity?.name || 'Latest city plan'}</h2>
            </div>
          </div>
          <div className="place-list">
            {featuredPlaces.map((place) => (
              <article key={place.place_id} className="place-card">
                <img src={place.place_img} alt={place.name} />
                <div>
                  <div className="place-meta">
                    <span>Day {place.day}</span>
                    <span>{place.time}</span>
                  </div>
                  <h3>{place.name}</h3>
                  <p>Curated stop from the live API destination data.</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </main>
    </div>
  )
}

export default App
