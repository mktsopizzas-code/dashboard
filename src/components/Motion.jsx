import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export function FadeIn({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function ScaleIn({ children, delay = 0, className = '' }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function Stagger({ children, className = '' }) {
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={{
        visible: { transition: { staggerChildren: 0.06 } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function StaggerItem({ children, className = '' }) {
  return (
    <motion.div
      variants={{
        hidden:  { opacity: 0, y: 16 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

export function AnimatedNumber({ value, prefix = '', suffix = '', duration = 1.2 }) {
  const [display, setDisplay] = useState(0)

  useEffect(() => {
    const start = 0
    const end = parseFloat(value) || 0
    const startTime = Date.now()

    function tick() {
      const elapsed  = Date.now() - startTime
      const progress = Math.min(elapsed / (duration * 1000), 1)
      const eased    = 1 - Math.pow(1 - progress, 3)
      setDisplay(start + (end - start) * eased)
      if (progress < 1) requestAnimationFrame(tick)
    }
    tick()
  }, [value, duration])

  const formatted = Number(display).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })

  return <span>{prefix}{formatted}{suffix}</span>
}

export function AnimatedBar({ width, color, delay = 0, className = '' }) {
  const style = { borderRadius: 3 }
  if (color) style.background = color
  if (!className) style.height = '100%'
  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: width + '%' }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className={className}
      style={style}
    />
  )
}

export function AnimatedBarV({ height, color, delay = 0, className = '' }) {
  const style = { background: color }
  if (!className) {
    style.width = '100%'
    style.borderRadius = 3
  }
  return (
    <motion.div
      initial={{ height: 0 }}
      animate={{ height: height + '%' }}
      transition={{ duration: 0.8, delay, ease: 'easeOut' }}
      className={className}
      style={style}
    />
  )
}

export function PageTransition({ children, pageKey }) {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pageKey}
        initial={{ opacity: 0, x: 12 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -12 }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        style={{ flex: 1 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  )
}

export function HoverCard({ children, className = '', onClick }) {
  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 8px 30px rgba(0,0,0,0.3)' }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.2 }}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
