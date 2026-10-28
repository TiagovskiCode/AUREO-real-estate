import AnimatedText from './AnimatedText'

export default function ArchitecturalInterlude() {
  return (
    <section className="interlude" aria-labelledby="interlude-title">
      <div className="interlude__frame">
        <img
          src="/images/interlude.jpg"
          width={2400}
          height={1600}
          alt="Cantilevered white villa with a timber soffit above a long dark reflecting pool"
          loading="lazy"
          decoding="async"
          data-parallax="10"
          className="is-parallax"
        />
      </div>
      <div className="interlude__shade" aria-hidden />
      <div className="container interlude__content">
        <p className="label label--light" data-fade>
          Architecture · Light · Place
        </p>
        <AnimatedText as="h2" id="interlude-title" className="display display--xl display--light">
          Architecture That Moves You.
        </AnimatedText>
      </div>
    </section>
  )
}
