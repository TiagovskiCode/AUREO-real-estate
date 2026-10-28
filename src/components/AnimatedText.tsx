import type { ElementType, ReactNode } from 'react'

type Props = {
  as?: ElementType
  className?: string
  delay?: number
  children: ReactNode
  id?: string
}

/** Marks text for the line-by-line masked reveal wired in lib/motion.ts. */
export default function AnimatedText({ as: Tag = 'p', className, delay, children, id }: Props) {
  return (
    <Tag className={className} id={id} data-split data-delay={delay}>
      {children}
    </Tag>
  )
}
