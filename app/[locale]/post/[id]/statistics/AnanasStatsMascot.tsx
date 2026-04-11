'use client'

import { motion } from 'motion/react'
import styles from './postStatistics.module.css'

export default function AnanasStatsMascot({ className }: { className?: string }) {
  return (
    <div className={`${styles.mascotWrap} ${className ?? ''}`} aria-hidden>
      <motion.svg
        className={styles.mascotSvg}
        viewBox="0 0 160 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 22 }}
      >
        <defs>
          <linearGradient id="ananasBody" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffe066" />
            <stop offset="45%" stopColor="#fecb01" />
            <stop offset="100%" stopColor="#e6a800" />
          </linearGradient>
          <linearGradient id="ananasLeaf" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0d3d2e" />
            <stop offset="100%" stopColor="#1a6b4a" />
          </linearGradient>
        </defs>

        <motion.g
          style={{ transformOrigin: '80px 52px' }}
          animate={{ rotate: [0, 2, -2, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path
            d="M52 48c12-22 32-34 56-34s44 12 56 34c-18 8-36 10-56 10s-38-2-56-10z"
            fill="url(#ananasLeaf)"
            opacity={0.95}
          />
          <motion.path
            d="M68 42c8-18 24-28 44-28s36 10 44 28"
            stroke="#fecb01"
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
            animate={{ pathLength: [0.85, 1, 0.85] }}
            transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.g>

        <motion.g
          animate={{ y: [0, -3, 0] }}
          transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ellipse cx={80} cy={118} rx={46} ry={58} fill="url(#ananasBody)" stroke="#151515" strokeWidth={2.2} />
          {[0, 1, 2, 3, 4].map((i) => (
            <motion.path
              key={i}
              d={`M${38 + i * 10} ${88 + i * 8} Q 80 ${100 + i * 6} ${122 - i * 10} ${88 + i * 8}`}
              stroke="#151515"
              strokeWidth={1.2}
              strokeOpacity={0.22}
              fill="none"
              initial={{ pathLength: 0.4 }}
              animate={{ pathLength: [0.35, 0.95, 0.35] }}
              transition={{
                duration: 2.4 + i * 0.15,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: i * 0.12,
              }}
            />
          ))}
        </motion.g>

        <motion.circle
          cx={80}
          cy={118}
          r={52}
          stroke="#fecb01"
          strokeWidth={2}
          strokeDasharray="8 14"
          fill="none"
          opacity={0.55}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '80px 118px' }}
        />
        <motion.circle
          cx={80}
          cy={118}
          r={62}
          stroke="#151515"
          strokeWidth={1.2}
          strokeDasharray="4 10"
          fill="none"
          opacity={0.2}
          animate={{ rotate: [360, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
          style={{ transformOrigin: '80px 118px' }}
        />
      </motion.svg>
    </div>
  )
}
