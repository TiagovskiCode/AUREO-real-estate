type Props = {
  src: string
  alt: string
  width: number
  height: number
  className?: string
  position?: string
  parallax?: number
  eager?: boolean
  reveal?: boolean
  sizes?: string
}

/**
 * Image frame with a reserved aspect ratio (no layout shift), an optional clip-path reveal
 * and an optional parallax drift. The CSS ratio is set by the parent via `className`.
 */
export default function RevealImage({
  src,
  alt,
  width,
  height,
  className = '',
  position = '50% 50%',
  parallax,
  eager,
  reveal = true,
  sizes,
}: Props) {
  return (
    <div className={`media ${className}`} {...(reveal ? { 'data-reveal-img': '' } : {})}>
      <div className="media__zoom">
        <img
          src={src}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          loading={eager ? 'eager' : 'lazy'}
          decoding="async"
          style={{ objectPosition: position }}
          {...(parallax ? { 'data-parallax': parallax } : {})}
          className={parallax ? 'is-parallax' : undefined}
        />
      </div>
    </div>
  )
}
