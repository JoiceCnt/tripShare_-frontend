export default function AboutPage() {
  return (
    <main className="tm-about" role="main">
      <section className="tm-about-container">
        <h1 className="tm-about-title">About Us</h1>

        <p className="tm-about-text">
          TripShare is a project created by two full-stack students who love
          traveling and building useful tools. Our idea is simple: help
          travelers connect with people who will be in the{" "}
          <strong>same place on the same dates</strong>. Add your destination
          and trip dates, and TripMatch shows others with overlapping plans, so
          you can share tips or even meet for a walk, a meal, or a museum visit.
          We keep things friendly and straightforward, with a focus on safety
          and respect. This app is our way of turning solo trips into shared
          moments and new friendships. We’re improving it step by step and
          welcome your feedback.
        </p>

        <div className="tm-founders" aria-label="Founders">
          {/* Noemi */}
          <article className="tm-founder-card">
            <div className="tm-founder-photo">
              {/* Put your real photo in /public/images/noemi.jpg */}
              <img
                src="/images/fotoNoemi.png"
                alt="Portrait of Noemi Mira Navarro"
              />
            </div>

            <div className="tm-founder-info">
              <h3 className="tm-founder-name">Noemi Mira Navarro</h3>
              <div className="tm-founder-links" aria-label="Noemi social links">
                <a
                  className="tm-icon-link"
                  href="https://www.linkedin.com/in/NOEMI_LINK"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Noemi on LinkedIn"
                  title="LinkedIn"
                >
                  {/* LinkedIn icon */}
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8.98h5V24H0V8.98zM8.5 8.98H13v2.05h.06c.63-1.2 2.18-2.46 4.49-2.46 4.8 0 5.69 3.16 5.69 7.27V24h-5v-6.63c0-1.58-.03-3.62-2.21-3.62-2.21 0-2.55 1.73-2.55 3.51V24h-5V8.98z" />
                  </svg>
                </a>
                <a
                  className="tm-icon-link"
                  href="https://github.com/NOEMI_GITHUB"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Noemi on GitHub"
                  title="GitHub"
                >
                  {/* GitHub icon */}
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.78-1.34-1.78-1.09-.75.08-.74.08-.74 1.21.08 1.84 1.25 1.84 1.25 1.07 1.83 2.8 1.3 3.48.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.23v3.3c0 .32.21.7.83.58A12 12 0 0 0 12 .5z" />
                  </svg>
                </a>
              </div>
            </div>
          </article>

          {/* Joice */}
          <article className="tm-founder-card">
            <div className="tm-founder-photo">
              {/* Put your real photo in /public/images/joice.jpg */}
              <img src="/images/fotoJoice.jpg" alt="Portrait of Joice Conte" />
            </div>

            <div className="tm-founder-info">
              <h3 className="tm-founder-name">Joice Conte</h3>
              <div className="tm-founder-links" aria-label="Joice social links">
                <a
                  className="tm-icon-link"
                  href="https://www.linkedin.com/in/joiceconte/"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Joice on LinkedIn"
                  title="LinkedIn"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M4.98 3.5C4.98 4.88 3.86 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1s2.48 1.12 2.48 2.5zM0 8.98h5V24H0V8.98zM8.5 8.98H13v2.05h.06c.63-1.2 2.18-2.46 4.49-2.46 4.8 0 5.69 3.16 5.69 7.27V24h-5v-6.63c0-1.58-.03-3.62-2.21-3.62-2.21 0-2.55 1.73-2.55 3.51V24h-5V8.98z" />
                  </svg>
                </a>
                <a
                  className="tm-icon-link"
                  href="https://github.com/JOICE_GITHUB"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Joice on GitHub"
                  title="GitHub"
                >
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M12 .5a12 12 0 0 0-3.79 23.39c.6.11.82-.26.82-.58v-2.02c-3.34.73-4.04-1.61-4.04-1.61-.55-1.4-1.34-1.78-1.34-1.78-1.09-.75.08-.74.08-.74 1.21.08 1.84 1.25 1.84 1.25 1.07 1.83 2.8 1.3 3.48.99.11-.78.42-1.3.76-1.6-2.67-.3-5.47-1.34-5.47-5.95 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.17 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.65.24 2.87.12 3.17.77.84 1.24 1.91 1.24 3.22 0 4.62-2.81 5.64-5.49 5.94.43.37.81 1.1.81 2.23v3.3c0 .32.21.7.83.58A12 12 0 0 0 12 .5z" />
                  </svg>
                </a>
              </div>
            </div>
          </article>
        </div>
      </section>
    </main>
  );
}
