import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, EffectCoverflow, Pagination, Navigation } from 'swiper/modules'

// Swiper core styles + modules
import 'swiper/css'
import 'swiper/css/effect-coverflow'
import 'swiper/css/pagination'
import 'swiper/css/navigation'

import { destinations } from './destinations'
import './HeroCarousel.css'

// Prefetch the first image so the hero background is never blank on load.
const PRELOADED = new Set()
function preloadImage(src) {
  if (!PRELOADED.has(src)) {
    PRELOADED.add(src)
    const img = new Image()
    img.src = src
  }
}
destinations.forEach((d) => preloadImage(d.image))

export default function HeroCarousel() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [tiltDirection, setTiltDirection] = useState(0) // 0 none, -1 prev, 1 next
  const backgroundRef = useRef(null)
  const prevRef = useRef(null)
  const nextRef = useRef(null)
  const swiperRef = useRef(null)

  const active = destinations[activeIndex]

  // Keep two stacked background layers so the image can crossfade smoothly.
  const [bgLayers, setBgLayers] = useState([
    { src: destinations[0].image, visible: true },
    { src: destinations[0].image, visible: false },
  ])

  const handleSlideChange = useCallback((swiper) => {
    const realIndex = swiper.realIndex
    setActiveIndex(realIndex)

    const nextSrc = destinations[realIndex].image
    preloadImage(nextSrc)

    // Crossfade: hide the current layer and reveal the next one.
    setBgLayers((prev) => {
      const current = prev.find((l) => l.visible)
      return [
        { src: current ? current.src : prev[0].src, visible: false },
        { src: nextSrc, visible: true },
      ]
    })
  }, [])

  useEffect(() => {
    // Reset any tilt when the active slide changes.
    setTiltDirection(0)
  }, [activeIndex])

  const goPrev = useCallback(() => {
    swiperRef.current?.slidePrev()
  }, [])

  const goNext = useCallback(() => {
    swiperRef.current?.slideNext()
  }, [])

  const handlePrevHover = (on) => on && setTiltDirection(-1)
  const handleNextHover = (on) => on && setTiltDirection(1)

  return (
    <section className="hero-coverflow" aria-label="Featured destinations">
      {/* Crossfading blurred background */}
      <div className="hero-background" ref={backgroundRef} aria-hidden="true">
        {bgLayers.map((layer, i) => (
          <div
            key={i}
            className="hero-bg-layer"
            style={{
              backgroundImage: `url(${layer.src})`,
              opacity: layer.visible ? 1 : 0,
            }}
          />
        ))}
        <div className="hero-overlay" />
        <div className="hero-vignette" />
      </div>

      {/* Headline */}
      <div className="hero-headline">
        <h1>
          Wayout <span>Tourz</span>
        </h1>
        <p>Your next adventure starts here — explore breathtaking destinations.</p>
      </div>

      {/* Carousel */}
      <div className="hero-carousel-wrap">
        <Swiper
          onSwiper={(swiper) => {
            swiperRef.current = swiper
          }}
          modules={[Autoplay, EffectCoverflow, Pagination, Navigation]}
          effect="coverflow"
          grabCursor
          centeredSlides
          loop
          speed={800}
          autoplay={{ delay: 4000, disableOnInteraction: false, pauseOnMouseEnter: true }}
          coverflowEffect={{
            rotate: 32,
            stretch: 0,
            depth: 160,
            modifier: 1.2,
            slideShadows: true,
          }}
          pagination={{ clickable: true, el: '.hero-pagination' }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          onSlideChange={handleSlideChange}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current
            swiper.params.navigation.nextEl = nextRef.current
          }}
          breakpoints={{
            0: { slidesPerView: 1, coverflowEffect: { rotate: 28, depth: 120, modifier: 1 } },
            768: { slidesPerView: 3, coverflowEffect: { rotate: 32, depth: 150, modifier: 1.1 } },
            1200: { slidesPerView: 5, coverflowEffect: { rotate: 32, depth: 160, modifier: 1.2 } },
          }}
          className="hero-swiper"
        >
          {destinations.map((dest, index) => {
            const isActive = index === activeIndex
            return (
              <SwiperSlide key={dest.id} className="hero-slide">
                <div
                  className={`hero-card ${isActive ? 'is-active' : ''}`}
                  style={{
                    // Nearby cards tilt based on hovered arrow direction.
                    '--tilt': isActive ? 0 : tiltDirection || 0,
                  }}
                >
                  <div className="hero-card-media">
                    <img
                      src={dest.image}
                      alt={dest.name}
                      loading={index === 0 ? 'eager' : 'lazy'}
                      decoding="async"
                    />
                    <div className="hero-card-shade" />
                  </div>

                  <AnimatePresence mode="wait">
                    {isActive && (
                      <motion.div
                        key={dest.id}
                        className="hero-card-content"
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -16 }}
                        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <motion.span
                          className="hero-badge"
                          initial={{ opacity: 0, y: 12 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.1, duration: 0.4 }}
                        >
                          {dest.badge}
                        </motion.span>
                        <motion.h2
                          initial={{ opacity: 0, y: 16 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.18, duration: 0.45 }}
                        >
                          {dest.name}
                        </motion.h2>
                        <motion.p
                          className="hero-tagline"
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.26, duration: 0.45 }}
                        >
                          {dest.tagline}
                        </motion.p>
                        <motion.p
                          className="hero-desc"
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.34, duration: 0.45 }}
                        >
                          {dest.description}
                        </motion.p>
                        <motion.div
                          className="hero-cta-row"
                          initial={{ opacity: 0, y: 14 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.42, duration: 0.45 }}
                        >
                          {/* <a href="/enquiry" className="hero-cta">
                            Explore Now
                            <svg viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M5 12h14M13 6l6 6-6 6" />
                            </svg>
                          </a> */}
                        </motion.div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </SwiperSlide>
            )
          })}
        </Swiper>
      </div>

      {/* Arrows */}
      <button
        ref={prevRef}
        className="hero-arrow hero-arrow--prev"
        aria-label="Previous destination"
        onClick={goPrev}
        onMouseEnter={() => handlePrevHover(true)}
        onMouseLeave={() => setTiltDirection(0)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button
        ref={nextRef}
        className="hero-arrow hero-arrow--next"
        aria-label="Next destination"
        onClick={goNext}
        onMouseEnter={() => handleNextHover(true)}
        onMouseLeave={() => setTiltDirection(0)}
      >
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dots */}
      <div className="hero-pagination" />
    </section>
  )
}
