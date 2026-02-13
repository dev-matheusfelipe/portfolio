import { motion } from 'framer-motion'

type ProgressRadialProps = {
  value: number
  reducedMotion: boolean
  size?: number
}

export default function ProgressRadial({ value, reducedMotion, size = 58 }: ProgressRadialProps) {
  const normalized = Math.max(0, Math.min(100, value))
  const stroke = 5
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (normalized / 100) * circumference

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }} aria-label={`Progresso ${normalized}%`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} aria-hidden="true">
        <circle cx={size / 2} cy={size / 2} r={radius} fill="none" stroke="rgba(177,202,243,0.2)" strokeWidth={stroke} />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#61CEF7"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={reducedMotion ? { strokeDashoffset: offset } : { strokeDashoffset: circumference }}
          whileInView={{ strokeDashoffset: offset }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: reducedMotion ? 0.1 : 1.1, ease: 'easeOut' }}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <span className="absolute text-xs font-semibold text-cyan-300">{normalized}%</span>
    </div>
  )
}
