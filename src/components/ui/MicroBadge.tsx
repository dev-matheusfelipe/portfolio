import { motion } from 'framer-motion'

type MicroBadgeProps = {
  label: string
  hint: string
  reducedMotion: boolean
}

export default function MicroBadge({ label, hint, reducedMotion }: MicroBadgeProps) {
  return (
    <motion.span
      className="group relative inline-flex cursor-help items-center rounded-full border border-sky-300/25 px-2.5 py-1 text-xs text-sky-100/90 hover:z-20 focus-visible:z-20"
      whileHover={reducedMotion ? undefined : { y: -1 }}
      transition={{ duration: 0.2 }}
      tabIndex={0}
      aria-label={`${label}: ${hint}`}
    >
      {label}
      <span className="pointer-events-none absolute left-1/2 top-full z-30 mt-2 hidden w-max max-w-[14rem] -translate-x-1/2 whitespace-normal break-words rounded-md border border-sky-300/35 bg-slate-900/95 px-2 py-1 text-center text-[11px] leading-snug text-slate-100 shadow-glow group-hover:block group-focus-visible:block">
        {hint}
      </span>
    </motion.span>
  )
}
