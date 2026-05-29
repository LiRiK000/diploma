export const Logo = () => {
  return (
    <div
      style={{
        width: 'clamp(56px, 5vw, 72px)',
        height: 'clamp(56px, 8vw, 92px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        position: 'relative',
        zIndex: 10,
      }}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 800 800"
        width="100%"
        height="100%"
        fill="none"
        style={{
          filter: 'drop-shadow(0px 8px 16px rgba(124, 58, 237, 0.15))',
        }}
      >
        <defs>
          <linearGradient
            id="apple-gradient"
            x1="0%"
            y1="100%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#7c3aed" />
            <stop offset="50%" stopColor="#8b5cf6" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>

          <linearGradient
            id="glass-gradient"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="100%"
          >
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.15)" />
          </linearGradient>

          <filter id="blur-shadow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="18" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <circle
          cx="400"
          cy="400"
          r="220"
          fill="url(#apple-gradient)"
          opacity="0.12"
          filter="url(#blur-shadow)"
        />

        <rect
          x="120"
          y="120"
          width="560"
          height="560"
          rx="180"
          fill="rgba(255,255,255,0.08)"
          stroke="rgba(255,255,255,0.18)"
          strokeWidth="8"
          backdropFilter="blur(20px)"
        />

        <path
          d="
            M400 530
            C340 500 250 470 200 500
            C170 518 170 300 200 280
            C250 245 340 270 400 295
            Z
          "
          fill="url(#apple-gradient)"
        />

        <path
          d="
            M400 530
            C460 500 550 470 600 500
            C630 518 630 300 600 280
            C550 245 460 270 400 295
            Z
          "
          fill="url(#apple-gradient)"
          opacity="0.92"
        />

        <path
          d="
            M400 250
            C420 340 418 440 405 540
            C398 544 392 544 395 540
            C382 440 380 340 400 250
          "
          fill="white"
          opacity="0.9"
        />

        <ellipse
          cx="400"
          cy="250"
          rx="90"
          ry="28"
          fill="white"
          opacity="0.18"
        />

        <path
          d="
            M400 165
            Q400 190 425 190
            Q400 190 400 215
            Q400 190 375 190
            Q400 190 400 165
          "
          fill="#c084fc"
        />
      </svg>
    </div>
  )
}
