import { useState } from "react";

export default function ContactUs() {
  const EMAIL = "support@tripshare.com";
  const [copied, setCopied] = useState(false);

  // Copy email to clipboard and show a tiny confirmation
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // noop (clipboard may be blocked by browser permissions)
    }
  };

  // Inline CSS to keep everything in one file
  const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Gafata&display=swap');

  :root{
    --primary:#1C3739; --surface:#FFFFFF; --field:#F5F5F5;
    --title:#1C3739; --text:#213235; --shadow:0 2px 8px rgba(0,0,0,.12);
    --radius:12px;
  }
  *{box-sizing:border-box} body{background:var(--surface)}
  .wrap{min-height:auto; display:grid; place-items:start center; justify-content:center; padding:24px 16px; gap:16px; font-family:"Gafata",system-ui,Segoe UI,Roboto,Arial,sans-serif; color:var(--text);}
  h1{margin bottom: 12px; font-size:32px; text-align:center; color:var(--title)}
  .card{width:100%; max-width:400px; padding:16px; border:1px solid var(--primary); border-radius:var(--radius); background:var(--field); box-shadow:var(--shadow);}
  .msg{font-size:18px; line-height:1.45; margin:0 0 16px}
  .email{display:inline-flex; align-items:center; gap:10px; }
  .mailto{color:var(--primary); font-weight:700; text-decoration:none;}
  .btn{padding:8px 14px; border-radius:999px; border:0; background:var(--primary); color:#fff; font-weight:600; cursor:pointer}
  .tiny{font-size:13px; color:#587174; margin-top:10px}
  `;

  return (
    <>
      <style>{styles}</style>

      <main className="wrap">
        <h1>Contact Us</h1>

        <section className="card" aria-label="Contact information">
          <p className="msg">
            For any questions, suggestions, or information, please contact our
            team:
          </p>

          <div className="email">
            <a className="mailto" href={`mailto:${EMAIL}`}>
              {EMAIL}
            </a>
            <button className="btn" type="button" onClick={copyEmail}>
              {copied ? "Copied ✓" : "Copy email"}
            </button>
          </div>

          <p className="tiny">
            Please note that response times may vary between 24 and 48 business
            hours.
          </p>
        </section>
      </main>
    </>
  );
}
