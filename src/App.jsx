import { useEffect, useRef,useMemo, useState } from 'react';

import {
    HashRouter,
    Link,
    Navigate,
    Route,
    Routes,
    useParams,
    useLocation
} from 'react-router-dom';

import nameLogo from './assets/namelogo.png';

import { motion, AnimatePresence } from 'framer-motion';

import './App.css';

import crop1 from './assets/crop1.jpeg';
import crop2 from './assets/crop2.jpeg';
import crop3 from './assets/corp3.jpeg';
import crop4 from './assets/crop4.jpeg';
import crop5 from './assets/crop5.jpeg';
import crop6 from './assets/crop6.jpg';

import clg1 from './assets/clg (1).jpeg';
import clg2 from './assets/clg (2).jpeg';
import clg3 from './assets/clg (3).jpeg';
import clg4 from './assets/clg (4).jpeg';
import clg5 from './assets/clg (5).jpeg';
import clg6 from './assets/clg (6).jpeg';

import heroImage from './assets/hero2.jpg';

const reviewVideos = [
    {
        title: "Our corporate buddies loved the journey",
        video: "/reviews/review1.mp4",
         thumbnail: "/reviews/thumbnail1.png"
     },
    {
        title: "An unforgettable college trip",
        video: "/reviews/review2.mp4",
         thumbnail: "/reviews/thumbnail2.png"
    }
    //,
    // {
    //     title: "Another unforgettable trip",
    //     video: "/reviews/review3.mp4"
    // }
];

const WHATSAPP_API_URL =
    'https://wayoutwebsitebackend.onrender.com/api/enquiry';

const API_URL =
    'https://6a4791b7abfcbaade118ac80.mockapi.io/TripData/app_data';

const fallbackImage =
    'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80';


const corporatePhotos = [
    crop1,
    crop2,
    crop3,
    crop4,
    crop5,
    crop6
];

const collegePhotos = [
    clg1,
    clg2,
    clg3,
    clg4,
    clg5,
    clg6
];


const fadeUp = {
    hidden: {
        opacity: 0,
        y: 28
    },

    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,

        transition: {
            duration: 0.7,
            delay
        }
    })
};


const scrollToSection = (id) => {
    document
        .getElementById(id)
        ?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
};

function normalise(payload) {

    const source = Array.isArray(payload)
        ? payload[0]
        : payload || {};

    return {

        banners: (source?.ui_data?.home?.banners || [])
            .filter(
                (item) =>
                    item?.is_visible !== false
            )
            .map((item) => ({
                title:
                    item.title ||
                    'Discover India',

                subtitle:
                    item.subtitle ||
                    'Travel your way',

                image:
                    item.image ||
                    fallbackImage
            })),


        states: (source?.states || [])
            .filter(
                (item) =>
                    item?.is_visible !== false
            )
            .map((item) => ({

                id: String(item.state_id),

                name:
                    item.name ||
                    'Destination',

                image:
                    item.image ||
                    fallbackImage,

                description:
                    item.description ||
                    '',


                cities: (item.cities || [])
                    .filter(
                        (city) =>
                            city?.is_visible !== false
                    )
                    .map((city) => ({

                        id: String(city.city_id),

                        name:
                            city.name ||
                            'City',

                        description:
                            city.description ||
                            '',

                        image:
                            city.image ||
                            item.image ||
                            fallbackImage,


                        places: (city.places || [])
                            .filter(
                                (place) =>
                                    place?.is_visible !== false
                            )
                            .map((place) => ({

                                id: String(
                                    place.place_id
                                ),

                                name:
                                    place.name ||
                                    'Place',

                                day:
                                    place.day ||
                                    '1',

                                time:
                                    place.time ||
                                    'Flexible',

                                image:
                                    place.place_img ||
                                    ''

                            }))

                    }))

            }))

    };
}

function ScrollButton({ target, children, className = '' }) {
    return (
        <button
            className={`scroll-button ${className}`}
            onClick={() => scrollToSection(target)}
        >
            {children}
        </button>
    );
}

function Navigation() {

    return (

        <header className="nav-wrap">



            {/* Top-right logo */}

            <Link to="/" className="nav-logo">

                <img

                    src={nameLogo}

                    alt="Wayout Tourz"

                />

            </Link>



            <nav className="nav-links">

                <Link to="/">Home</Link>



                <ScrollButton target="destinations">

                    Destinations

                </ScrollButton>



                <ScrollButton target="trip-photos">

                    Trip photos

                </ScrollButton>

                <ScrollButton target="reviews">

                     Reviews

                </ScrollButton>



                <ScrollButton target="about">

                    About

                </ScrollButton>



                <Link className="nav-cta" to="/enquiry">

                    Plan your trip <b>→</b>

                </Link>

            </nav>



        </header>

    );

}

function ImageLightbox({ images, currentIndex, onClose, onNext,
onPrevious }) {

    if (!images || images.length === 0) return null;



    const currentImage = images[currentIndex];



    return (

        <div

            className="lightbox"

            onClick={onClose}

        >

            <button

                className="lightbox-close"

                onClick={onClose}

                aria-label="Close gallery"

            >

                ×

            </button>



            {images.length > 1 && (

                <button

                    className="lightbox-arrow lightbox-arrow-left"

                    onClick={(event) => {

                        event.stopPropagation();

                        onPrevious();

                    }}

                    aria-label="Previous image"

                >

                    ←

                </button>

            )}



            <div

                className="lightbox-content"

                onClick={(event) => event.stopPropagation()}

            >

                <AnimatePresence mode="wait">

                    <motion.img

                        key={currentImage}

                        src={currentImage}

                        alt={`Trip photo ${currentIndex + 1}`}

                        className="lightbox-image"

                        initial={{ opacity: 0, x: 60 }}

                        animate={{ opacity: 1, x: 0 }}

                        exit={{ opacity: 0, x: -60 }}

                        transition={{ duration: 0.3 }}

                    />

                </AnimatePresence>



                <div className="lightbox-counter">

                    {currentIndex + 1} / {images.length}

                </div>

            </div>



            {images.length > 1 && (

                <button

                    className="lightbox-arrow lightbox-arrow-right"

                    onClick={(event) => {

                        event.stopPropagation();

                        onNext();

                    }}

                    aria-label="Next image"

                >

                    →

                </button>

            )}

        </div>

    );

}

function HomePage({ travel, loading, error }) {

    const [preview, setPreview] = useState(null);

    const [previewIndex, setPreviewIndex] = useState(0);

    const [showScrollIndicator, setShowScrollIndicator] = useState(false);

    const isAutoScroll = useRef(false);

       useEffect(() => {
    if (window.innerWidth > 800) return;

    let cancelled = false;
    let autoScrollTimer;

    const handleUserScroll = () => {

        // Ignore the automatic 40px page movement
        if (isAutoScroll.current) {
            return;
        }

        // Real user scroll
        if (window.scrollY > 10) {
            setShowScrollIndicator(false);
        }
    };

    window.addEventListener("scroll", handleUserScroll, {
        passive: true
    });

    autoScrollTimer = setTimeout(() => {

        if (cancelled) return;

        // User already scrolled
        if (window.scrollY > 10) return;

        // Tell scroll listener this is OUR automatic movement
        isAutoScroll.current = true;

        // Show indicator FIRST
        setShowScrollIndicator(true);

        // Small page lift
        window.scrollTo({
            top: 40,
            behavior: "smooth"
        });

        // Allow real user scrolling after the animation finishes
        setTimeout(() => {
            isAutoScroll.current = false;
        }, 1000);

    }, 3500);

    return () => {
        cancelled = true;

        clearTimeout(autoScrollTimer);

        window.removeEventListener(
            "scroll",
            handleUserScroll
        );
    };

}, []);



    /* =========================================================
       OPEN GALLERY
    ========================================================= */

    const openGallery = (photos, index) => {

        setPreview({
            images: photos
        });

        setPreviewIndex(index);
    };


    /* =========================================================
       CLOSE GALLERY
    ========================================================= */

    const closeGallery = () => {

        setPreview(null);

        setPreviewIndex(0);
    };


    /* =========================================================
       NEXT GALLERY IMAGE
    ========================================================= */

    const nextGalleryImage = () => {

        if (!preview) {
            return;
        }

        setPreviewIndex((previousIndex) =>
            (previousIndex + 1) % preview.images.length
        );
    };


    /* =========================================================
       PREVIOUS GALLERY IMAGE
    ========================================================= */

    const previousGalleryImage = () => {

        if (!preview) {
            return;
        }

        setPreviewIndex((previousIndex) =>
            (previousIndex - 1 + preview.images.length) %
            preview.images.length
        );
    };


    /* =========================================================
       HERO DATA
    ========================================================= */

    const hero = {
        title: "Wayout Tourz",

        subtitle:
            "Tour packages across India, customised group trips, college tours, corporate journeys and unforgettable travel experiences",

        image: heroImage
    };


    return (

        <>

            {/* =================================================
                HERO
            ================================================= */}

            <section
                className="hero"
                id="top"
            >

                <img
                    className="hero-video"
                    src={hero.image}
                    alt="Wayout Tourz destination"
                />

                <div className="hero-wash" />

                <div className="hero-content">

                    <motion.p
                        className="eyebrow"
                        custom={0}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                    >
                        We have a world to see.
                    </motion.p>


                    <motion.h1
                        custom={0.12}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                    >
                        Wayout
                        <br />
                        <em>Tourz.</em>
                    </motion.h1>


                    <motion.p
                        className="hero-copy"
                        custom={0.26}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                    >
                        {hero.subtitle}
                    </motion.p>


                    {travel.states.length > 0 && (

                        <motion.div
                            className="chips"
                            custom={0.6}
                            initial="hidden"
                            animate="visible"
                            variants={fadeUp}
                        >

                            {travel.states
                                .slice(0, 5)
                                .map((state, index) => (

                                    <span key={state.id}>

                                        {index > 0 && <i />}

                                        {state.name}

                                    </span>

                                ))}

                        </motion.div>

                    )}



                    <motion.div
                        className="hero-actions"
                        custom={0.4}
                        initial="hidden"
                        animate="visible"
                        variants={fadeUp}
                    >

                        <Link
                            className="button primary"
                            to="/enquiry"
                        >
                            Plan a journey
                            <span>→</span>
                        </Link>


                        <ScrollButton
                            className="text-link"
                            target="destinations"
                        >
                            Explore destinations
                            <span>↓</span>
                        </ScrollButton>

                    </motion.div>

                </div>

          <button
    className={`scroll-indicator ${
        showScrollIndicator ? "is-visible" : ""
    }`}
    onClick={() => {
        setShowScrollIndicator(false);

        window.scrollTo({
            top: window.innerHeight,
            behavior: "smooth"
        });
    }}
    aria-label="Scroll down"
>
    <span className="scroll-indicator-text">
        SCROLL TO EXPLORE
    </span>

    <span className="scroll-indicator-mouse">
        <span></span>
    </span>

    <span className="scroll-indicator-arrow">
        ↓
    </span>
</button>
            

            </section>


            {/* =================================================
                DESTINATIONS
            ================================================= */}

            <section
                className="section destinations"
                id="destinations"
            >

                <div className="section-lead">

                    <p className="eyebrow">
                        Your destinations
                    </p>

                    <h2>
                        Where we'll
                        <br />
                        take you
                    </h2>

                    <p>
                        Explore the destinations from your live Wayout Tourz collection.
                    </p>

                </div>


                <div className="destination-grid">



                    {loading && (

                        <p className="loading-copy">
                            Loading your destinations…
                        </p>

                        

                    )}

                    {error && (

                        <p className="loading-copy">
                            {error}. Please try again shortly.
                        </p>

                    )}


                    {travel.states.map((state, index) => (

                        <motion.article
                            className="destination-card"
                            key={state.id}

                            initial="hidden"
                            whileInView="visible"

                            viewport={{
                                once: true
                            }}

                            custom={index * 0.09}

                            variants={fadeUp}

                            role="link"

                            tabIndex={0}

                            onClick={() => {

                                window.location.hash =
                                    `#/state/${state.id}`;

                            }}

                            onKeyDown={(event) => {

                                if (
                                    event.key === "Enter" ||
                                    event.key === " "
                                ) {

                                    window.location.hash =
                                        `#/state/${state.id}`;

                                }

                            }}
                        >

                            <img
                                src={state.image}
                                alt={state.name}
                            />


                            <div className="card-overlay" />


                            <div className="destination-detail">

                                <p>
                                    {state.cities.length} cities to explore
                                </p>


                                <h3>
                                    {state.name}
                                </h3>


                                <Link
                                    to={`/state/${state.id}`}
                                >
                                    Explore cities
                                    <span>→</span>
                                </Link>

                            </div>

                        </motion.article>

                    ))}

                </div>

            </section>


            {/* =================================================
                ABOUT / WAYOUT DIFFERENCE
            ================================================= */}

            {/* <section
                className="section offer-section"
                id="about"
            >

                <div className="section-kicker">

                    <p className="eyebrow">
                        The Wayout difference
                    </p>


                    <h2>
                        Made for the
                        <br />
                        <em>journey.</em>
                    </h2>

                </div>


                <div className="offer-list">

                    {[
                        [
                            "Personalised Itineraries",
                            "Every trip is shaped around the places and moments that matter to you."
                        ],

                        [
                            "Group Travel",
                            "Thoughtfully organised college, corporate, and group journeys."
                        ],

                        [
                            "Local Experiences",
                            "Discover the authentic side of every destination with a trip that feels personal."
                        ]

                    ].map(
                        ([title, description], index) => (

                            <motion.article
                                className="offer-row"
                                key={title}

                                initial="hidden"

                                whileInView="visible"

                                viewport={{
                                    once: true
                                }}

                                custom={index * 0.12}

                                variants={fadeUp}
                            >

                                <h3>
                                    {title}
                                </h3>


                                <p>
                                    {description}
                                </p>


                                <span />

                            </motion.article>

                        )
                    )}

                </div>

            </section> */}


            {/* =================================================
                RECENT TRIPS
            ================================================= */}

            <section
                className="section trips"
                id="trip-photos"
            >

                <p className="eyebrow">
                    Your memories
                </p>


                <h2>
                    Trips we've
                    <br />
                    <em>loved.</em>
                </h2>


                <div className="trip-galleries">

                    {[
                        [
                            "Corporate journeys",
                            corporatePhotos
                        ],

                        [
                            "College journeys",
                            collegePhotos
                        ]

                    ].map(
                        ([title, photos]) => (

                            <div key={title}>

                                <h3>
                                    {title}
                                </h3>


                                <div className="photo-grid">

                                    {photos.map(
                                        (photo, index) => (

                                            <button
                                                key={photo}

                                                type="button"

                                                className="trip-photo-button"

                                                onClick={() =>
                                                    openGallery(
                                                        photos,
                                                        index
                                                    )
                                                }

                                                aria-label={
                                                    `Open ${title} photo ${index + 1}`
                                                }
                                            >

                                                <img
                                                    src={photo}
                                                    alt={
                                                        `${title} ${index + 1}`
                                                    }
                                                />

                                            </button>

                                        )
                                    )}

                                </div>

                            </div>

                        )
                    )}

                </div>

            </section>


            {/* =================================================
    TRAVELLER REVIEWS
================================================= */}

<section className="section reviews-section" id="reviews">

    <div className="reviews-heading">

        <div>
            <p className="eyebrow">
                Real journeys · Real memories
            </p>

            <h2>
                Hear it from
                <br />
                <em>our travellers.</em>
            </h2>
        </div>

        {/* <p className="reviews-intro">
            The best part of every journey is the memory people
            take home. Watch what our travellers have to say.
        </p> */}

    </div>


    <div className="review-video-grid">

        {reviewVideos.map((review, index) => (

            <motion.article
                className="review-video-card"
                key={review.video}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                custom={index * 0.12}
                variants={fadeUp}
            >

                <div className="review-video-wrapper">

                    <video
                        src={review.video}
                        poster={review.thumbnail}
                        controls
                        playsInline
                        preload="metadata"
                    />

                </div>

                <div className="review-video-content">

                    <span>
                        REVIEW {String(index + 1).padStart(2, '0')}
                    </span>

                    <h3>
                        {review.title}
                    </h3>

                </div>

            </motion.article>

        ))}

    </div>

</section>


            {/* =================================================
                PLAN JOURNEY
            ================================================= */}

            <section className="plan-section">

                <div>

                    <p className="eyebrow">
                        Your next chapter
                    </p>


                    <h2>
                        Where do you
                        <br />
                        want to go?
                    </h2>

                </div>


                <div className="plan-copy">

                    <p>
                        Tell Wayout Tourz about your dream trip and let us help turn it into your next unforgettable journey.
                    </p>


                    <Link
                        className="button dark"
                        to="/enquiry"
                    >
                        Start planning
                        <span>→</span>
                    </Link>


                    <small>
                        Personal service · Group trips · Available 7 days
                    </small>

                </div>

            </section>


            {/* =================================================
                IMAGE LIGHTBOX / SLIDER
            ================================================= */}

            {preview && (

                <ImageLightbox
                    images={preview.images}

                    currentIndex={previewIndex}

                    onClose={closeGallery}

                    onNext={nextGalleryImage}

                    onPrevious={previousGalleryImage}
                />

            )}

        </>

    );
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

}

function CityPage({ travel }) {

    const { stateId, cityId } = useParams();





    /* =========================================================

       FIND STATE

    ========================================================= */



    const state = travel.states.find(

        (item) => item.id === stateId

    );





    /* =========================================================

       FIND CITY

    ========================================================= */



    const city = state?.cities.find(

        (item) => item.id === cityId

    );





    /* =========================================================

       STATE

    ========================================================= */

const [selectedDay, setSelectedDay] =

    useState('1');

const [currentImageIndex, setCurrentImageIndex] =

    useState(0);

const [isPhotoHovered, setIsPhotoHovered] =

    useState(false);



    /* =========================================================

       GET DAYS

    ========================================================= */



    const days = city

        ? [

            ...new Set(

                city.places.map(

                    (place) =>

                        String(

                            place.day || '1'

                        )

                )

            )

        ].sort(

            (a, b) =>

                Number(a) - Number(b)

        )

        : [];





    /* =========================================================

       SELECTED DAY PLACES

    ========================================================= */



    const selectedPlaces = city

        ? city.places

            .filter(

                (place) =>

                    String(

                        place.day || '1'

                    ) === selectedDay

            )

            .sort((a, b) => {



                const timeA =

                    a.time || '';



                const timeB =

                    b.time || '';



                return timeA.localeCompare(

                    timeB

                );

            })

        : [];





    /* =========================================================

       ONLY PLACES HAVING IMAGES



       null

       undefined

       ""

       whitespace



       are skipped.

    ========================================================= */



    const imagePlaces =

        selectedPlaces.filter(

            (place) =>

                typeof place.image ===

                    'string' &&

                place.image.trim() !== ''

        );





    /* =========================================================

       RESET IMAGE WHEN DAY CHANGES

    ========================================================= */



    useEffect(() => {



        setCurrentImageIndex(0);



    }, [selectedDay]);





    /* =========================================================

       VALIDATE IMAGE INDEX

    ========================================================= */



    useEffect(() => {



        if (

            imagePlaces.length === 0

        ) {



            setCurrentImageIndex(0);



            return;

        }





        if (

            currentImageIndex >=

            imagePlaces.length

        ) {



            setCurrentImageIndex(0);



        }



    }, [

        imagePlaces.length,

        currentImageIndex

    ]);

/* =========================================================

AUTO PHOTO SLIDER

PAUSE ON HOVER

========================================================= */

useEffect(() => {

    if (

        imagePlaces.length <= 1 ||

        isPhotoHovered

    ) {

        return;

    }



    const interval = setInterval(() => {



        setCurrentImageIndex(

            (previousIndex) =>

                (

                    previousIndex + 1

                ) %

                imagePlaces.length

        );



    }, 4000);



    return () => {

        clearInterval(interval);

    };

}, [

    imagePlaces.length,

    isPhotoHovered

]);

    /* =========================================================

       INVALID CITY

    ========================================================= */



    if (!city || !state) {



        return (

            <Navigate

                to="/"

                replace

            />

        );



    }





    /* =========================================================

       CURRENT IMAGE PLACE

    ========================================================= */



    const currentPlace =

        imagePlaces.length > 0

            ? imagePlaces[

                currentImageIndex %

                imagePlaces.length

            ]

            : null;





    /* =========================================================

       NEXT PHOTO

    ========================================================= */



    const nextPhoto = () => {



        if (

            imagePlaces.length <= 1

        ) {

            return;

        }





        setCurrentImageIndex(

            (previousIndex) =>

                (

                    previousIndex + 1

                ) %

                imagePlaces.length

        );



    };





    /* =========================================================

       PREVIOUS PHOTO

    ========================================================= */



    const previousPhoto = () => {



        if (

            imagePlaces.length <= 1

        ) {

            return;

        }





        setCurrentImageIndex(

            (previousIndex) =>

                (

                    previousIndex -

                    1 +

                    imagePlaces.length

                ) %

                imagePlaces.length

        );



    };





    /* =========================================================

       SCROLL TO PHOTOS

    ========================================================= */



    const scrollToPhotos = () => {



        const section =

            document.getElementById(

                'itinerary-photos'

            );





        if (section) {



            section.scrollIntoView({

                behavior: 'smooth',

                block: 'start'

            });



        }



    };





    /* =========================================================

       CITY PHOTO DESCRIPTION



       Uses city description from API.

    ========================================================= */



    const cityPhotoDescription =

        city.description ||

        `Explore the beautiful places,

        experiences and memorable

        moments waiting for you in

        ${city.name}.`;





    return (



        <section

            className="detail-page itinerary-page"

        >





            {/* =================================================

                BACK

            ================================================= */}



            <Link

                className="text-link"

                to={`/state/${state.id}`}

            >

                ← Back to {state.name}

            </Link>





            {/* =================================================

                CITY INTRO

            ================================================= */}



            <div className="city-header">



                <div className="city-heading-content">





                    {/* STATE */}



                    <p className="eyebrow">

                        {state.name} · itinerary

                    </p>





                    {/* CITY */}



                    <h1>

                        {city.name}

                    </h1>









                    {/* =================================================

                        SEE ITINERARY PHOTOS

                    ================================================= */}



                    {imagePlaces.length > 0 && (



                        <button

                            type="button"

                            className="see-itinerary-photos"

                            onClick={scrollToPhotos}

                        >



                            <span>

                                See Itinerary Photos

                            </span>



                            <b>

                                ↓

                            </b>



                        </button>



                    )}



                </div>



            </div>









            {/* =================================================

                DAY TABS

            ================================================= */}



            <div className="day-tabs">



                {days.map(

                    (day) => (



                        <button

                            key={day}

                            type="button"



                            className={

                                `day-tab ${

                                    selectedDay === day

                                        ? 'active'

                                        : ''

                                }`

                            }



                            onClick={() => {



                                setSelectedDay(

                                    day

                                );



                                setCurrentImageIndex(

                                    0

                                );



                            }}

                        >



                            Day {day}



                        </button>



                    )

                )}



            </div>





            {/* =================================================

                DAY HEADING

            ================================================= */}



            <div

                className="selected-day-heading"

            >



                <p>

                    DAY {selectedDay}

                </p>





                <h2>

                    Day {selectedDay} Itinerary

                </h2>





                <span>

                    {selectedPlaces.length}{' '}

                    {selectedPlaces.length === 1

                        ? 'place'

                        : 'places'}{' '}

                    to explore

                </span>



            </div>





            {/* =================================================

                ITINERARY LIST

            ================================================= */}



            <div className="day-itinerary">



                {selectedPlaces.map(

                    (

                        place,

                        index

                    ) => (



                        <article

                            className="day-place-card"

                            key={place.id}

                        >



                            <div

                                className="day-place-content"

                            >





                                {/* NUMBER */}



                                <div

                                    className="day-place-number"

                                >



                                    {String(

                                        index + 1

                                    ).padStart(

                                        2,

                                        '0'

                                    )}



                                </div>





                                {/* PLACE */}



                                <div

                                    className="day-place-info"

                                >



                                    {place.time &&

                                        place.time !==

                                            'Flexible' && (



                                            <span

                                                className="day-place-time"

                                            >

                                                {place.time}

                                            </span>



                                        )}





                                    <h3>

                                        {place.name}

                                    </h3>



                                </div>



                            </div>



                        </article>



                    )

                )}





                {/* EMPTY DAY */}



                {selectedPlaces.length === 0 && (



                    <div className="empty-day">



                        No places planned for

                        Day {selectedDay}.



                    </div>



                )}



            </div>





            {/* =================================================

                ITINERARY PHOTOS

            ================================================= */}



            {currentPlace && (



                <section

                    id="itinerary-photos"

                    className="itinerary-photos-section"

                >





                    {/* =================================================

                        PHOTO SECTION HEADER

                    ================================================= */}



                    <div

                        className="itinerary-photos-heading"

                    >



                        <div>



                            <p className="eyebrow">

                                {city.name} · journey

                            </p>





                            <h2>

                                Moments from

                                <br />



                                <span>

                                    your itinerary.

                                </span>

                            </h2>



                        </div>





                    </div>





                    {/* =================================================

                        IMAGE + CITY DESCRIPTION

                    ================================================= */}



                    <div

                        className="itinerary-photos-layout"

                    >





                        {/* =================================================

                            LEFT IMAGE

                        ================================================= */}



                        <div

                            className="place-photo-box"

                            onMouseEnter={() => setIsPhotoHovered(true)}

                            onMouseLeave={() => setIsPhotoHovered(false)}

                        >





                            {/* IMAGE */}



                            <AnimatePresence

                                mode="wait"

                            >



                                <motion.img



                                    key={

                                        currentPlace.id

                                    }



                                    src={

                                        currentPlace.image

                                    }



                                    alt={

                                        currentPlace.name

                                    }



                                    className="place-photo-image"





                                    initial={{

                                        opacity: 0,

                                        scale: 1.04

                                    }}





                                    animate={{

                                        opacity: 1,

                                        scale: 1

                                    }}





                                    exit={{

                                        opacity: 0,

                                        scale: 0.99

                                    }}





                                    transition={{

                                        duration: 0.65,



                                        ease: [

                                            0.22,

                                            1,

                                            0.36,

                                            1

                                        ]

                                    }}



                                />



                            </AnimatePresence>





                            {/* IMAGE OVERLAY */}



                            <div

                                className="place-photo-overlay"

                            />





                            {/* =================================================

                                PREVIOUS

                            ================================================= */}



                            {imagePlaces.length > 1 && (



                                <button

                                    type="button"



                                    className={

                                        `place-photo-nav

                                         place-photo-nav-left`

                                    }



                                    aria-label="Previous photo"



                                    onClick={

                                        previousPhoto

                                    }

                                >



                                    <span>

                                        ←

                                    </span>



                                </button>



                            )}





                            {/* =================================================

                                NEXT

                            ================================================= */}



                            {imagePlaces.length > 1 && (



                                <button

                                    type="button"



                                    className={

                                        `place-photo-nav

                                         place-photo-nav-right`

                                    }



                                    aria-label="Next photo"



                                    onClick={

                                        nextPhoto

                                    }

                                >



                                    <span>

                                        →

                                    </span>



                                </button>



                            )}





                            {/* =================================================

                                CURRENT PLACE

                            ================================================= */}



                            <div

                                className="place-photo-name"

                            >



                                <p>

                                    {city.name}

                                </p>





                                <h2>

                                    {currentPlace.name}

                                </h2>



                            </div>





                            {/* =================================================

                                DOTS

                            ================================================= */}



                            {imagePlaces.length > 1 && (



                                <div

                                    className="place-photo-dots"

                                >



                                    {imagePlaces.map(

                                        (

                                            place,

                                            index

                                        ) => (



                                            <button

                                                key={

                                                    place.id

                                                }



                                                type="button"



                                                aria-label={

                                                    `Show ${place.name}`

                                                }



                                                className={

                                                    index ===

                                                    currentImageIndex

                                                        ? 'active'

                                                        : ''

                                                }



                                                onClick={() =>

                                                    setCurrentImageIndex(

                                                        index

                                                    )

                                                }

                                            />



                                        )

                                    )}



                                </div>



                            )}



                        </div>





                        {/* =================================================

                            RIGHT CITY INFORMATION

                        ================================================= */}



                        <div

                            className="place-photo-description"

                        >



                            <p className="eyebrow">

                                About {city.name}

                            </p>





                            <p

                                className="city-photo-description"

                            >

                                {cityPhotoDescription}

                            </p>





                            {/* CURRENT STOP */}



                            <div

                                className="photo-side-detail"

                            >



                                <span>

                                    CURRENT STOP

                                </span>



                                <strong>

                                    {currentPlace.name}

                                </strong>



                            </div>





                            {/* DAY */}



                            <div

                                className="photo-side-detail"

                            >



                                <span>

                                    ITINERARY

                                </span>



                                <strong>

                                    Day {selectedDay}

                                </strong>



                            </div>



                        </div>



                    </div>





                    {/* =================================================

                        PHOTO FOOTER

                    ================================================= */}



                    <div

                        className="place-photo-footer"

                    >



                        <span>

                            {city.name}

                        </span>





                        <span>

                            {imagePlaces.length}{' '}



                            {imagePlaces.length === 1

                                ? 'PHOTO'

                                : 'PHOTOS'}

                        </span>



                    </div>



                </section>



            )}





            {/* =================================================

                PLAN JOURNEY

            ================================================= */}



            <div

                className="city-plan-button"

            >



                <Link

                    className="button primary"

                    to="/enquiry"

                >

                    Plan this journey →

                </Link>



            </div>



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

function BackToTop() { const [visible, setVisible] = useState(false);
useEffect(() => { const update = () => setVisible(window.scrollY > 360);
update(); window.addEventListener('scroll', update, { passive: true });
return () => window.removeEventListener('scroll', update) }, []); return
<button className={visible ? 'back-to-top is-visible' : 'back-to-top'}
onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
aria-label="Back to top">↑ </button> }

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

function App() { const [payload, setPayload] = useState(null); const
[loading, setLoading] = useState(true); const [error, setError] =
useState(); const travel = useMemo(() => normalise(payload),
[payload]); 

useEffect(() => {
    fetch(API_URL)
        .then((response) => {
            if (!response.ok)
                throw new Error("Unable to load destinations");

            return response.json();
        })
        .then((data) => {
            console.log("🔥 FULL API RESPONSE:", data);
            setPayload(data);
        })
        .catch((reason) => {
            console.error("🔥 API ERROR:", reason);
            setError(reason.message);
        })
        .finally(() => setLoading(false));
}, []);

return (

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



          <footer className="wt-footer">

    <div className="wt-footer-top">

        {/* Office */}
        <div className="wt-footer-column wt-office">
            <Link className="wt-footer-brand" to="/">
                Wayout Tourz
            </Link>

            <h4>Head Office</h4>

            <p>
                65, TR Palayam,<br />
                Kangeyam, Tiruppur - 638701
            </p>

            <a
                className="wt-footer-email"
                href="mailto:contact@wayouttourz.com"
            >
                contact@wayouttourz.com
            </a>
        </div>


        {/* Our Branches */}
        <div className="wt-footer-column">
            <h4>Our Branches</h4>

            <div className="wt-branches">
                <span>Salem</span>
                <span>Thiruppur</span>
                <span>Coimbatore</span>
                <span>Madurai</span>
                <span>Trichy</span>
                <span>Namakkal</span>
                <span>Hosur</span>
                <span>Bangalore</span>
                <span>Chennai</span>
                <span>Vellore</span>
                <span>Vagamon</span>
            </div>
        </div>


        {/* Travel Packages / SEO */}
        <div className="wt-footer-column">
            <h4>Travel Packages</h4>

            <ul className="wt-seo-list">
                <li>Tamil Nadu Travel Packages</li>
                <li>Best College IV Packages</li>
                <li>College Industrial Visit Packages</li>
                <li>Corporate Travel Packages</li>
                <li>Group Tour Packages</li>
                <li>Customized Tour Packages</li>
                <li>Educational Tour Packages</li>
                <li>Family & Friends Tour Packages</li>
                <li>South India Tour Packages</li>
                <li>Weekend Getaways</li>
            </ul>
        </div>


        {/* Contact */}
        <div className="wt-footer-column">
            <h4>Contact Us</h4>

            <div className="wt-contacts">

                <a href="tel:+919345865387">
                    <span>Gokul</span>
                    <strong>93458 65387</strong>
                </a>

                <a href="tel:+918940487802">
                    <span>Surya</span>
                    <strong>89404 87802</strong>
                </a>

                <a href="tel:+919080515866">
                    <span>Selva</span>
                    <strong>90805 15866</strong>
                </a>

                <a href="tel:+918610093151">
                    <span>Lokesh</span>
                    <strong>86100 93151</strong>
                </a>

            </div>


            {/* Social Media */}
            <div className="wt-social">

                <h4>Follow Us</h4>

                <div className="wt-social-links">

                    <a
                        href="https://www.instagram.com/wayout_tourz/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Wayout Tourz Instagram"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <rect
                                x="3"
                                y="3"
                                width="18"
                                height="18"
                                rx="5"
                            />
                            <circle cx="12" cy="12" r="4" />
                            <circle
                                cx="17.5"
                                cy="6.5"
                                r="1"
                                className="social-dot"
                            />
                        </svg>
                    </a>

                    <a
                        href="https://www.linkedin.com/company/wayout-tourz/posts/"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label="Wayout Tourz LinkedIn"
                    >
                        <svg viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M5 3.5A1.5 1.5 0 1 1 5 6.5A1.5 1.5 0 0 1 5 3.5Z" />
                            <path d="M3.7 8.5H6.3V20H3.7Z" />
                            <path d="M9 8.5H11.5V10.1C12.2 9 13.3 8.2 15 8.2C18 8.2 20 10.1 20 13.8V20H17.4V14.4C17.4 12.7 16.8 11.1 15 11.1C13.2 11.1 11.7 12.2 11.7 14.5V20H9Z" />
                        </svg>
                    </a>

                </div>
            </div>

        </div>

    </div>


    {/* Bottom */}
    <div className="wt-footer-bottom">

        <p>
            © 2026 Wayout Tourz · Curated Travel Experiences
        </p>

        <p>
            Travel • Explore • Experience
        </p>

    </div>

</footer>


        </div>



    </HashRouter>

)

}

export default App

