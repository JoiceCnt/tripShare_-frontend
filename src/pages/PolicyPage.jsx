export default function PolicyPage() {
  return (
    <>
      {/* Inline CSS (same page) */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Gafata&display=swap');

        :root{
          --ink:#1C3739;
          --ink-60:#1c3739cc;
          --bg:#ffffff;
          --card:#f7f9f9;
          --accent:#1C3739;
        }

        .policy{
          font-family: 'Gafata', system-ui, -apple-system, Segoe UI, Roboto, Arial, sans-serif;
          color: var(--ink);
          background: var(--bg);
          padding: 24px;
          line-height: 1.6;
          max-width: 900px;
          margin: 0 auto;
        }

        .policy h1{
          font-size: 32px; /* matches your second screenshot */
          line-height: 1.25; /* ~25px at 20px base; visually tight */
          letter-spacing: 0;
          margin: 0 0 12px 0;
          color: var(--accent);
        }

        .policy .subhead{
          color: var(--ink-60);
          margin-bottom: 24px;
        }

        .card{
          background: var(--card);
          border-radius: 14px;
          padding: 18px 18px;
          margin: 18px 0;
        }

        .policy h2{
          font-size: 20px;
          margin: 18px 0 8px;
        }

        .policy p, .policy li{
          font-size: 16px; /* matches your first screenshot */
          letter-spacing: 0;
        }

        .policy ul{
          padding-left: 20px;
        }

        .muted{
          color: var(--ink-60);
          font-size: 14px;
        }

        .toc{
          display: grid;
          gap: 4px;
          margin: 12px 0 18px;
        }
        .toc a{
          text-decoration: none;
          color: var(--accent);
        }
        .toc a:hover{
          text-decoration: underline;
        }

        @media (max-width: 600px){
          .policy{ padding:16px; }
          .policy h1{ font-size: 28px; }
        }
      `}</style>

      <section className="policy">
        <h1>Trip Share — Privacy & Data Use Policy</h1>
        <p className="subhead">Last updated: 26/09/2025</p>

        <div className="card">
          <strong>Quick summary:</strong>
          <ul>
            <li>
              We collect only what we need to run Trip Share and improve your
              experience.
            </li>
            <li>We never sell your personal data.</li>
            <li>You can access, update, or delete your data at any time.</li>
            <li>
              Contact us:{" "}
              <a href="mailto:support@tripshare.com">support@tripshare.com</a>
            </li>
          </ul>
        </div>

        <div className="card">
          <h2 id="intro">1) Introduction</h2>
          <p>
            Your privacy matters. This Policy explains what we collect, how we
            use it, when we share it, and the rights you have. By using Trip
            Share, you agree to this Policy.
          </p>
        </div>

        <div className="card">
          <h2 id="collect">2) Information We Collect</h2>
          <ul>
            <li>
              <strong>Account data:</strong> name, email, password (hashed), and
              preferences you provide.
            </li>
            <li>
              <strong>Usage data:</strong> searches, clicks, viewed trips,
              device info, and diagnostics.
            </li>
            <li>
              <strong>Location (optional):</strong> if enabled, we use your
              device location to tailor results.
            </li>
            <li>
              <strong>Contact data:</strong> messages you send to support.
            </li>
          </ul>
        </div>

        <div className="card">
          <h2 id="use">3) How We Use Your Information</h2>
          <ul>
            <li>
              Operate, maintain, and improve Trip Share features and
              performance.
            </li>
            <li>
              Personalize recommendations and content relevant to your profile
              and location settings.
            </li>
            <li>
              Communicate about updates, service notices, and—with your
              consent—promotions.
            </li>
            <li>
              Prevent fraud, secure accounts, and comply with legal obligations.
            </li>
          </ul>
        </div>

        <div className="card">
          <h2 id="share">4) When We Share Information</h2>
          <ul>
            <li>
              <strong>Service providers:</strong> hosting, analytics, and
              support vendors under contract.
            </li>
            <li>
              <strong>Legal reasons:</strong> to comply with law, court orders,
              or protect rights and safety.
            </li>
            <li>
              <strong>Business transfers:</strong> if we merge or sell assets,
              your data may transfer with notice.
            </li>
          </ul>
          <p>
            <em>We do not sell or rent your personal data.</em>
          </p>
        </div>

        <div className="card">
          <h2 id="security">5) Data Security & Retention</h2>
          <p>
            We use reasonable technical and organizational measures to protect
            your data. No system is 100% secure, but we continuously improve our
            safeguards. We retain data only as long as needed for the purposes
            above or as required by law.
          </p>
        </div>

        <div className="card">
          <h2 id="rights">6) Your Rights</h2>
          <ul>
            <li>Access, correct, or delete your personal information.</li>
            <li>Opt out of marketing messages at any time.</li>
            <li>Disable location sharing in your device settings.</li>
            <li>
              Request a copy of your data or restrict processing where
              applicable by law.
            </li>
          </ul>
          <p className="muted">
            We’ll respond to verified requests within a reasonable timeframe.
          </p>
        </div>

        <div className="card">
          <h2 id="children">7) Children’s Privacy</h2>
          <p>
            Trip Share is not intended for children under 13. We do not
            knowingly collect data from children.
          </p>
        </div>

        <div className="card">
          <h2 id="changes">8) Changes to This Policy</h2>
          <p>
            We may update this Policy from time to time. We’ll post the new
            “Last updated” date and, when appropriate, provide additional notice
            within the app.
          </p>
        </div>

        <div className="card">
          <h2 id="contact">9) Contact Us</h2>
          <p>
            Questions or concerns? Email{" "}
            <a href="mailto:support@tripshare.com">support@tripshare.com</a>.
          </p>
        </div>
      </section>
    </>
  );
}
