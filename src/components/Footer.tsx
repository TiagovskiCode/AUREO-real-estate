import { navLinks } from '../data/content'

const socials = ['Instagram', 'LinkedIn', 'Pinterest']

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <a href="#home" className="wordmark wordmark--lg" aria-label="AUREO — back to top">
            AUREO
          </a>
          <p>Exceptional properties for those who value place, craft and quiet confidence.</p>
        </div>

        <nav aria-label="Footer" className="footer__col">
          <h2 className="label label--light">Explore</h2>
          <ul>
            {navLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href}>{l.label}</a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="footer__col">
          <h2 className="label label--light">Contact (conceptual)</h2>
          <ul>
            <li>Avenida da Luz 100, Lisbon</li>
            <li>hello@aureo.example</li>
            <li>+00 000 000 000</li>
          </ul>
        </div>

        <div className="footer__col">
          <h2 className="label label--light">Follow</h2>
          <ul>
            {socials.map((s) => (
              <li key={s}>
                <span className="footer__placeholder" title="Placeholder — no real profile">
                  {s}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container footer__base">
        <p>© {new Date().getFullYear()} AUREO Real Estate. A fictional brand created as a design and development concept.</p>
        <p>Photography is illustrative. Listings, prices and details are not real.</p>
      </div>
    </footer>
  )
}
