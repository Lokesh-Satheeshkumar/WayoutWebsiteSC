import { useEffect, useMemo, useState, useRef } from 'react'
import { HashRouter, Link, Route, Routes, useNavigate, useParams } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import HeroCarousel from './components/HeroCarousel/HeroCarousel'
import './App.css'

// Import carousel images
import crop1 from './assets/crop1.jpeg'
import crop2 from './assets/crop2.jpeg'
import crop3 from './assets/corp3.jpeg'
import crop4 from './assets/crop4.jpeg'
import crop5 from './assets/crop5.jpeg'
import clg1 from './assets/clg (1).jpeg'
import clg2 from './assets/clg (2).jpeg'
import clg3 from './assets/clg (3).jpeg'
import clg4 from './assets/clg (4).jpeg'
import clg5 from './assets/clg (5).jpeg'
import clg6 from './assets/clg (6).jpeg'
import clg7 from './assets/clg (7).jpeg'
import clg8 from './assets/clg (8).jpeg'
import clg9 from './assets/clg (9).jpeg'
import clg10 from './assets/clg (10).jpeg'

const corporateImages = [crop1, crop2, crop3, crop4, crop5]
const collegeImages = [clg1, clg2, clg3, clg4, clg5, clg6, clg7, clg8, clg9, clg10]

// Subtle ambient dust particles drifting near the hero → destination transition.
const ambientParticles = [
  { left: '10%', top: '80%', size: 6, duration: 18, delay: 0 },
  { left: '26%', top: '68%', size: 4, duration: 22, delay: 2 },
  { left: '43%', top: '86%', size: 5, duration: 19, delay: 4 },
  { left: '60%', top: '72%', size: 3, duration: 24, delay: 1 },
  { left: '76%', top: '84%', size: 6, duration: 17, delay: 3 },
  { left: '90%', top: '70%', size: 4, duration: 23, delay: 5 },
  { left: '52%', top: '64%', size: 3, duration: 26, delay: 6 },
]

const API_URL = 'https://6a4791b7abfcbaade118ac80.mockapi.io/TripData/app_data'
const FALLBACK_IMAGE = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'
const EMAILJS_SERVICE_ID = 'service_1xgtzhr'
const EMAILJS_TEMPLATE_ID = 'template_f3li2kr'
const EMAILJS_PUBLIC_KEY = 'AdfOAXHsmzpiT0i-h'
const BACKEND_URL = "http://localhost:3000/api/enquiry";

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
  const [searchQuery, setSearchQuery] = useState('')
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [isHeaderScrolled, setIsHeaderScrolled] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY)

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

  useEffect(() => {
    const updateBackToTop = () => {
      setShowBackToTop(window.scrollY > 360)
      setIsHeaderScrolled(window.scrollY > 12)
    }
    updateBackToTop()
    window.addEventListener('scroll', updateBackToTop, { passive: true })
    return () => window.removeEventListener('scroll', updateBackToTop)
  }, [])

  const appData = useMemo(() => normalizeTravelData(travelData), [travelData])
  const totalPlaces = appData.states.reduce((count, state) => count + state.cities.reduce((cityCount, city) => cityCount + city.places.length, 0), 0)
  const featuredState = appData.states[0]

  const handleSearchSubmit = (event) => {
    event.preventDefault()
    if (searchQuery.trim()) {
      navigate('/')
    }
  }

  return (
    <div className="travel-app">
      <header className={`top-nav top-nav--hero ${isHeaderScrolled ? 'is-scrolled' : ''}`}>
        <div className="container nav-shell">
          <Link className="brand" to="/">Wayout Tourz</Link>
          <div className="nav-actions">
            <nav className="desktop-nav" aria-label="Main navigation">
              <Link className="nav-link active" to="/">Home</Link>
              <Link className="nav-link nav-link--primary" to="/enquiry">Enquiry <span aria-hidden="true">→</span></Link>
            </nav>
         {/* //   <form className="search-box" onSubmit={handleSearchSubmit}>
              <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Search destinations" />
              <button type="submit">Go</button>
            </form> */}
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<HomePage appData={appData} loading={loading} error={error} totalPlaces={totalPlaces} featuredState={featuredState} searchQuery={searchQuery} onSearchChange={(event) => setSearchQuery(event.target.value)} onSearchSubmit={handleSearchSubmit} />} />
        <Route path="/enquiry" element={<EnquiryPage />} />
        <Route path="/state/:stateId" element={<StatePage appData={appData} />} />
        <Route path="/city/:cityId" element={<CityPage appData={appData} />} />
        <Route path="/place/:placeId" element={<PlacePage appData={appData} />} />
      </Routes>
      <button
        className={`back-to-top ${showBackToTop ? 'is-visible' : ''}`}
        type="button"
        aria-label="Back to top"
        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
      >
        <span aria-hidden="true">↑</span>
      </button>
    </div>
  )
}

function HomePage({ appData, loading, error, totalPlaces, featuredState, searchQuery, onSearchChange, onSearchSubmit }) {
  const normalizedQuery = searchQuery.trim().toLowerCase()
  const hasSearch = normalizedQuery.length > 0

  const heroWrapRef = useRef(null)
  const destSectionRef = useRef(null)

  // Scroll effect: dim + scale the hero while the destination section floats up.
  useEffect(() => {
    const heroWrap = heroWrapRef.current
    const destSection = destSectionRef.current
    if (!heroWrap || !destSection) return

    let ticking = false
    const update = () => {
      ticking = false
      const vh = window.innerHeight || 1
      // Progress is based on document scroll, so the hero starts fully vivid
      // rather than appearing dimmed on the initial render.
      const progress = Math.min(Math.max(window.scrollY / (vh * 0.7), 0), 1)
      const eased = progress * progress * (3 - 2 * progress) // smoothstep
      const sectionRect = destSection.getBoundingClientRect()
      const exitProgress = Math.min(Math.max(-sectionRect.top / 300, 0), 1)

      // Fade the hero fully away before it reaches the destination heading.
      heroWrap.style.opacity = (1 - eased).toFixed(3)
      heroWrap.style.transform = `scale(${(1 - eased * 0.03).toFixed(4)})`

      // Let the hero lead the transition; destinations float in after it fades.
      destSection.style.opacity = (eased * (1 - exitProgress)).toFixed(3)
      destSection.style.transform = `translateY(${(((1 - eased) * 80) - (exitProgress * 32)).toFixed(1)}px)`
    }

    const onScroll = () => {
      if (!ticking) {
        ticking = true
        requestAnimationFrame(update)
      }
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  // Reveal destination cards one by one when the section enters the viewport.
  useEffect(() => {
    const destSection = destSectionRef.current
    if (!destSection) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            destSection.classList.add('is-visible')
            observer.disconnect()
          }
        })
      },
      { threshold: 0.15 },
    )

    observer.observe(destSection)
    return () => observer.disconnect()
  }, [])

const [corporateScroll, setCorporateScroll] = useState(0)
const [corporateTransition, setCorporateTransition] = useState(true)

const [collegeScroll, setCollegeScroll] = useState(0)
const [collegeTransition, setCollegeTransition] = useState(true)

const corporateTimerRef = useRef(null)
  const collegeTimerRef = useRef(null)

  // Image card width (in percentage): 100 / number of visible items
  const CARD_WIDTH = 25 // Show 4 images at once (100 / 4 = 25%)
const corporateImagesExtended = [
  ...corporateImages,
  ...corporateImages,
  ...corporateImages,
]  
const collegeImagesExtended = [
  ...collegeImages,
  ...collegeImages,
  ...collegeImages,
]
useEffect(() => {
  corporateTimerRef.current = setInterval(() => {
    setCorporateScroll((prev) => prev + 1)
  }, 2000)

  return () => clearInterval(corporateTimerRef.current)
}, [])


useEffect(() => {

  if (corporateScroll === corporateImages.length) {

    setTimeout(() => {

      setCorporateTransition(false)

      setCorporateScroll(0)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCorporateTransition(true)
        })
      })

    }, 600)

  }

}, [corporateScroll])

  // Very slow continuous college carousel scroll
  useEffect(() => {
    collegeTimerRef.current = setInterval(() => {
      setCollegeScroll((prev) => prev + 1)
    }, 2000) // Very slow: 3 seconds per image
    return () => clearInterval(collegeTimerRef.current)
  }, [])

  useEffect(() => {

  if (collegeScroll === collegeImages.length) {

    setTimeout(() => {

      setCollegeTransition(false)

      setCollegeScroll(0)

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setCollegeTransition(true)
        })
      })

    }, 600)

  }

}, [collegeScroll])

  const [visibleElements, setVisibleElements] = useState({})

  // Scroll animation - reveal content as it enters viewport
  useEffect(() => {
    const observerOptions = {
      threshold: 0.1,
      rootMargin: '0px 0px -100px 0px',
    }

    const observerCallback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setVisibleElements((prev) => ({
            ...prev,
            [entry.target.id]: true,
          }))
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    const elementsToObserve = document.querySelectorAll('[data-animate]')
    elementsToObserve.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [])

  const searchResults = useMemo(() => {
    if (!hasSearch) return { states: [], cities: [], places: [] }

    const states = appData.states.filter(
      (state) =>
        state.name.toLowerCase().includes(normalizedQuery) ||
        state.description.toLowerCase().includes(normalizedQuery),
    )

    const cities = appData.states.flatMap((state) =>
      state.cities
        .filter(
          (city) =>
            city.name.toLowerCase().includes(normalizedQuery) ||
            city.description.toLowerCase().includes(normalizedQuery),
        )
        .map((city) => ({ ...city, stateName: state.name })),
    )

    const places = appData.states.flatMap((state) =>
      state.cities.flatMap((city) =>
        city.places
          .filter((place) => place.name.toLowerCase().includes(normalizedQuery))
          .map((place) => ({ ...place, cityName: city.name, cityId: city.city_id, stateName: state.name })),
      ),
    )

    return { states, cities, places }
  }, [appData.states, normalizedQuery, hasSearch])

return (
    <>
      <div className="hero-cinematic" ref={heroWrapRef}>
        <HeroCarousel />
        <div className="ambient-particles" aria-hidden="true">
          {ambientParticles.map((p, i) => (
            <span
              key={i}
              className="ambient-particle"
              style={{
                left: p.left,
                top: p.top,
                width: p.size,
                height: p.size,
                animationDuration: `${p.duration}s`,
                animationDelay: `${p.delay}s`,
              }}
            />
          ))}
        </div>
      </div>
      <div className="mobile-scroll-hint" aria-hidden="true">
        <span>Discover destinations</span>
        <i />
      </div>

      {hasSearch && (
        <section className="container sections search-results">
          <div className="section-heading">
            <div>
              <p className="eyebrow">Search results</p>
              <h2>Results for “{searchQuery}”</h2>
            </div>
          </div>
          {loading ? (
            <p className="empty-state">Searching…</p>
          ) : error ? (
            <p className="empty-state">{error}</p>
          ) : searchResults.states.length === 0 && searchResults.cities.length === 0 && searchResults.places.length === 0 ? (
            <p className="empty-state">No results found for “{searchQuery}”.</p>
          ) : (
            <>
              {searchResults.states.length > 0 && (
                <div className="section-block">
                  <h3>Matching states</h3>
                  <div className="state-grid">
                    {searchResults.states.map((state) => (
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
                </div>
              )}

              {searchResults.cities.length > 0 && (
                <div className="section-block">
                  <h3>Matching cities</h3>
                  <div className="state-grid">
                    {searchResults.cities.map((city) => (
                      <Link key={city.city_id} to={`/city/${city.city_id}`} className="state-card">
                        <img src={city.image} alt={city.name} />
                        <div className="state-card-body">
                          <h3>{city.name}</h3>
                          <p>{city.description}</p>
                          <span>{city.stateName}</span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.places.length > 0 && (
                <div className="section-block">
                  <h3>Matching itinerary places</h3>
                  <div className="place-list">
                    {searchResults.places.map((place) => (
                      <Link key={place.place_id} to={`/place/${place.place_id}`} className="place-card place-card--link">
                        <img src={place.place_img} alt={place.name} />
                        <div>
                          <div className="place-meta">
                            <span>Day {place.day}</span>
                            <span>{place.time}</span>
                          </div>
                          <h3>{place.name}</h3>
                          <p>{place.cityName}, {place.stateName}</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </section>
      )}

      <main>
        <section className="destination-section" ref={destSectionRef} id="states-section">
          <div className="destination-container">
            <div className="destination-heading">
              <div>
                <p className="destination-eyebrow">Destinations</p>
                <h2 className="destination-title">Popular states to explore</h2>
              </div>
              <Link to="/" className="destination-view-all" aria-label="View all states">
                View all states <span aria-hidden="true">→</span>
              </Link>
            </div>
            <div className="destination-grid">
              {appData.states.map((state, index) => (
                <Link
                  key={state.state_id}
                  to={`/state/${state.state_id}`}
                  className="destination-card"
                  style={{ '--i': index }}
                >
                  <div className="destination-card-media">
                    <img src={state.image} alt={state.name} />
                    <div className="destination-card-shade" />
                  </div>
                  <div className="destination-card-body">
                    <h3>{state.name}</h3>
                    <p>{state.description}</p>
                    <span>{state.cities.length} cities</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="sections-wrapper" id="corp-section" data-animate>
          <div className="sections-inner">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Recent Trips</p>
                <h2>Corporate adventures</h2>
              </div>
            </div>
            <div className="carousel-wrapper-scroll">

<div
  className="carousel-container-scroll"
  style={{
    transform: `translateX(-${corporateScroll * CARD_WIDTH}%)`,
    transition: corporateTransition
      ? "transform 0.6s ease"
      : "none",
  }}
>              {corporateImagesExtended.map((img, idx) => (
                <div key={`corp-${idx}`} className="carousel-slide-scroll">
                  <img src={img} alt={`Corporate trip ${idx + 1}`} />
                </div>
              ))}
              </div>
            </div>
          </div>
        </section>

        <section className="sections-wrapper" id="college-section" data-animate>
          <div className="sections-inner">
            <div className="section-heading">
              <div>
                <p className="eyebrow">Student Journeys</p>
                <h2>College IV experiences</h2>
              </div>
            </div>
            <div className="carousel-wrapper-scroll">
            <div className="carousel-container-scroll" style={{
  transform: `translateX(-${collegeScroll * CARD_WIDTH}%)`,
  transition: collegeTransition
    ? "transform 0.6s ease"
    : "none",
}}>
              {collegeImagesExtended.map((img, idx) => (
                <div key={`clg-${idx}`} className="carousel-slide-scroll">
                  <img src={img} alt={`College IV trip ${idx + 1}`} />
                </div>
              ))}
              </div>
            </div>
          </div>
        </section>

        <section className="sections-wrapper" id="highlight-section" data-animate>
          <div className="sections-inner home-highlight-section">
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
          <Link key={place.place_id} to={`/place/${place.place_id}`} className="place-card place-card--link">
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
  const defaultFormData = {
    fullName: '',
    phoneNumber: '',
    email: '',
    preferredDestination: '',
    fromDate: '',
    toDate: '',
    numberOfDays: '',
    adults: '',
    children: '',
    tripType: 'College IV',
    accommodation: 'Budget Hotel',
    hotelResort: '',
    transportation: 'Bus',
    transportationSeater: '4 Seater',
    budgetRange: '',
    specificRequests: '',
    remarks: '',
  }

  const [formData, setFormData] = useState(defaultFormData)
  const [isSending, setIsSending] = useState(false)
  const [statusMessage, setStatusMessage] = useState('')
  const [statusType, setStatusType] = useState('')

  const handleInputChange = (event) => {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  }

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      return 'Full Name is required.'
    }

    if (!formData.phoneNumber.trim()) {
      return 'Phone Number is required.'
    }

    if (!/^\d+$/.test(formData.phoneNumber.trim())) {
      return 'Phone Number must contain only digits.'
    }

    if (formData.email.trim() && !validateEmail(formData.email.trim())) {
      return 'Please enter a valid email address.'
    }

    if (formData.fromDate && formData.toDate && formData.fromDate > formData.toDate) {
      return 'From Date cannot be after To Date.'
    }

    return ''
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    const validationError = validateForm()
    if (validationError) {
      setStatusType('error')
      setStatusMessage(validationError)
      return
    }

    setIsSending(true)
    setStatusMessage('')
    setStatusType('')

    const templateParams = {
      full_name: formData.fullName,
      phone_number: formData.phoneNumber,
      email: formData.email,
      preferred_destination: formData.preferredDestination,
      from_date: formData.fromDate,
      to_date: formData.toDate,
      number_of_days: formData.numberOfDays,
      adults: formData.adults,
      children: formData.children,
      trip_type: formData.tripType,
      accommodation: formData.accommodation,
      hotel_resort: formData.hotelResort,
      transportation: formData.transportation,
      transportation_seater: formData.transportationSeater,
      budget_range: formData.budgetRange,
      specific_requests: formData.specificRequests,
      remarks: formData.remarks,
    }

  try {

 const response = await axios.post(
  `https://graph.facebook.com/v23.0/${process.env.PHONE_NUMBER_ID}/messages`,
  {
    messaging_product: "whatsapp",
    to: process.env.RECIPIENT,
    type: "template",
    template: {
      name: "tour_enquiry",
      language: {
        code: "en"
      },
      components: [
        {
          type: "body",
          parameters: [
            { type: "text", text: req.body.name || "" },
            { type: "text", text: req.body.phone || "" },
            { type: "text", text: req.body.email || "" },
            { type: "text", text: req.body.destination || "" },
            { type: "text", text: req.body.fromDate || "" },
            { type: "text", text: req.body.toDate || "" },
            { type: "text", text: req.body.adults || "" },
            { type: "text", text: req.body.children || "" },
            { type: "text", text: req.body.budget || "" },
            { type: "text", text: req.body.remarks || "" }
          ]
        }
      ]
    }
  },
  {
    headers: {
      Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
      "Content-Type": "application/json"
    }
  }
);

console.log(response.data);

  if (!response.ok) {
    throw new Error("WhatsApp API failed");
  }

  // Send Email
  await emailjs.send(
    EMAILJS_SERVICE_ID,
    EMAILJS_TEMPLATE_ID,
    templateParams
  );

  setStatusType('success');
  setStatusMessage('Thank you! Your enquiry has been sent successfully.');

  setFormData(defaultFormData);

} catch (error) {

  console.error(error);

  setStatusType('error');
  setStatusMessage('Failed to send enquiry. Please try again.');

} finally {

  setIsSending(false);

}
  }

  return (
    <div className="container sections">
      <div className="section-card enquiry-card">
        <p className="eyebrow">Enquiry</p>
        <h1>Plan your next escape with a specialist</h1>
        <p>Share your preferred destination, travel dates, and group size and we’ll help you shape the itinerary.</p>
        <form className="enquiry-form" onSubmit={handleSubmit}>
          <label htmlFor="fullName">Full Name *</label>
          <input id="fullName" name="fullName" value={formData.fullName} onChange={handleInputChange} placeholder="Full Name" required />

          <label htmlFor="phoneNumber">Phone Number *</label>
          <input id="phoneNumber" name="phoneNumber" value={formData.phoneNumber} onChange={handleInputChange} placeholder="Phone Number" required />

          <label htmlFor="email">Email</label>
          <input id="email" type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" />

          <label htmlFor="preferredDestination">Preferred Destination</label>
          <input id="preferredDestination" name="preferredDestination" value={formData.preferredDestination} onChange={handleInputChange} placeholder="Preferred Destination" />

          <div className="form-grid-2">
            <div>
              <label htmlFor="fromDate">From Date</label>
              <input id="fromDate" type="date" name="fromDate" value={formData.fromDate} onChange={handleInputChange} />
            </div>
            <div>
              <label htmlFor="toDate">To Date</label>
              <input id="toDate" type="date" name="toDate" value={formData.toDate} onChange={handleInputChange} />
            </div>
          </div>

          <label htmlFor="numberOfDays">Number of Days</label>
          <input id="numberOfDays" name="numberOfDays" value={formData.numberOfDays} onChange={handleInputChange} placeholder="Number of Days" />

          <div className="form-grid-2">
            <div>
              <label htmlFor="adults">Adults</label>
              <input id="adults" name="adults" value={formData.adults} onChange={handleInputChange} placeholder="Adults" />
            </div>
            <div>
              <label htmlFor="children">Children</label>
              <input id="children" name="children" value={formData.children} onChange={handleInputChange} placeholder="Children" />
            </div>
          </div>

          <label htmlFor="tripType">Type of Trip</label>
          <select id="tripType" name="tripType" value={formData.tripType} onChange={handleInputChange}>
            <option>College IV</option>
            <option>Family Trip</option>
            <option>Honeymoon</option>
            <option>Friends Trip</option>
            <option>Corporate Tour</option>
            <option>Pilgrimage</option>
            <option>Adventure Trip</option>
            <option>Solo Trip</option>
            <option>Custom Tour</option>
          </select>

          <label htmlFor="accommodation">Accommodation</label>
          <select id="accommodation" name="accommodation" value={formData.accommodation} onChange={handleInputChange}>
            <option>Budget Hotel</option>
            <option>3 Star Hotel</option>
            <option>4 Star Hotel</option>
            <option>5 Star Hotel</option>
            <option>Resort</option>
            <option>Villa</option>
            <option>No Accommodation</option>
          </select>

          <label htmlFor="hotelResort">Specific Hotel / Resort</label>
          <input id="hotelResort" name="hotelResort" value={formData.hotelResort} onChange={handleInputChange} placeholder="Specific Hotel or Resort" />

          <label htmlFor="transportation">Transportation Preferences</label>
          <select id="transportation" name="transportation" value={formData.transportation} onChange={handleInputChange}>
            <option>Bus</option>
            <option>Tempo Traveller</option>
            <option>Car</option>
            <option>Cab</option>
            <option>Train</option>
            <option>Flight</option>
            <option>Self Drive</option>
          </select>

          <label htmlFor="transportationSeater">Transportation Seater</label>
          <select id="transportationSeater" name="transportationSeater" value={formData.transportationSeater} onChange={handleInputChange}>
            <option>4 Seater</option>
            <option>7 Seater</option>
            <option>12 Seater</option>
            <option>17 Seater</option>
            <option>26 Seater</option>
            <option>35 Seater</option>
            <option>49 Seater</option>
          </select>

          <label htmlFor="budgetRange">Budget Range</label>
          <input id="budgetRange" name="budgetRange" value={formData.budgetRange} onChange={handleInputChange} placeholder="Budget Range" />

          <label htmlFor="specificRequests">Specific Requests / Requirements</label>
          <textarea id="specificRequests" name="specificRequests" rows="4" value={formData.specificRequests} onChange={handleInputChange} placeholder="Specific Requests or Requirements" />

          <label htmlFor="remarks">Remarks</label>
          <textarea id="remarks" name="remarks" rows="3" value={formData.remarks} onChange={handleInputChange} placeholder="Remarks" />

          {statusMessage && (
            <p className={`enquiry-message enquiry-message--${statusType}`}>{statusMessage}</p>
          )}

          <button type="submit" disabled={isSending}>{isSending ? 'Sending...' : 'Submit'}</button>
        </form>
      </div>
    </div>
  )
}

function App() {
  return (
    <HashRouter>
      <AppShell />
    </HashRouter>
  )
}

export default App
