import { motion } from 'framer-motion'

type MotionWrapperProps = {
  reducedMotion: boolean
  delay?: number
  y?: number
  className?: string
  children: React.ReactNode
}

export default function MotionWrapper({
  reducedMotion,
  delay = 0,
  y = 16,
  className,
  children
}: MotionWrapperProps) {
  if (reducedMotion) {
    return <div className={className}>{children}</div>
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay }}
    >
      {children}
    </motion.div>
  )
}
