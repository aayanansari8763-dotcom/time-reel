interface LogoProps {
  size?: "sm" | "md" | "lg" | "icon-only";
  className?: string;
}

const sizeMap = {
  sm: { symbol: 28, total: 110, textSize: 13, gap: 6, wordmarkY: 19 },
  md: { symbol: 36, total: 142, textSize: 16, gap: 8, wordmarkY: 24 },
  lg: { symbol: 56, total: 220, textSize: 24, gap: 12, wordmarkY: 37 },
  "icon-only": { symbol: 36, total: 36, textSize: 0, gap: 0, wordmarkY: 0 },
};

export function Logo({ size = "md", className }: LogoProps) {
  const cfg = sizeMap[size];
  const s = cfg.symbol;
  const r = s / 2; // center of symbol
  const outerR = r * 0.92;
  const innerRingR = r * 0.62;
  const filmSegR = r * 0.52;
  const holeR = r * 0.18;
  const centerR = r * 0.28;
  const isIconOnly = size === "icon-only";

  // Generate 12 clock tick marks on outer ring (deg used as stable key)
  const ticks = Array.from({ length: 12 }, (_, i) => {
    const deg = i * 30;
    const angle = (deg - 90) * (Math.PI / 180);
    const isMajor = i % 3 === 0;
    const outerLen = outerR;
    const innerLen = isMajor ? outerR * 0.82 : outerR * 0.88;
    return {
      deg,
      x1: r + Math.cos(angle) * innerLen,
      y1: r + Math.sin(angle) * innerLen,
      x2: r + Math.cos(angle) * outerLen,
      y2: r + Math.sin(angle) * outerLen,
      isMajor,
    };
  });

  // Generate 8 film reel segments (arc slices between two circles)
  const filmSegments = Array.from({ length: 8 }, (_, i) => {
    const startAngle = (i * 45 - 90) * (Math.PI / 180);
    const endAngle = (i * 45 + 34 - 90) * (Math.PI / 180);
    const outerFR = filmSegR;
    const innerFR = innerRingR * 0.62;
    const x1 = r + Math.cos(startAngle) * outerFR;
    const y1 = r + Math.sin(startAngle) * outerFR;
    const x2 = r + Math.cos(endAngle) * outerFR;
    const y2 = r + Math.sin(endAngle) * outerFR;
    const ix1 = r + Math.cos(startAngle) * innerFR;
    const iy1 = r + Math.sin(startAngle) * innerFR;
    const ix2 = r + Math.cos(endAngle) * innerFR;
    const iy2 = r + Math.sin(endAngle) * innerFR;
    return {
      deg: i * 45,
      isEven: i % 2 === 0,
      d: `M ${x1} ${y1} A ${outerFR} ${outerFR} 0 0 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerFR} ${innerFR} 0 0 0 ${ix1} ${iy1} Z`,
    };
  });

  // Play triangle in center (pointing right)
  const triSize = centerR * 0.72;
  const triX = r + triSize * 0.15; // slight right offset for optical centering
  const triangle = `M ${triX - triSize * 0.6} ${r - triSize} L ${triX + triSize} ${r} L ${triX - triSize * 0.6} ${r + triSize} Z`;

  const totalW = isIconOnly ? s : cfg.total;
  const totalH = s;

  return (
    <svg
      width={totalW}
      height={totalH}
      viewBox={`0 0 ${totalW} ${totalH}`}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Time Reel"
      role="img"
    >
      <defs>
        {/* Purple → Cyan gradient */}
        <linearGradient id="tr-grad-main" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#7C3AED" />
          <stop offset="55%" stopColor="#9333EA" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        {/* Cyan → Purple (reversed) for segments */}
        <linearGradient id="tr-grad-rev" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#06B6D4" />
          <stop offset="100%" stopColor="#7C3AED" />
        </linearGradient>

        {/* Wordmark gradient */}
        <linearGradient id="tr-grad-text" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#06B6D4" />
        </linearGradient>

        {/* Glow filter */}
        <filter id="tr-glow" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="0.4 0 0.8 0 0.3  0 0 0.8 0 0.1  0.8 0.8 0 0 0.8  0 0 0 1 0"
            result="coloredBlur"
          />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Subtle inner glow on outer ring */}
        <filter id="tr-ring-glow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Clip the symbol to its bounding box */}
        <clipPath id="tr-symbol-clip">
          <rect width={s} height={s} />
        </clipPath>
      </defs>

      {/* ── SYMBOL GROUP ── */}
      <g clipPath="url(#tr-symbol-clip)" filter="url(#tr-glow)">
        {/* Outer ring track */}
        <circle
          cx={r}
          cy={r}
          r={outerR * 0.96}
          stroke="url(#tr-grad-main)"
          strokeWidth={s * 0.048}
          fill="none"
          opacity={0.9}
          filter="url(#tr-ring-glow)"
        />

        {/* 12 tick marks */}
        {ticks.map((t) => (
          <line
            key={t.deg}
            x1={t.x1}
            y1={t.y1}
            x2={t.x2}
            y2={t.y2}
            stroke="url(#tr-grad-main)"
            strokeWidth={t.isMajor ? s * 0.048 : s * 0.028}
            strokeLinecap="round"
            opacity={t.isMajor ? 1 : 0.6}
          />
        ))}

        {/* Inner circle ring separator */}
        <circle
          cx={r}
          cy={r}
          r={innerRingR}
          stroke="url(#tr-grad-rev)"
          strokeWidth={s * 0.025}
          fill="none"
          opacity={0.5}
        />

        {/* Film reel segment holes */}
        {filmSegments.map((seg) => (
          <path
            key={seg.deg}
            d={seg.d}
            fill="url(#tr-grad-main)"
            opacity={seg.isEven ? 0.85 : 0.55}
          />
        ))}

        {/* Center dark disc */}
        <circle
          cx={r}
          cy={r}
          r={centerR * 1.35}
          fill="oklch(0.08 0 0)"
          stroke="url(#tr-grad-main)"
          strokeWidth={s * 0.028}
          opacity={1}
        />

        {/* Center sprocket hole ring */}
        <circle
          cx={r}
          cy={r}
          r={holeR}
          fill="none"
          stroke="url(#tr-grad-rev)"
          strokeWidth={s * 0.022}
          opacity={0.7}
        />

        {/* Play triangle */}
        <path d={triangle} fill="url(#tr-grad-main)" opacity={1} />
      </g>

      {/* ── WORDMARK (hidden in icon-only) ── */}
      {!isIconOnly && (
        <g transform={`translate(${s + cfg.gap}, 0)`}>
          {/* "Time" — white */}
          <text
            x={0}
            y={cfg.wordmarkY}
            fontSize={cfg.textSize}
            fontWeight="700"
            fontFamily="'Space Grotesk', 'Inter', system-ui, sans-serif"
            letterSpacing="-0.02em"
            fill="oklch(0.96 0 0)"
          >
            Time
          </text>
          {/* "Reel" — gradient */}
          <text
            x={size === "sm" ? 33 : size === "lg" ? 57 : 42}
            y={cfg.wordmarkY}
            fontSize={cfg.textSize}
            fontWeight="800"
            fontFamily="'Space Grotesk', 'Inter', system-ui, sans-serif"
            letterSpacing="-0.02em"
            fill="url(#tr-grad-text)"
          >
            Reel
          </text>
        </g>
      )}
    </svg>
  );
}
