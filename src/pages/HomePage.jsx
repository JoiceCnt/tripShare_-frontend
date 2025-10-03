// src/pages/HomePage.jsx
import { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./HomePage.css";

/* ---- Slides para el carrusel ---- */
const slides = [
  { src: "/images/friends.jpg", title: "Make new friends" },
  { src: "/images/enjoy.jpg", title: "Enjoy life" },
  { src: "/images/nature.jpg", title: "Explore nature together" },
  { src: "/images/astronauts.jpg", title: "Discover new experiences" },
  { src: "/images/bikes.jpg", title: "City rides" },
  { src: "/images/door.jpg", title: "Explore cultures" },
];

/* ---- Cards de destinos ---- */
const infoCards = [
  {
    id: "ny",
    title: "New York",
    img: "/images/ny.jpg",
    text: `New York City is often called “The City That Never Sleeps”, and with good reason. It’s a place where ambition meets creativity, and every street corner tells a story...`,
  },
  {
    id: "paris",
    title: "Paris",
    img: "/images/paris.jpg",
    text: `Paris is a city that blends timeless beauty with modern life. If you’re visiting, start with the Eiffel Tower...`,
  },
  {
    id: "rio",
    title: "Rio de Janeiro",
    img: "/images/rio.jpg",
    text: `Rio de Janeiro is a city where nature and culture blend in perfect harmony...`,
  },
];

/* ---- Componente interno para la sección "Read more" ---- */
function ReadMoreSection() {
  const [openId, setOpenId] = useState(null);
  const toggle = (id) => setOpenId((curr) => (curr === id ? null : id));

  return (
    <section className="more-cards">
      <h2>Destinations</h2>

      <div className="more-grid">
        {infoCards.map((c) => (
          <article key={c.id} className="more-card">
            <img src={c.img} alt={c.title} loading="lazy" />
            <h3>{c.title}</h3>
            <button
              className={`readmore-btn ${openId === c.id ? "active" : ""}`}
              onClick={() => toggle(c.id)}
              aria-expanded={openId === c.id}
              aria-controls={`panel-${c.id}`}
            >
              Read more
            </button>
          </article>
        ))}
      </div>

      {/* Panel dinámico debajo de los cards */}
      <div
        className={`readmore-panel ${openId ? "open" : ""}`}
        id={`panel-${openId || "none"}`}
        role="region"
        aria-live="polite"
      >
        {openId ? (
          <p>{infoCards.find((x) => x.id === openId)?.text}</p>
        ) : (
          <p className="hint">Select a destination to read more.</p>
        )}
      </div>
    </section>
  );
}

/* ---- Página principal ---- */
export default function HomePage() {
  return (
    <main className="home">
      <h1>Welcome to TripShare 🌍</h1>
      <p>We can do it alone, but why not together?</p>

      {/* Carrusel */}
      <section className="hero-carousel" aria-label="Highlights">
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 3500 }}
          loop
          spaceBetween={16}
          slidesPerView={1.2}
          breakpoints={{
            640: { slidesPerView: 2.2 },
            900: { slidesPerView: 3.2 },
            1200: { slidesPerView: 4 },
          }}
          className="home-swiper"
        >
          {slides.map((s, i) => (
            <SwiperSlide key={i}>
              <article className="slide-card">
                <img src={s.src} alt={s.title} loading="lazy" />
                <span className="slide-title">{s.title}</span>
              </article>
            </SwiperSlide>
          ))}
        </Swiper>
      </section>

      {/* Historias de miembros */}
      <section className="member-stories">
        <h2>Member Stories</h2>

        <div className="stories-grid">
          <article className="story-card">
            <p>
              “Before our Mallorca trip, Henrik and I matched with Elena and
              Marco on TripShare. They were also planning hikes in the
              Tramuntana mountains, so we set up a meet-up...”
            </p>
            <span className="author">Told by Clara</span>
          </article>

          <article className="story-card">
            <p>
              “Lukas and I were going to Barcelona for a weekend and decided to
              try this app called TripShare. That’s how we got connected with
              Sofía and Diego...”
            </p>
            <span className="author">Told by Anna</span>
          </article>
        </div>

        <p className="share-text">
          Share your story with us. Send an email to :
          <br />
          <a href="mailto:mybestrip@tripmatch.com">mybestrip@tripmatch.com</a>
        </p>

        <hr className="section-divider" />
      </section>

      {/* Destinos con Read more */}
      <ReadMoreSection />
    </main>
  );
}
