const contourPaths = Array.from({ length: 24 }, (_, index) => {
  const lift = index * 11.8;
  const pull = Math.sin(index * 0.43) * 15;
  return `M -90 ${1118 - lift * 0.3}
    C ${18 + pull} ${1055 - lift}, ${132 + index * 2.4} ${907 - lift * 0.3}, ${257 + index * 2.7} ${834 - lift * 0.12}
    C ${374 + index * 1.4} ${764 - lift * 0.07}, ${455 - index * 0.8} ${750 + lift * 0.55}, ${584 + index * 1.5} ${768 + lift * 0.62}
    C ${659 + index * 2.2} ${778 + lift * 0.63}, ${686 + index * 0.7} ${732 + lift * 0.74}, ${719 + index * 0.9} ${683 + lift * 0.77}`;
});

const upperStrands = Array.from({ length: 12 }, (_, index) => {
  const x = 1016 + index * 16.8;
  return `M ${x} -38 C ${x + 36} 75, ${1126 + index * 2.5} 127, ${1110 - index * 1.2} 227`;
});

const manifoldBands = Array.from({ length: 46 }, (_, index) => {
  const offset = (index - 22.5) * 1.62;
  return `M ${1015 + offset * 0.75} -36
    C ${1090 + offset * 0.3} 78, ${1124 - offset * 0.25} 154, ${1080 - offset * 1.05} 245
    C ${1010 - offset * 1.6} 318, ${955 - offset * 1.15} 356, ${1008 - offset * 0.6} 392
    C ${1060 + offset * 0.85} 430, ${1160 + offset * 1.15} 472, ${1130 + offset * 0.35} 518
    C ${1095 - offset * 0.35} 570, ${1040 - offset * 0.7} 646, ${1095 + offset * 0.15} 726`;
});

const sliceEllipses = [
  { cx: 1074, cy: 275, rx: 78, ry: 9, count: 10, rotation: -3 },
  { cx: 1122, cy: 478, rx: 48, ry: 8, count: 8, rotation: 1 },
  { cx: 1092, cy: 664, rx: 68, ry: 10, count: 10, rotation: 4 },
];

function pointOnSlice(sliceIndex: number, angle: number) {
  const { cx, cy, rx, ry, count, rotation } = sliceEllipses[sliceIndex];
  const outerRx = rx + (count - 1) * 10.2;
  const outerRy = ry + (count - 1) * 2.15;
  const radians = (rotation * Math.PI) / 180;
  const localX = Math.cos(angle) * outerRx;
  const localY = Math.sin(angle) * outerRy;
  return {
    x: cx + localX * Math.cos(radians) - localY * Math.sin(radians),
    y: cy + localX * Math.sin(radians) + localY * Math.cos(radians),
  };
}

const manifoldMeridians = Array.from({ length: 10 }, (_, index) => {
  const angle = (index / 10) * Math.PI * 2;
  const top = pointOnSlice(0, angle);
  const middle = pointOnSlice(1, angle + 0.32);
  const bottom = pointOnSlice(2, angle + 0.68);
  return `M ${top.x} ${top.y}
    C ${top.x + 34} ${top.y + 64}, ${middle.x - 28} ${middle.y - 68}, ${middle.x} ${middle.y}
    C ${middle.x + 24} ${middle.y + 66}, ${bottom.x - 30} ${bottom.y - 62}, ${bottom.x} ${bottom.y}`;
});

const networkNodes = [
  [1000, 180], [1080, 152], [1164, 186],
  [950, 274], [1068, 276], [1188, 280], [1260, 252],
  [980, 376], [1112, 360], [1232, 390],
  [1030, 478], [1122, 478], [1214, 484],
  [994, 580], [1096, 576], [1218, 586],
  [1050, 670], [1140, 650],
] as const;

const networkEdges = [
  [0, 1], [1, 2], [0, 4], [2, 5],
  [3, 4], [4, 5], [5, 6], [3, 7],
  [4, 8], [5, 8], [5, 9], [7, 8],
  [8, 9], [7, 10], [8, 11], [9, 12],
  [10, 11], [11, 12], [10, 13], [11, 14],
  [12, 15], [13, 14], [14, 15], [13, 16],
  [14, 16], [14, 17], [15, 17], [16, 17],
] as const;

const oliveNodeIndexes = new Set([0, 4, 6, 9, 11, 15, 16]);
const oxbloodNodeIndexes = new Set([2, 8, 14]);
const hollowNodeIndexes = new Set([3, 12, 17]);

function ArtworkBase({ className, children }: { className: string; children: React.ReactNode }) {
  return (
    <svg
      className={`cc-artwork ${className}`}
      viewBox="0 0 1448 1086"
      preserveAspectRatio="xMidYMid meet"
      aria-hidden="true"
      focusable="false"
    >
      {children}
    </svg>
  );
}

export function ArtworkBack() {
  return (
    <ArtworkBase className="cc-artwork-back">
      <g className="cc-contour-field" fill="none" stroke="var(--cc-hairline-deep)" strokeWidth="0.66" vectorEffect="non-scaling-stroke">
        {contourPaths.map((path, index) => (
          <path key={index} d={path} opacity={0.065 + (index % 5) * 0.013} />
        ))}
      </g>
      <g className="cc-upper-strands" fill="none" stroke="var(--cc-hairline-deep)" strokeWidth="0.64" vectorEffect="non-scaling-stroke">
        {upperStrands.map((path, index) => <path key={index} d={path} opacity={0.08 + index * 0.007} />)}
      </g>
    </ArtworkBase>
  );
}

export function ArtworkStructure() {
  return (
    <ArtworkBase className="cc-artwork-structure">
      <defs>
        <linearGradient id="cc-manifold-veil" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="var(--cc-white)" stopOpacity="0" />
          <stop offset="0.42" stopColor="var(--cc-hairline-deep)" stopOpacity="0.34" />
          <stop offset="0.7" stopColor="var(--cc-hairline)" stopOpacity="0.1" />
          <stop offset="1" stopColor="var(--cc-white)" stopOpacity="0" />
        </linearGradient>
        <radialGradient id="cc-manifold-halo">
          <stop offset="0" stopColor="var(--cc-hairline-deep)" stopOpacity="0.1" />
          <stop offset="1" stopColor="var(--cc-paper)" stopOpacity="0" />
        </radialGradient>
      </defs>
      <g className="cc-manifold" fill="none" vectorEffect="non-scaling-stroke">
        <g className="cc-manifold-composition" transform="translate(70 -60) scale(0.98)">
        <ellipse cx="1094" cy="445" rx="272" ry="318" fill="url(#cc-manifold-halo)" stroke="none" />
        <path
          d="M 1024 104 C 1068 206, 982 302, 944 390 C 902 488, 971 584, 1060 646 C 988 606, 912 540, 918 438 C 923 330, 1014 234, 1024 104 Z"
          fill="url(#cc-manifold-veil)"
          stroke="none"
          opacity="0.42"
        />
        <g className="cc-manifold-axis" stroke="var(--cc-hairline-deep)" opacity="0.5">
          <line x1="1120" y1="120" x2="1095" y2="748" strokeWidth="0.52" />
          {[275, 478, 664].map((y, index) => (
            <g key={y}>
              <line x1={index === 1 ? 1108 : 1081} y1={y} x2={index === 1 ? 1136 : 1107} y2={y} strokeWidth="0.6" />
              <circle cx={index === 1 ? 1122 : index === 0 ? 1074 : 1092} cy={y} r="1.6" fill="var(--cc-hairline-deep)" stroke="none" />
            </g>
          ))}
        </g>
        {manifoldBands.map((path, index) => (
          <path key={index} d={path} stroke="var(--cc-hairline-deep)" strokeWidth="0.68" opacity={0.19 + (index % 8) * 0.014} />
        ))}
        {manifoldMeridians.map((path, index) => (
          <path key={`meridian-${index}`} d={path} stroke="var(--cc-hairline-deep)" strokeWidth="0.64" opacity={0.2 + (index % 5) * 0.02} />
        ))}
        {sliceEllipses.flatMap(({ cx, cy, rx, ry, count, rotation }, groupIndex) =>
          Array.from({ length: count }, (_, index) => (
            <ellipse
              key={`${groupIndex}-${index}`}
              cx={cx}
              cy={cy}
              rx={rx + index * 10.2}
              ry={ry + index * 2.15}
              transform={`rotate(${rotation} ${cx} ${cy})`}
              stroke="var(--cc-hairline)"
              strokeWidth="0.7"
              opacity={0.43 - index * 0.012}
            />
          )),
        )}
        {sliceEllipses.flatMap(({ cx, cy, rx, ry, count, rotation }, groupIndex) => {
          const outerRx = rx + (count - 1) * 10.2;
          const outerRy = ry + (count - 1) * 2.15;
          const radians = (rotation * Math.PI) / 180;
          return Array.from({ length: 8 }, (_, index) => {
            const angle = (index / 8) * Math.PI * 2;
            const localX = Math.cos(angle) * outerRx;
            const localY = Math.sin(angle) * outerRy;
            const x = cx + localX * Math.cos(radians) - localY * Math.sin(radians);
            const y = cy + localX * Math.sin(radians) + localY * Math.cos(radians);
            return <line key={`spoke-${groupIndex}-${index}`} x1={cx} y1={cy} x2={x} y2={y} stroke="var(--cc-hairline)" strokeWidth="0.62" opacity="0.22" />;
          });
        })}
        <path d="M 1032 40 C 1096 158, 1064 224, 1008 316 C 957 399, 1006 468, 1108 526 C 1167 560, 1154 636, 1094 724" stroke="var(--cc-hairline-deep)" strokeWidth="0.9" opacity="0.44" />
        <path d="M 873 277 C 947 208, 1198 201, 1310 277" stroke="var(--cc-olive)" strokeWidth="0.58" opacity="0.34" />
        <path d="M 904 663 C 1000 716, 1190 719, 1292 654" stroke="var(--cc-hairline-deep)" strokeWidth="0.5" opacity="0.22" />
        {networkEdges.map(([startIndex, endIndex], index) => {
          const start = networkNodes[startIndex];
          const end = networkNodes[endIndex];
          return (
            <line
              key={`edge-${startIndex}-${endIndex}`}
              x1={start[0]}
              y1={start[1]}
              x2={end[0]}
              y2={end[1]}
              stroke="var(--cc-hairline-deep)"
              strokeWidth="0.78"
              opacity={0.23 + (index % 3) * 0.025}
            />
          );
        })}
        {networkNodes.map(([x, y], index) => {
          const isOxblood = oxbloodNodeIndexes.has(index);
          const isHollow = hollowNodeIndexes.has(index);
          const fill = isHollow ? "var(--cc-white)" : isOxblood ? "var(--cc-oxblood)" : oliveNodeIndexes.has(index) ? "var(--cc-olive)" : "var(--cc-ink-soft)";
          const radius = isOxblood ? 4.4 : isHollow ? 3.2 : oliveNodeIndexes.has(index) ? 2.8 : 1.8;
          return (
            <g key={`node-${index}`}>
              <circle cx={x} cy={y} r={radius} fill={fill} stroke={isHollow ? "var(--cc-hairline-deep)" : "none"} strokeWidth={isHollow ? 1.2 : 0} />
            </g>
          );
        })}
        </g>
      </g>

    </ArtworkBase>
  );
}
