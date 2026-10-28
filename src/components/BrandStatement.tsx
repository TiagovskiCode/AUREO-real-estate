import AnimatedText from './AnimatedText'

export default function BrandStatement() {
  return (
    <section className="statement" aria-labelledby="statement-title">
      <div className="statement__rule" aria-hidden data-fade />
      <div className="container statement__inner">
        <p className="label label--light" data-fade>
          <span className="label__dash" aria-hidden /> The AUREO philosophy
        </p>
        <AnimatedText as="h2" id="statement-title" className="display display--xxl display--light">
          Not Just a Property. <em>A Way of Living.</em>
        </AnimatedText>
        <ul className="statement__notes" data-stagger>
          <li>Considered architecture</li>
          <li>Quiet confidence</li>
          <li>Lasting value</li>
        </ul>
      </div>
    </section>
  )
}
