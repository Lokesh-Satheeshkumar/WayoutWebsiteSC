import { useEffect, useMemo, useState } from 'react'
import {
    HashRouter,
    Link,
    Navigate,
    Route,
    Routes,
    useParams,
    useLocation
} from 'react-router-dom'
import { motion } from 'framer-motion'
import './App.css'
import crop1 from './assets/crop1.jpeg'; import crop2 from './assets/crop2.jpeg'; import crop3 from './assets/corp3.jpeg'; import crop4 from './assets/crop4.jpeg'; import crop5 from './assets/crop5.jpeg'
import clg1 from './assets/clg (1).jpeg'; import clg2 from './assets/clg (2).jpeg'; import clg3 from './assets/clg (3).jpeg'; import clg4 from './assets/clg (4).jpeg'; import clg5 from './assets/clg (5).jpeg'; import clg6 from './assets/clg (6).jpeg'
import heroImage from './assets/hero.jpg'



const WHATSAPP_API_URL = 'http://localhost:3000/api/enquiry';
const API_URL = 'https://6a4791b7abfcbaade118ac80.mockapi.io/TripData/app_data';
  const fallbackImage = 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80'
const corporatePhotos = [crop1, crop2, crop3, crop4, crop5]; const collegePhotos = [clg1, clg2, clg3, clg4, clg5, clg6]
const fadeUp = { hidden: { opacity: 0, y: 28 }, visible: (delay = 0) => ({ opacity: 1, y: 0, transition: { duration: .7, delay } }) }
const scrollToSection = (id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })

function normalise(payload) { const source = Array.isArray(payload) ? payload[0] : payload || {}; return { banners: (source?.ui_data?.home?.banners || []).filter((item) => item?.is_visible !== false).map((item) => ({ title: item.title || 'Discover India', subtitle: item.subtitle || 'Travel your way', image: item.image || fallbackImage })), states: (source?.states || []).filter((item) => item?.is_visible !== false).map((item) => ({ id: String(item.state_id), name: item.name || 'Destination', image: item.image || fallbackImage, description: item.description || '', cities: (item.cities || []).filter((city) => city?.is_visible !== false).map((city) => ({ id: String(city.city_id), name: city.name || 'City', description: city.description || '', image: city.image || item.image || fallbackImage, places: (city.places || []).filter((place) => place?.is_visible !== false).map((place) => ({ id: String(place.place_id), name: place.name || 'Place', day: place.day || '1', time: place.time || 'Flexible', image: place.place_img || city.image || item.image || fallbackImage })) })) })) } }
function ScrollButton({ target, children, className = '' }) { return <button className={`scroll-button ${className}`} onClick={() => scrollToSection(target)}>{children}</button> }
function Navigation() { return <header className="nav-wrap"><Link className="wordmark" to="/">Wayout Tourz</Link><nav className="nav-links"><Link to="/">Home</Link><ScrollButton target="destinations">Destinations</ScrollButton><ScrollButton target="trip-photos">Trip photos</ScrollButton><ScrollButton target="about">About</ScrollButton><Link className="nav-cta" to="/enquiry">Plan your trip <b>→</b></Link></nav></header> }
function ImageLightbox({ image, alt, onClose }) { if (!image) return null; return <button className="lightbox" onClick={onClose} aria-label="Close image preview"><img src={image} alt={alt} /></button> }

function HomePage({ travel, loading, error }) {
    const [preview, setPreview] = useState(null); const hero = { title: 'Wayout Tourz', subtitle: 'Curated travel experiences, made for your journey.', image: heroImage }; return <><section className="hero" id="top">
        <img className="hero-video" src={hero.image} alt="Wayout Tourz destination" /><div className="hero-wash" /><div className="hero-content"><motion.p className="eyebrow" custom={0} initial="hidden" animate="visible" variants={fadeUp}>We have a world to see.</motion.p><motion.h1 custom={.12} initial="hidden" animate="visible" variants={fadeUp}>Wayout<br /><em>Tourz.</em></motion.h1><motion.p className="hero-copy" custom={.26} initial="hidden" animate="visible" variants={fadeUp}>{hero.subtitle}</motion.p><motion.div className="hero-actions" custom={.4} initial="hidden" animate="visible" variants={fadeUp}><Link className="button primary" to="/enquiry">Plan a journey <span>→</span></Link><ScrollButton className="text-link" target="destinations">Explore destinations <span>↓</span></ScrollButton></motion.div>{travel.states.length > 0 && <motion.div className="chips" custom={.6} initial="hidden" animate="visible" variants={fadeUp}>{travel.states.slice(0, 5).map((state, index) => <span key={state.id}>{index > 0 && <i />}{state.name}</span>)}</motion.div>}</div></section><section className="section destinations" id="destinations"><div className="section-lead"><p className="eyebrow">Your destinations</p><h2>Where we'll<br />take you</h2><p>Explore the destinations from your live Wayout Tourz collection.</p></div><div className="destination-grid">{loading && <p className="loading-copy">Loading your destinations…</p>}{error && <p className="loading-copy">{error}. Please try again shortly.</p>}{travel.states.map((state, index) => <motion.article className="destination-card" key={state.id} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={index * .09} variants={fadeUp} role="link" tabIndex={0} onClick={() => { window.location.hash = `#/state/${state.id}` }} onKeyDown={(event) => { if (event.key === 'Enter' || event.key === ' ') window.location.hash = `#/state/${state.id}` }}> <img src={state.image} alt={state.name} /><div className="card-overlay" /><div className="destination-detail"><p>{state.cities.length} cities to explore</p><h3>{state.name}</h3><Link to={`/state/${state.id}`}>Explore cities <span>→</span></Link></div></motion.article>)}</div></section><section className="section offer-section" id="about"><div className="section-kicker"><p className="eyebrow">The Wayout difference</p><h2>Made for the<br /><em>journey.</em></h2></div><div className="offer-list">{[['Personalised Itineraries', 'Every trip is shaped around the places and moments that matter to you.'], ['Group Travel', 'Thoughtfully organised college, corporate, and group journeys.'], ['Local Experiences', 'Discover the authentic side of every destination with a trip that feels personal.']].map(([title, description], index) => <motion.article className="offer-row" key={title} initial="hidden" whileInView="visible" viewport={{ once: true }} custom={index * .12} variants={fadeUp}><h3>{title}</h3><p>{description}</p><span>→</span></motion.article>)}</div></section><section className="section trips" id="trip-photos"><p className="eyebrow">Your memories</p><h2>Trips we've<br /><em>loved.</em></h2><div className="trip-galleries">{[['Corporate journeys', corporatePhotos], ['College journeys', collegePhotos]].map(([title, photos]) => <div key={title}><h3>{title}</h3><div className="photo-grid">{photos.map((photo, index) => <img key={photo} src={photo} alt={`${title} ${index + 1}`} />)}</div></div>)}</div></section><section className="plan-section"><div><p className="eyebrow">Your next chapter</p><h2>Where do you<br />want to go?</h2></div><div className="plan-copy"><p>Tell Wayout Tourz about your dream trip and let us help turn it into your next unforgettable journey.</p><Link className="button dark" to="/enquiry">Start planning <span>→</span></Link><small>Personal service · Group trips · Available 7 days</small></div></section></>
}

function StatePage({ travel }) {
    const { stateId } = useParams();

    const state = travel.states.find(
        (item) => item.id === stateId
    );

    if (!state) {
        return <Navigate to="/" replace />;
    }

    return (
        <section className="detail-page state-page">

            <Link
                className="text-link"
                to="/"
            >
                ← Back to destinations
            </Link>

            <p className="eyebrow">
                Destination
            </p>

            <h1>{state.name}</h1>

            <p className="detail-copy">
                {state.description}
            </p>

            <div className="city-list">

                {state.cities.map((city) => (

                    <Link
                        key={city.id}
                        to={`/city/${state.id}/${city.id}`}
                        className="city-destination-card"
                    >

                        {/* Fixed-size image */}
                        <div className="city-card-image">
                            <img
                                src={city.image}
                                alt={city.name}
                            />
                        </div>

                        {/* Content */}
                        <div className="city-card-content">

                            <div className="city-card-top">
                                <p>
                                    {city.places.length} itinerary stops
                                </p>

                                <span className="city-card-arrow">
                                    →
                                </span>
                            </div>

                            <h2>
                                {city.name}
                            </h2>

                            <span className="city-description">
                                {city.description}
                            </span>

                            <span className="city-view">
                                View itinerary
                            </span>

                        </div>

                    </Link>

                ))}

            </div>

        </section>
    );
}function CityPage({ travel }) {
    const { stateId, cityId } = useParams();

    const state = travel.states.find((item) => item.id === stateId);
    const city = state?.cities.find((item) => item.id === cityId);

    const [selectedDay, setSelectedDay] = useState('1');

    if (!city || !state) {
        return <Navigate to="/" replace />;
    }

    // Get all available days from the itinerary
    const days = [...new Set(
        city.places.map((place) => String(place.day || '1'))
    )].sort((a, b) => Number(a) - Number(b));

    // Places belonging only to selected day
    const selectedPlaces = city.places
        .filter((place) => String(place.day || '1') === selectedDay)
        .sort((a, b) => {
            const timeA = a.time || '';
            const timeB = b.time || '';
            return timeA.localeCompare(timeB);
        });

    return (
        <section className="detail-page itinerary-page">

            <Link
                className="text-link"
                to={`/state/${state.id}`}
            >
                ← Back to {state.name}
            </Link>

            <p className="eyebrow">
                {state.name} · itinerary
            </p>

            <h1>{city.name}</h1>

            <p className="detail-copy">
                {city.description}
            </p>

            {/* DAY TABS */}
            <div className="day-tabs">
                {days.map((day) => (
                    <button
                        key={day}
                        className={`day-tab ${selectedDay === day ? 'active' : ''
                            }`}
                        onClick={() => setSelectedDay(day)}
                    >
                        Day {day}
                    </button>
                ))}
            </div>

            {/* SELECTED DAY */}
            <div className="selected-day-heading">
                <p>DAY {selectedDay}</p>
                <h2>
                    Day {selectedDay} Itinerary
                </h2>
                <span>
                    {selectedPlaces.length} places to explore
                </span>
            </div>

            {/* PLACES FOR SELECTED DAY */}
            <div className="day-itinerary">

                {selectedPlaces.map((place, index) => (

                    <article
                        className="day-place-card"
                        key={place.id}
                    >

                        <div className="day-place-content">

    <div className="day-place-number">
        {String(index + 1).padStart(2, '0')}
    </div>

    <div className="day-place-info">
        {place.time && place.time !== 'Flexible' && (
            <span className="day-place-time">
                {place.time}
            </span>
        )}

        <h3>{place.name}</h3>
    </div>

</div>
                    </article>

                ))}

                {selectedPlaces.length === 0 && (
                    <div className="empty-day">
                        No places planned for Day {selectedDay}.
                    </div>
                )}

            </div>)

            <Link
                className="button primary"
                to="/enquiry"
            >
                Plan this journey →
            </Link>

        </section>
    );
} 
function EnquiryPage() {
    const [form, setForm] = useState({
        fullName: '',
        phoneNumber: '',
        email: '',
        pickupLocation: '',
        preferredDestination: '',
        fromDate: '',
        toDate: '',
        numberOfDays: '',
        adults: '',
        children: '',
        tripType: 'College IV',
        accommodation: 'Hotel',
        transportation: '54 Seater',
        budgetRange: '',
        specificRequests: '',
        remarks: ''
    });

    const [message, setMessage] = useState('');
    const [sending, setSending] = useState(false);

    const change = (event) => {
        setForm({
            ...form,
            [event.target.name]: event.target.value
        });
    };

    const submit = async (event) => {
        event.preventDefault();

        if (
            !form.fullName.trim() ||
            !/^\d+$/.test(form.phoneNumber.trim())
        ) {
            setMessage(
                'Please add your name and a valid phone number.'
            );
            return;
        }

        setSending(true);
        setMessage('');

        try {
            const response = await fetch(
                WHATSAPP_API_URL,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                       fullName: `${form.fullName} (${form.pickupLocation})`,
                        phone: form.phoneNumber,
                        email: form.email,
                        preferredDestinations:`${form.preferredDestination} (${form.numberOfDays} days)`,
                        fromDate: form.fromDate,
                        toDate: form.toDate,
                        numberOfDays: form.numberOfDays,
                        adults: form.adults,
                        children: form.children,
                        tripType: form.tripType,
                        accommodation: form.accommodation,
                        specificHotel: '',
                        transportation: form.transportation,
                        budget: form.budgetRange,
                        remarks: form.specificRequests
                    })
                }
            );

            const result = await response.json();

            if (!response.ok || !result.success) {
                throw new Error(
                    result.message || 'Failed to send enquiry'
                );
            }

            setMessage(
                'Thank you! Your enquiry has been sent successfully.'
            );

            setForm({
                fullName: '',
                phoneNumber: '',
                email: '',
                pickupLocation: '',
                preferredDestination: '',
                fromDate: '',
                toDate: '',
                numberOfDays: '',
                adults: '',
                children: '',
                tripType: 'College IV',
                accommodation: 'Hotel',
                transportation: '54 Seater',
                budgetRange: '',
                specificRequests: '',
            });

        } catch (error) {
            console.error('Enquiry error:', error);

            setMessage(
                'Failed to send enquiry. Please try again.'
            );
        } finally {
            setSending(false);
        }
    };

    return (
        <section className="enquiry-page">

            <div className="enquiry-intro">
                <p className="eyebrow">Wayout Tourz</p>

                <h1>
                    Plan your next
                    <br />
                    <em>escape.</em>
                </h1>

                <p>
                    Share a few details and our team will help you
                    build a trip you will remember.
                </p>

                <Link to="/" className="text-link">
                    ← Back to home
                </Link>
            </div>

            <form
                className="enquiry-form"
                onSubmit={submit}
            >
                <label>
                    Full name *
                    <input
                        name="fullName"
                        value={form.fullName}
                        placeholder="Enter Your Full Name"
                        onChange={change}
                        required
                    />
                </label>

                <label>
                    Phone number *
                    <input
                        name="phoneNumber"
                        value={form.phoneNumber}
                        onChange={change}
                        placeholder="Enter Your Whatsapp Number"
                        inputMode="numeric"
                        required
                    />
                </label>

                <label>
                    Email
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        placeholder="Your Email"
                        onChange={change}
                    />
                </label>

                <label>
    Pickup location *
                <input
                    name="pickupLocation"
                    value={form.pickupLocation}
                    onChange={change}
                    placeholder="e.g. Salem , ABC College ..."
                    required
                />
            </label>

                <label>
                    Preferred destination*
                    <input
                        name="preferredDestination"
                        value={form.preferredDestination}
                        placeholder="e.g. kerala,kochi,Ooty...."
                        onChange={change}
                    />
                </label>

                <div className="form-grid">
                    <label>
                        From date
                        <input
                            name="fromDate"
                            type="date"
                            value={form.fromDate}
                            onChange={change}
                        />
                    </label>

                    <label>
                        To date
                        <input
                            name="toDate"
                            type="date"
                            value={form.toDate}
                            onChange={change}
                        />
                    </label>
                </div>

                <label>
                    Number of days
                    <input
                        name="numberOfDays"
                        type="number"
                        min="1"
                        placeholder="Type just 1,2,3..."
                        value={form.numberOfDays}
                        onChange={change}
                    />
                </label>

                <div className="form-grid">
                    <label>
                        Adults
                        <input
                            name="adults"
                            type="number"
                            min="1"
                             placeholder="Type just 1,2,3..."
                            value={form.adults}
                            onChange={change}
                        />
                    </label>

                    <label>
                        Children
                        <input
                            name="children"
                            type="number"
                            min="0"
                             placeholder="Type just 1,2,3..."
                            value={form.children}
                            onChange={change}
                        />
                    </label>
                </div>

                <label>
                    Type of trip
                    <select
                        name="tripType"
                        value={form.tripType}
                        onChange={change}
                    >
                        <option>College IV</option>
                        <option>Family Trip</option>
                        <option>Honeymoon</option>
                        <option>Friends Trip</option>
                        <option>Corporate Tour</option>
                        <option>Adventure Trip</option>
                        <option>Custom Tour</option>
                    </select>
                </label>

                <label>
                    Accommodation
                    <select
                        name="accommodation"
                        value={form.accommodation}
                        onChange={change}
                    >
                        <option>Hotel</option>
                        <option>Resort</option>
                        <option>Villa</option>
                        <option>Other</option>
                    </select>
                </label>

                <label>
                    Transportation
                    <select
                        name="transportation"
                        value={form.transportation}
                        onChange={change}
                    >
                        <option>54 Seater</option>
                        <option>30 Seater</option>
                        <option>21 Seater</option>
                        <option>12 Seater</option>
                        <option>Cab</option>
                        <option>Own Vehicle</option>
                        <option>Other</option>
                    </select>
                </label>

                <label>
                    Budget range
                    <input
                        name="budgetRange"
                        value={form.budgetRange}
                        onChange={change}
                        placeholder="Your planned budget"
                    />
                </label>

                <label>
                    Specific requests
                    <textarea
                        name="specificRequests"
                        value={form.specificRequests}
                        onChange={change}
                        rows="3"
                    />
                </label>

                {message && (
                    <p className="form-message">
                        {message}
                    </p>
                )}

                <button
                    className="button primary"
                    type="submit"
                    disabled={sending}
                >
                    {sending
                        ? 'Sending…'
                        : 'Send enquiry →'}
                </button>
            </form>

        </section>
    );
}
function BackToTop() { const [visible, setVisible] = useState(false); useEffect(() => { const update = () => setVisible(window.scrollY > 360); update(); window.addEventListener('scroll', update, { passive: true }); return () => window.removeEventListener('scroll', update) }, []); return <button className={visible ? 'back-to-top is-visible' : 'back-to-top'} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label="Back to top">↑</button> }
function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        window.scrollTo({
            top: 0,
            left: 0,
            behavior: 'instant'
        });
    }, [pathname]);

    return null;
}

function App() { const [payload, setPayload] = useState(null); const [loading, setLoading] = useState(true); const [error, setError] = useState(''); const travel = useMemo(() => normalise(payload), [payload]); useEffect(() => { fetch(API_URL).then((response) => { if (!response.ok) throw new Error('Unable to load destinations'); return response.json() }).then(setPayload).catch((reason) => setError(reason.message)).finally(() => setLoading(false)) }, []); return (
    <HashRouter>

        <ScrollToTop />

        <div className="meridian-site">

            <Navigation />

            <Routes>
                <Route
                    path="/"
                    element={
                        <HomePage
                            travel={travel}
                            loading={loading}
                            error={error}
                        />
                    }
                />

                <Route
                    path="/state/:stateId"
                    element={<StatePage travel={travel} />}
                />

                <Route
                    path="/city/:stateId/:cityId"
                    element={<CityPage travel={travel} />}
                />

                <Route
                    path="/enquiry"
                    element={<EnquiryPage />}
                />

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />
            </Routes>

            <BackToTop />

            <footer className="footer">
                <Link className="wordmark" to="/">
                    Wayout Tourz
                </Link>

                <p>
                    © 2026 Wayout Tourz · Curated Travel Experiences
                </p>
            </footer>

        </div>

    </HashRouter>
)
}
export default App
