import type { ReactNode, SVGProps } from 'react'

/*
 * Custom Playful Duotone Cebu Heritage & Tropical Adventure icon set.
 * Built on a uniform 512x512 grid with rounded 32px strokes and soft duotone fills
 * so every icon pairs naturally with the tropical lagoon & sunlit coral palette.
 */
type IconProps = Omit<SVGProps<SVGSVGElement>, 'children'> & { size?: number }

function icon(paths: ReactNode) {
  return function CustomIcon({ size = 24, ...props }: IconProps) {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width={size} height={size} aria-hidden {...props}>
        {paths}
      </svg>
    )
  }
}

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  strokeWidth: 32,
} as const

const duotone = {
  fill: 'currentColor',
  fillOpacity: 0.22,
} as const

const duotoneStrong = {
  fill: 'currentColor',
  fillOpacity: 0.36,
} as const

/* =========================================================================
   BOTTOM NAVIGATION & CORE DISCOVERY ICONS
   ========================================================================= */

/** Active Explore: custom 3-panel folded island map with trail line & destination pin. */
export const MapIcon = icon(
  <>
    <path
      {...duotone}
      d="M52 126l124-66a20 20 0 0118 0l124 64a20 20 0 0018 0l124-64a16 16 0 0124 14v294a24 24 0 01-13 21l-125 65a20 20 0 01-18 0l-124-64a20 20 0 00-18 0L62 454a16 16 0 01-24-14V146a24 24 0 0114-20z"
    />
    <path fill="currentColor" d="M188 64l136 70v314l-136-70z" fillOpacity={0.28} />
    <path
      {...stroke}
      d="M52 126l124-66a20 20 0 0118 0l124 64a20 20 0 0018 0l124-64a16 16 0 0124 14v294a24 24 0 01-13 21l-125 65a20 20 0 01-18 0l-124-64a20 20 0 00-18 0L62 454a16 16 0 01-24-14V146a24 24 0 0114-20zM184 64v324M328 124v324"
    />
    <path {...stroke} strokeDasharray="1 54" d="M112 296c40-44 102-36 144-4s88 24 142-22" />
    <circle cx="384" cy="212" r="24" fill="currentColor" />
  </>,
)

/** Resting Explore: 3-panel folded map with duotone center island fold & adventure path. */
export const MapOutlineIcon = icon(
  <>
    <path {...duotone} d="M184 64l144 60v324l-144-60z" />
    <path
      {...stroke}
      d="M313.27 124.64L198.73 51.36a32 32 0 00-29.28.35L56.51 127.49A16 16 0 0048 141.63v295.8a16 16 0 0023.49 14.14l97.82-63.79a32 32 0 0129.5-.24l111.86 73a32 32 0 0029.27-.11l115.43-75.94a16 16 0 008.63-14.2V74.57a16 16 0 00-23.49-14.14l-98 63.86a32 32 0 01-29.24.35zM328 128v336M184 48v336"
    />
    <circle cx="396" cy="204" r="20" fill="currentColor" />
  </>,
)

/** Active Archives: open field journal with duotone spread, bookmark ribbon, and heritage cross emblem. */
export const BookIcon = icon(
  <>
    <path
      {...duotone}
      d="M256 148c-36-46-102-76-192-76a24 24 0 00-24 24v272a24 24 0 0024 24c94 0 156 26 192 64 36-38 98-64 192-64a24 24 0 0024-24V96a24 24 0 00-24-24c-90 0-156 30-192 76z"
    />
    <path fill="currentColor" d="M296 78l44-24v112l-22-18-22 18z" />
    <path
      {...stroke}
      d="M256 148c-36-46-102-76-192-76a24 24 0 00-24 24v272a24 24 0 0024 24c94 0 156 26 192 64 36-38 98-64 192-64a24 24 0 0024-24V96a24 24 0 00-24-24c-90 0-156 30-192 76zM256 148v308"
    />
    <path {...stroke} d="M112 184h76M112 252h76M364 220v72M328 256h72" />
  </>,
)

/** Resting Archives: open heritage journal with duotone right page & bookmark ribbon. */
export const BookOutlineIcon = icon(
  <>
    <path {...duotone} d="M256 156c24-52 84-88 200-88a16 16 0 0116 16v284a16 16 0 01-16 16c-116 0-168 24-200 60z" />
    <path
      {...stroke}
      d="M256 160c16-63.16 76.43-95.41 208-96a15.94 15.94 0 0116 16v288a16 16 0 01-16 16c-128 0-177.45 25.81-208 64-30.37-38-80-64-208-64-9.88 0-16-8.05-16-17.93V80a15.94 15.94 0 0116-16c131.57.59 192 32.84 208 96zM256 160v288"
    />
    <path {...stroke} d="M324 68v88l30-20 30 20V68" />
  </>,
)

/** AI Lens Camera: playful duotone rounded camera with viewfinder prism, flash dot & dual-ring shutter. */
export const CameraOutlineIcon = icon(
  <>
    <path
      {...duotone}
      d="M350.54 148.68l-26.62-42.06C318.31 100.08 310.62 96 302 96h-92c-8.62 0-16.31 4.08-21.92 10.62l-26.62 42.06C155.85 155.23 148.62 160 140 160H80a32 32 0 00-32 32v192a32 32 0 0032 32h352a32 32 0 0032-32V192a32 32 0 00-32-32h-59c-8.65 0-16.85-4.77-22.46-11.32z"
    />
    <circle cx="256" cy="272" r="44" {...duotoneStrong} />
    <path
      {...stroke}
      d="M350.54 148.68l-26.62-42.06C318.31 100.08 310.62 96 302 96h-92c-8.62 0-16.31 4.08-21.92 10.62l-26.62 42.06C155.85 155.23 148.62 160 140 160H80a32 32 0 00-32 32v192a32 32 0 0032 32h352a32 32 0 0032-32V192a32 32 0 00-32-32h-59c-8.65 0-16.85-4.77-22.46-11.32z"
    />
    <circle cx="256" cy="272" r="84" {...stroke} />
    <circle cx="388" cy="212" r="14" fill="currentColor" />
    <path {...stroke} d="M124 158v-22h-24v22" />
  </>,
)

/** Active Mastery Trophy: duotone champion cup with 4-point star emblem & two-tier pedestal. */
export const TrophyIcon = icon(
  <>
    <path
      {...duotone}
      d="M128 64a16 16 0 0116-16h224a16 16 0 0116 16v144c0 72-56 128-128 128s-128-56-128-128V64z"
    />
    <path
      {...stroke}
      d="M128 64a16 16 0 0116-16h224a16 16 0 0116 16v144c0 72-56 128-128 128s-128-56-128-128V64zM128 96H56v24c0 52 30 96 72 104M384 96h72v24c0 52-30 96-72 104M256 336v112M168 448h176M140 480h232"
    />
    <path
      fill="currentColor"
      d="M256 112l16 42 42 16-42 16-16 42-16-42-42-16 42-16z"
    />
  </>,
)

/** Resting Mastery Trophy: clean heritage cup outline with soft duotone bowl & handles. */
export const TrophyOutlineIcon = icon(
  <>
    <path {...duotone} d="M144 64h224v144c0 56-48 104-112 104s-112-48-112-104V64z" />
    <path
      {...stroke}
      d="M176 464h160M256 464V336M384 224c0-50.64-.08-134.63-.12-160a16 16 0 00-16-16l-223.79.26a16 16 0 00-16 15.95c0 30.58-.13 129.17-.13 159.79 0 64.28 83 112 128 112S384 288.28 384 224z"
    />
    <path {...stroke} d="M128 96H48v16c0 55.22 33.55 112 80 112M384 96h80v16c0 55.22-33.55 112-80 112" />
  </>,
)

/** Active Profile: explorer avatar with duotone badge silhouette & compass pin detail. */
export const PersonIcon = icon(
  <>
    <circle cx="256" cy="148" r="88" {...duotoneStrong} />
    <path
      {...duotone}
      d="M256 300c-88 0-172 46-188 136-2 14 8 28 22 28h332c14 0 24-14 22-28-16-90-100-136-188-136z"
    />
    <circle cx="256" cy="148" r="88" {...stroke} />
    <path
      {...stroke}
      d="M256 300c-88 0-172 46-188 136-2 14 8 28 22 28h332c14 0 24-14 22-28-16-90-100-136-188-136z"
    />
    <circle cx="348" cy="396" r="24" fill="currentColor" />
  </>,
)

/** Resting Profile: explorer silhouette with duotone head tint. */
export const PersonOutlineIcon = icon(
  <>
    <circle cx="256" cy="144" r="88" {...duotone} />
    <path {...stroke} d="M344 144c-3.92 52.87-44 96-88 96s-84.15-43.12-88-96c-4-55 35-96 88-96s92 42 88 96z" />
    <path
      {...stroke}
      d="M256 304c-87 0-175.3 48-191.64 138.6C62.39 453.52 68.57 464 80 464h352c11.44 0 17.62-10.48 15.65-21.4C431.3 352 343 304 256 304z"
    />
  </>,
)

/* =========================================================================
   SCANNER, LOCATION & DISCOVERY ICONS
   ========================================================================= */

/** Heritage Scanner Reticle: framing corners + central duotone target diamond & sparkle. */
export const ScanOutlineIcon = icon(
  <>
    <path {...duotone} d="M256 164l68 92-68 92-68-92z" />
    <path
      {...stroke}
      d="M336 448h56a56 56 0 0056-56v-56M448 176v-56a56 56 0 00-56-56h-56M176 448h-56a56 56 0 01-56-56v-56M64 176v-56a56 56 0 0156-56h56"
    />
    <path {...stroke} d="M256 176l58 80-58 80-58-80z" />
    <circle cx="256" cy="256" r="18" fill="currentColor" />
  </>,
)

/** Flip Camera: duotone camera silhouette with circular flip arrows inside the lens. */
export const CameraReverseOutlineIcon = icon(
  <>
    <path
      {...duotone}
      d="M350.54 148.68l-26.62-42.06C318.31 100.08 310.62 96 302 96h-92c-8.62 0-16.31 4.08-21.92 10.62l-26.62 42.06C155.85 155.23 148.62 160 140 160H80a32 32 0 00-32 32v192a32 32 0 0032 32h352a32 32 0 0032-32V192a32 32 0 00-32-32h-59c-8.65 0-16.85-4.77-22.46-11.32z"
    />
    <path
      {...stroke}
      d="M350.54 148.68l-26.62-42.06C318.31 100.08 310.62 96 302 96h-92c-8.62 0-16.31 4.08-21.92 10.62l-26.62 42.06C155.85 155.23 148.62 160 140 160H80a32 32 0 00-32 32v192a32 32 0 0032 32h352a32 32 0 0032-32V192a32 32 0 00-32-32h-59c-8.65 0-16.85-4.77-22.46-11.32z"
    />
    <path {...stroke} d="M124 158v-22h-24v22M335.76 285.22v-13.31a80 80 0 00-131-61.6M176 258.78v13.31a80 80 0 00130.73 61.8" />
    <path {...stroke} d="M196 272l-20-20-20 20M356 272l-20 20-20-20" />
  </>,
)

/** Explorer Compass Rose: duotone dial, N/E/S/W ticks & two-tone needle. */
export const CompassOutlineIcon = icon(
  <>
    <circle cx="256" cy="256" r="192" {...duotone} />
    <circle cx="256" cy="256" r="192" {...stroke} />
    <path
      fill="currentColor"
      d="M350.67 150.93l-117.2 46.88a64 64 0 00-35.66 35.66l-46.88 117.2a8 8 0 0010.4 10.4l117.2-46.88a64 64 0 0035.66-35.66l46.88-117.2a8 8 0 00-10.4-10.4zM256 280a24 24 0 1124-24 24 24 0 01-24 24z"
    />
    <path {...stroke} d="M256 64v32M256 416v32M64 256h32M416 256h32" />
  </>,
)

/** Filled Location Pin: teardrop heritage pin with duotone ground ripple. */
export const LocationIcon = icon(
  <>
    <ellipse cx="256" cy="456" rx="112" ry="24" {...duotoneStrong} />
    <path
      {...duotone}
      d="M256 48c-79.5 0-144 61.39-144 137 0 87 96 224.87 131.25 272.49a15.77 15.77 0 0025.5 0C304 409.89 400 272.07 400 185c0-75.61-64.5-137-144-137z"
    />
    <path
      {...stroke}
      d="M256 48c-79.5 0-144 61.39-144 137 0 87 96 224.87 131.25 272.49a15.77 15.77 0 0025.5 0C304 409.89 400 272.07 400 185c0-75.61-64.5-137-144-137z"
    />
    <circle cx="256" cy="192" r="44" fill="currentColor" />
  </>,
)

/** Outline Location Pin: duotone pin body with crisp center ring. */
export const LocationOutlineIcon = icon(
  <>
    <path
      {...duotone}
      d="M256 48c-79.5 0-144 61.39-144 137 0 87 96 224.87 131.25 272.49a15.77 15.77 0 0025.5 0C304 409.89 400 272.07 400 185c0-75.61-64.5-137-144-137z"
    />
    <path
      {...stroke}
      d="M256 48c-79.5 0-144 61.39-144 137 0 87 96 224.87 131.25 272.49a15.77 15.77 0 0025.5 0C304 409.89 400 272.07 400 185c0-75.61-64.5-137-144-137z"
    />
    <circle cx="256" cy="192" r="48" {...stroke} />
  </>,
)

/** GPS Recenter Crosshair: duotone inner disc & bullseye center dot. */
export const LocateOutlineIcon = icon(
  <>
    <circle cx="256" cy="256" r="128" {...duotone} />
    <circle cx="256" cy="256" r="40" fill="currentColor" />
    <path {...stroke} strokeWidth={40} d="M256 108V56M256 456v-52M404 256h52M56 256h52" />
    <circle cx="256" cy="256" r="144" {...stroke} />
  </>,
)

/** Discovery Magnifier: duotone tinted glass lens with curved highlight reflection. */
export const SearchIcon = icon(
  <>
    <circle cx="220" cy="220" r="136" {...duotone} />
    <circle cx="220" cy="220" r="136" {...stroke} />
    <path {...stroke} d="M156 176a76 76 0 0164-36" />
    <path {...stroke} strokeWidth={44} d="M322 322l128 128" />
  </>,
)

/** Filter Sliders: three tracks with duotone-filled circular knobs. */
export const OptionsOutlineIcon = icon(
  <>
    <circle cx="336" cy="128" r="36" {...duotoneStrong} />
    <circle cx="176" cy="256" r="36" {...duotoneStrong} />
    <circle cx="336" cy="384" r="36" {...duotoneStrong} />
    <path {...stroke} d="M372 128h76M64 128h236M372 384h76M64 384h236M212 256h236M64 256h76" />
    <circle {...stroke} cx="336" cy="128" r="36" />
    <circle {...stroke} cx="176" cy="256" r="36" />
    <circle {...stroke} cx="336" cy="384" r="36" />
  </>,
)

/** Saved Bookmark: duotone-filled heritage ribbon with top star sparkle. */
export const BookmarkIcon = icon(
  <>
    <path
      {...duotoneStrong}
      d="M352 48H160a48 48 0 00-48 48v368l144-120 144 120V96a48 48 0 00-48-48z"
    />
    <path
      {...stroke}
      d="M352 48H160a48 48 0 00-48 48v368l144-120 144 120V96a48 48 0 00-48-48z"
    />
    <path fill="currentColor" d="M256 132l14 36 36 14-36 14-14 36-14-36-36-14 36-14z" />
  </>,
)

/** Resting Bookmark: clean ribbon outline with soft duotone top banner. */
export const BookmarkOutlineIcon = icon(
  <>
    <path {...duotone} d="M352 48H160a48 48 0 00-48 48v368l144-128 144 128V96a48 48 0 00-48-48z" />
    <path {...stroke} d="M352 48H160a48 48 0 00-48 48v368l144-128 144 128V96a48 48 0 00-48-48z" />
  </>,
)

/* =========================================================================
   MASTERY, STREAKS & GAMIFICATION ICONS
   ========================================================================= */

/** Active Streak Flame: bold duotone flame silhouette with glowing inner flame tongue. */
export const FlameIcon = icon(
  <>
    <path
      {...duotoneStrong}
      d="M256 464c96 0 160-68 160-156 0-72-44-136-92-184-26-26-54-56-68-84-22 36-50 68-82 102-46 48-78 100-78 166 0 88 64 156 160 156z"
    />
    <path
      {...stroke}
      d="M256 464c96 0 160-68 160-156 0-72-44-136-92-184-26-26-54-56-68-84-22 36-50 68-82 102-46 48-78 100-78 166 0 88 64 156 160 156z"
    />
    <path
      fill="currentColor"
      d="M256 416c36 0 60-26 60-60 0-30-20-58-48-84-10 22-28 38-46 56-16 16-26 32-26 52 0 22 24 36 60 36z"
    />
  </>,
)

/** Resting Streak Flame: duotone flame outline. */
export const FlameOutlineIcon = icon(
  <>
    <path
      {...duotone}
      d="M112 320c0-93 72-132 72-208 0-33.8-14-64-16-64 57 24 88 77 88 120 0 28-9 52-24 72 26 0 56-18 64-56 22 28 40 68 40 108 0 79.52-64.48 144-144 144S112 399.52 112 320z"
    />
    <path
      {...stroke}
      d="M112 320c0-93 72-132 72-208 0-33.8-14-64-16-64 57 24 88 77 88 120 0 28-9 52-24 72 26 0 56-18 64-56 22 28 40 68 40 108 0 79.52-64.48 144-144 144S112 399.52 112 320z"
    />
  </>,
)

/** Explorer Footsteps: playful duotone pair of traveler footprints + trail dots. */
export const FootstepsIcon = icon(
  <>
    <ellipse cx="144" cy="212" rx="54" ry="88" transform="rotate(-12 144 212)" {...duotoneStrong} />
    <ellipse cx="144" cy="212" rx="54" ry="88" transform="rotate(-12 144 212)" {...stroke} />
    <ellipse cx="168" cy="368" rx="42" ry="48" transform="rotate(-10 168 368)" fill="currentColor" />
    <ellipse cx="364" cy="144" rx="54" ry="88" transform="rotate(12 364 144)" {...duotoneStrong} />
    <ellipse cx="364" cy="144" rx="54" ry="88" transform="rotate(12 364 144)" {...stroke} />
    <ellipse cx="340" cy="300" rx="42" ry="48" transform="rotate(10 340 300)" fill="currentColor" />
    <circle cx="246" cy="434" r="14" fill="currentColor" fillOpacity={0.5} />
    <circle cx="272" cy="388" r="12" fill="currentColor" fillOpacity={0.5} />
  </>,
)

/** Unlocked / Featured Heritage Medallion: duotone ringed badge, central star & V-notched ribbons. */
export const RibbonIcon = icon(
  <>
    <circle cx="256" cy="176" r="128" {...duotoneStrong} />
    <path {...duotone} d="M172 278l-34 186 118-56 118 56-34-186" />
    <circle cx="256" cy="176" r="128" {...stroke} />
    <path {...stroke} d="M172 278l-34 186 118-56 118 56-34-186" />
    <path
      fill="currentColor"
      d="M256 108l20 48 50 18-50 18-20 48-20-48-50-18 50-18z"
    />
  </>,
)

/** Outline Badge Ribbon: clean heritage medal with soft duotone inner disc. */
export const RibbonOutlineIcon = icon(
  <>
    <circle cx="256" cy="160" r="112" {...duotone} />
    <circle cx="256" cy="160" r="112" {...stroke} />
    <path {...stroke} d="M176 256l-32 208 112-64 112 64-32-208" />
    <circle cx="256" cy="160" r="36" fill="currentColor" fillOpacity={0.45} />
  </>,
)

/** Heritage Rating Star: rounded 5-point star with warm duotone body & bright inner highlight. */
export const StarIcon = icon(
  <>
    <path
      {...duotoneStrong}
      d="M256 52l54 128 138 14-104 94 28 136-116-68-116 68 28-136-104-94 138-14z"
    />
    <path
      {...stroke}
      d="M256 52l54 128 138 14-104 94 28 136-116-68-116 68 28-136-104-94 138-14z"
    />
    <circle cx="256" cy="252" r="28" fill="currentColor" />
  </>,
)

/* =========================================================================
   AI GUIDE, CHAT, AUDIO & SHARING ICONS
   ========================================================================= */

/** AI Guide Chat Bubble: duotone speech bubble with three playful dots. */
export const ChatbubbleEllipsesIcon = icon(
  <>
    <path
      {...duotone}
      d="M256 64C132.29 64 32 149.96 32 256c0 45.77 18.67 87.81 49.84 120.76-3.79 25.43-17.18 54.47-31.38 76.26a12 12 0 0013.23 18.08c32.21-8.57 68.18-24.71 91.61-40.82C186.17 441.58 220.23 448 256 448c123.71 0 224-85.96 224-192S379.71 64 256 64z"
    />
    <path
      {...stroke}
      d="M256 64C132.29 64 32 149.96 32 256c0 45.77 18.67 87.81 49.84 120.76-3.79 25.43-17.18 54.47-31.38 76.26a12 12 0 0013.23 18.08c32.21-8.57 68.18-24.71 91.61-40.82C186.17 441.58 220.23 448 256 448c123.71 0 224-85.96 224-192S379.71 64 256 64z"
    />
    <circle cx="168" cy="256" r="24" fill="currentColor" />
    <circle cx="256" cy="256" r="24" fill="currentColor" />
    <circle cx="344" cy="256" r="24" fill="currentColor" />
  </>,
)

/** AI Sparkles (Filled): duotone burst star + twin accent sparkles. */
export const SparklesIcon = icon(
  <>
    <path {...duotoneStrong} d="M208 136l48 128 128 48-128 48-48 128-48-128-128-48 128-48z" />
    <path {...stroke} d="M208 144l44 124 124 44-124 44-44 124-44-124-124-44 124-44z" />
    <path fill="currentColor" d="M400 56l20 52 52 20-52 20-20 52-20-52-52-20 52-20zM92 32l14 38 38 14-38 14-14 38-14-38-38-14 38-14z" />
  </>,
)

/** AI Sparkles (Outline): crisp multi-star outline with soft center glow. */
export const SparklesOutlineIcon = icon(
  <>
    <path {...duotone} d="M208 144l44 124 124 44-124 44-44 124-44-124-124-44 124-44z" />
    <path
      {...stroke}
      d="M259.92 262.91L216.4 149.77a9 9 0 00-16.8 0l-43.52 113.14a9 9 0 01-5.17 5.17L37.77 311.6a9 9 0 000 16.8l113.14 43.52a9 9 0 015.17 5.17l43.52 113.14a9 9 0 0016.8 0l43.52-113.14a9 9 0 015.17-5.17l113.14-43.52a9 9 0 000-16.8l-113.14-43.52a9 9 0 01-5.17-5.17zM108 68L88 16 68 68 16 88l52 20 20 52 20-52 52-20-52-20zM426.67 117.33L400 48l-26.67 69.33L304 144l69.33 26.67L400 240l26.67-69.33L496 144l-69.33-26.67z"
    />
  </>,
)

export const VolumeHighOutlineIcon = icon(
  <>
    <path {...duotone} d="M126 192H56a8 8 0 00-8 8v112a8 8 0 008 8h69.65a15.93 15.93 0 0110.14 3.54l91.47 74.89A8 8 0 00240 392V120a8 8 0 00-12.74-6.43l-91.47 74.89A15 15 0 01126 192z" />
    <path {...stroke} d="M126 192H56a8 8 0 00-8 8v112a8 8 0 008 8h69.65a15.93 15.93 0 0110.14 3.54l91.47 74.89A8 8 0 00240 392V120a8 8 0 00-12.74-6.43l-91.47 74.89A15 15 0 01126 192zM320 320c9.74-19.38 16-40.84 16-64 0-23.48-6-44.42-16-64M368 368c19.48-33.92 32-64.06 32-112s-12-77.74-32-112M416 416c30-46 48-91.43 48-160s-18-113-48-160" />
  </>,
)

export const PauseIcon = icon(
  <>
    <rect x="124" y="88" width="92" height="336" rx="28" {...duotoneStrong} />
    <rect x="296" y="88" width="92" height="336" rx="28" {...duotoneStrong} />
    <rect x="124" y="88" width="92" height="336" rx="28" {...stroke} />
    <rect x="296" y="88" width="92" height="336" rx="28" {...stroke} />
  </>,
)

export const ShareSocialOutlineIcon = icon(
  <>
    <circle cx="128" cy="256" r="48" {...duotoneStrong} />
    <circle cx="384" cy="112" r="48" {...duotoneStrong} />
    <circle cx="384" cy="400" r="48" {...duotoneStrong} />
    <circle cx="128" cy="256" r="48" {...stroke} />
    <circle cx="384" cy="112" r="48" {...stroke} />
    <circle cx="384" cy="400" r="48" {...stroke} />
    <path {...stroke} d="M169.83 279.53l172.34 96.94M342.17 135.53l-172.34 96.94" />
  </>,
)

/* =========================================================================
   PERMISSIONS, AUTH, SETTINGS & STATUS ICONS
   ========================================================================= */

export const ShieldCheckmarkOutlineIcon = icon(
  <>
    <path {...duotone} d="M463.1 112.37C373.68 96.33 336.71 84.45 256 48c-80.71 36.45-117.68 48.33-207.1 64.37C32.7 369.13 240.58 457.79 256 464c15.42-6.21 223.3-94.87 207.1-351.63z" />
    <path {...stroke} d="M336 176L225.2 304 176 255.8" />
    <path {...stroke} d="M463.1 112.37C373.68 96.33 336.71 84.45 256 48c-80.71 36.45-117.68 48.33-207.1 64.37C32.7 369.13 240.58 457.79 256 464c15.42-6.21 223.3-94.87 207.1-351.63z" />
  </>,
)

export const LockClosedIcon = icon(
  <>
    <rect x="96" y="208" width="320" height="260" rx="56" {...duotoneStrong} />
    <path {...stroke} d="M336 208v-80a80 80 0 00-160 0v80" />
    <rect x="96" y="208" width="320" height="260" rx="56" {...stroke} />
    <circle cx="256" cy="336" r="28" fill="currentColor" />
  </>,
)

export const LockClosedOutlineIcon = icon(
  <>
    <rect x="96" y="208" width="320" height="272" rx="48" ry="48" {...duotone} />
    <path {...stroke} d="M336 208v-95a80 80 0 00-160 0v95" />
    <rect {...stroke} x="96" y="208" width="320" height="272" rx="48" ry="48" />
    <circle cx="256" cy="340" r="22" fill="currentColor" />
  </>,
)

export const MailOutlineIcon = icon(
  <>
    <rect x="48" y="96" width="416" height="320" rx="44" ry="44" {...duotone} />
    <rect {...stroke} x="48" y="96" width="416" height="320" rx="44" ry="44" />
    <path {...stroke} d="M112 160l144 112 144-112" />
  </>,
)

export const EyeOutlineIcon = icon(
  <>
    <circle cx="256" cy="256" r="80" {...duotoneStrong} />
    <path
      {...stroke}
      d="M255.66 112c-77.94 0-157.89 45.11-220.83 135.33a16 16 0 00-.27 17.77C82.92 340.8 161.8 400 255.66 400c92.84 0 173.34-59.38 221.79-135.25a16.14 16.14 0 000-17.47C428.89 172.28 347.8 112 255.66 112z"
    />
    <circle cx="256" cy="256" r="80" {...stroke} />
    <circle cx="256" cy="256" r="28" fill="currentColor" />
  </>,
)

export const EyeOffOutlineIcon = icon(
  <>
    <path
      {...duotone}
      d="M255.66 128c-68 0-136 42-192 128 56 86 124 128 192 128s136-42 192-128c-56-86-124-128-192-128z"
    />
    <path
      fill="currentColor"
      d="M432 448a15.92 15.92 0 01-11.31-4.69l-352-352a16 16 0 0122.62-22.62l352 352A16 16 0 01432 448zM255.66 384c-41.49 0-81.5-12.28-118.92-36.5-34.07-22-64.74-53.51-88.7-91v-.08c19.94-28.57 41.78-52.73 65.24-72.21a2 2 0 00.14-2.94L93.5 161.38a2 2 0 00-2.71-.12c-24.92 21-48.05 46.76-69.08 76.92a31.92 31.92 0 00-.64 35.54c26.41 41.33 60.4 76.14 98.28 100.65C162 402 207.9 416 255.66 416a239.13 239.13 0 0075.8-12.58 2 2 0 00.77-3.31l-21.58-21.58a4 4 0 00-3.83-1 204.8 204.8 0 01-51.16 6.47zM490.84 238.6c-26.46-40.92-60.79-75.68-99.27-100.53C349 110.55 302 96 255.66 96a227.34 227.34 0 00-74.89 12.83 2 2 0 00-.75 3.31l21.55 21.55a4 4 0 003.88 1 192.82 192.82 0 0150.21-6.69c40.69 0 80.58 12.43 118.55 37 34.71 22.4 65.74 53.88 89.76 91a.13.13 0 010 .16 310.72 310.72 0 01-64.12 72.73 2 2 0 00-.15 2.95l19.9 19.89a2 2 0 002.7.13 343.49 343.49 0 0068.64-78.48 32.2 32.2 0 00-.1-34.78z"
    />
    <path
      fill="currentColor"
      d="M256 160a95.88 95.88 0 00-21.37 2.4 2 2 0 00-1 3.38l112.59 112.56a2 2 0 003.38-1A96 96 0 00256 160zM165.78 233.66a2 2 0 00-3.38 1 96 96 0 00115 115 2 2 0 001-3.38z"
    />
  </>,
)

export const CheckmarkCircleOutlineIcon = icon(
  <>
    <circle cx="256" cy="256" r="192" {...duotone} />
    <circle cx="256" cy="256" r="192" {...stroke} />
    <path {...stroke} d="M352 184L224 336l-64-64" />
  </>,
)

export const CheckmarkCircleIcon = icon(
  <>
    <circle cx="256" cy="256" r="200" {...duotoneStrong} />
    <circle cx="256" cy="256" r="200" {...stroke} />
    <path {...stroke} strokeWidth={40} d="M352 184L224 332l-64-64" />
  </>,
)

export const TimeOutlineIcon = icon(
  <>
    <circle cx="256" cy="256" r="192" {...duotone} />
    <circle cx="256" cy="256" r="192" {...stroke} />
    <path {...stroke} d="M256 132v140h96" />
    <circle cx="256" cy="272" r="16" fill="currentColor" />
  </>,
)

export const CloudOfflineOutlineIcon = icon(
  <>
    <path
      {...duotone}
      d="M93.72 183.25C49.49 198.05 16 233.1 16 288c0 66 54 112 120 112h240c66 0 120-34 120-88 0-59.82-53-85.76-96-88-8.89-89.54-71-144-144-144-48 0-112 36-162.28 103.25z"
    />
    <path
      {...stroke}
      d="M93.72 183.25C49.49 198.05 16 233.1 16 288c0 66 54 112 120 112h184.37M467.82 377.74C485.24 363.3 496 341.61 496 312c0-59.82-53-85.76-96-88-8.89-89.54-71-144-144-144-26.16 0-48.79 6.93-67.6 18.14"
    />
    <path {...stroke} d="M448 448L64 64" />
  </>,
)

export const CreateOutlineIcon = icon(
  <>
    <rect x="48" y="128" width="328" height="328" rx="48" {...duotone} />
    <path {...stroke} d="M384 224v184a40 40 0 01-40 40H104a40 40 0 01-40-40V168a40 40 0 0140-40h167.48" />
    <path
      fill="currentColor"
      d="M459.94 53.25a16.06 16.06 0 00-23.22-.56L424.35 65a8 8 0 000 11.31l11.34 11.32a8 8 0 0011.34 0l12.26-12.26a16 16 0 00.65-22.12zM399.34 90L218.82 270.5a9 9 0 00-2.31 3.93L208.16 304a4 4 0 004.83 4.83l29.57-8.35a9 9 0 003.93-2.31L427 117.66a8 8 0 000-11.31l-16.32-16.35a8 8 0 00-11.34 0z"
    />
  </>,
)

export const GlobeOutlineIcon = icon(
  <>
    <circle cx="256" cy="256" r="208" {...duotone} />
    <circle cx="256" cy="256" r="208" {...stroke} />
    <path {...stroke} d="M256 48c-58.07 0-96 93.36-96 208s37.93 208 96 208 96-93.36 96-208-37.93-208-96-208zM70.06 144h371.88M70.06 368h371.88" />
  </>,
)

export const MoonOutlineIcon = icon(
  <>
    <path
      {...duotone}
      d="M160 136c0-30.62 4.51-61.61 16-88C99.57 81.27 48 159.32 48 248c0 119.29 96.71 216 216 216 88.68 0 166.73-51.57 200-128-26.39 11.49-57.38 16-88 16-119.29 0-216-96.71-216-216z"
    />
    <path
      {...stroke}
      d="M160 136c0-30.62 4.51-61.61 16-88C99.57 81.27 48 159.32 48 248c0 119.29 96.71 216 216 216 88.68 0 166.73-51.57 200-128-26.39 11.49-57.38 16-88 16-119.29 0-216-96.71-216-216z"
    />
    <path fill="currentColor" d="M368 88l12 28 28 12-28 12-12 28-12-28-28-12 28-12z" />
  </>,
)

export const NotificationsOutlineIcon = icon(
  <>
    <path
      {...duotone}
      d="M400 352c0-27.61-12-40-24-64-16-32-16-80-16-96a104 104 0 00-208 0c0 16 0 64-16 96-12 24-24 36.39-24 64 0 14 11 26 24 26h240c13 0 24-12 24-26z"
    />
    <path
      {...stroke}
      d="M400 352c0-27.61-12-40-24-64-16-32-16-80-16-96a104 104 0 00-208 0c0 16 0 64-16 96-12 24-24 36.39-24 64 0 14 11 26 24 26h240c13 0 24-12 24-26zM320 384c0 17.67-14.33 32-32 32h-64c-17.67 0-32-14.33-32-32"
    />
  </>,
)

export const HelpCircleOutlineIcon = icon(
  <>
    <circle cx="256" cy="256" r="208" {...duotone} />
    <circle cx="256" cy="256" r="208" {...stroke} />
    <path {...stroke} d="M200 202.29s.84-17.5 19.57-32.57C238.29 154.67 266.36 157 280 172c14.28 15.68 12.3 35.6-1.57 48.57-15.11 14.12-26.43 28.57-26.43 51.43v8" />
    <circle cx="256" cy="340" r="20" fill="currentColor" />
  </>,
)

export const InformationCircleOutlineIcon = icon(
  <>
    <circle cx="256" cy="256" r="208" {...duotone} />
    <circle cx="256" cy="256" r="208" {...stroke} />
    <path {...stroke} d="M256 224v136" />
    <circle cx="256" cy="156" r="20" fill="currentColor" />
  </>,
)

export const LogOutOutlineIcon = icon(
  <>
    <rect x="64" y="96" width="240" height="320" rx="40" {...duotone} />
    <path {...stroke} d="M304 336v40a40 40 0 01-40 40H104a40 40 0 01-40-40V136a40 40 0 0140-40h160a40 40 0 0140 40v40M384 192l64 64-64 64M448 256H192" />
  </>,
)

export const LogInOutlineIcon = icon(
  <>
    <rect x="192" y="96" width="240" height="320" rx="40" {...duotone} />
    <path {...stroke} d="M192 176v-40a40 40 0 0140-40h160a40 40 0 0140 40v240a40 40 0 01-40 40H240c-22.09 0-48-17.91-48-40v-40" />
    <path {...stroke} d="M288 336l80-80-80-80M80 256h272" />
  </>,
)

export const TrashOutlineIcon = icon(
  <>
    <path {...duotone} d="M112 112l20 320c1.07 17.6 15.6 32 33.2 32h181.6c17.6 0 32.13-14.4 33.2-32l20-320z" />
    <path {...stroke} d="M112 112l20 320c1.07 17.6 15.6 32 33.2 32h181.6c17.6 0 32.13-14.4 33.2-32l20-320M80 112h352M192 112V72a24 24 0 0124-24h80a24 24 0 0124 24v40M256 176v224M184 176l8 224M328 176l-8 224" />
  </>,
)

export const MicOutlineIcon = icon(
  <>
    <rect x="192" y="64" width="128" height="240" rx="64" {...duotoneStrong} />
    <path {...stroke} d="M192 448h128M384 208v32c0 70.4-57.6 128-128 128h0c-70.4 0-128-57.6-128-128v-32M256 368v80" />
    <path {...stroke} d="M256 64a63.68 63.68 0 00-64 64v111a64 64 0 00128 0V128a63.68 63.68 0 00-64-64z" />
  </>,
)

export const AddOutlineIcon = icon(
  <>
    <circle cx="256" cy="256" r="184" {...duotone} />
    <path {...stroke} strokeWidth={40} d="M256 132v248M380 256H132" />
  </>,
)

export const ImageOutlineIcon = icon(
  <>
    <rect x="48" y="80" width="416" height="352" rx="48" ry="48" {...duotone} />
    <circle cx="336" cy="176" r="32" fill="currentColor" />
    <rect x="48" y="80" width="416" height="352" rx="48" ry="48" {...stroke} />
    <path {...stroke} d="M304 335.79l-90.66-90.49a32 32 0 00-43.87-1.3L48 352M224 432l123.34-123.34a32 32 0 0143.11-2L464 368" />
  </>,
)

export const LanguageOutlineIcon = icon(
  <>
    <circle cx="192" cy="236" r="144" {...duotone} />
    <path {...stroke} d="M48 112h288M192 64v48M272 448l96-224 96 224M301.5 384h133M281.3 112S257 206 199 277 80 384 80 384" />
    <path {...stroke} d="M256 336s-35-27-72-75-56-85-56-85" />
  </>,
)

export const CopyOutlineIcon = icon(
  <>
    <rect x="128" y="128" width="336" height="336" rx="57" ry="57" {...duotone} />
    <rect x="128" y="128" width="336" height="336" rx="57" ry="57" {...stroke} />
    <path {...stroke} d="M383.5 128l.5-24a56.16 56.16 0 00-56-56H112a64.19 64.19 0 00-64 64v216a56.16 56.16 0 0056 56h24" />
  </>,
)

export const DownloadOutlineIcon = icon(
  <>
    <path {...duotone} d="M96 224v192a40 40 0 0040 40h240a40 40 0 0040-40V224z" />
    <path {...stroke} d="M336 176h40a40 40 0 0140 40v208a40 40 0 01-40 40H136a40 40 0 01-40-40V216a40 40 0 0140-40h40" />
    <path {...stroke} d="M176 272l80 80 80-80M256 48v288" />
  </>,
)

export const ThumbsUpOutlineIcon = icon(
  <>
    <path
      {...duotone}
      d="M320 458.16S304 464 256 464s-74-16-96-32H96a64 64 0 01-64-64V256a64 64 0 0164-64h48a24 24 0 0020.43-11.42l66.37-107.75A36.7 36.7 0 01262.13 56c17.94 0 32.16 14.37 32.16 32.31 0 11.41-5.21 30.86-13.79 49.49-4.78 10.38-6.48 24.4 2.55 31.78a22.14 22.14 0 0014.12 4.89H416a48 48 0 0148 48c0 15.86-10.37 29.66-24.21 33.49 12.1 4.4 20.21 16.58 20.21 30.51 0 17.56-13.59 32.22-30.81 33.76 7.82 6.84 12.81 17.07 12.81 28.48 0 18.67-14.2 34.48-32.51 36.22 3.31 5.69 5.51 12.31 5.51 19.37 0 21-17 38-38 38z"
    />
    <path
      {...stroke}
      d="M320 458.16S304 464 256 464s-74-16-96-32H96a64 64 0 01-64-64V256a64 64 0 0164-64h48a24 24 0 0020.43-11.42l66.37-107.75A36.7 36.7 0 01262.13 56c17.94 0 32.16 14.37 32.16 32.31 0 11.41-5.21 30.86-13.79 49.49-4.78 10.38-6.48 24.4 2.55 31.78a22.14 22.14 0 0014.12 4.89H416a48 48 0 0148 48c0 15.86-10.37 29.66-24.21 33.49 12.1 4.4 20.21 16.58 20.21 30.51 0 17.56-13.59 32.22-30.81 33.76 7.82 6.84 12.81 17.07 12.81 28.48 0 18.67-14.2 34.48-32.51 36.22 3.31 5.69 5.51 12.31 5.51 19.37 0 21-17 38-38 38z"
    />
  </>,
)

export const ThumbsDownOutlineIcon = icon(
  <>
    <path
      {...duotone}
      d="M192 53.84S208 48 256 48s74 16 96 32h64a64 64 0 0164 64v112a64 64 0 01-64 64h-48a24 24 0 00-20.43 11.42l-66.37 107.75A36.7 36.7 0 01249.87 456c-17.94 0-32.16-14.37-32.16-32.31 0-11.41 5.21-30.86 13.79-49.49 4.78-10.38 6.48-24.4-2.55-31.78a22.14 22.14 0 00-14.12-4.89H96a48 48 0 01-48-48c0-15.86 10.37-29.66 24.21-33.49-12.1-4.4-20.21-16.58-20.21-30.51 0-17.56 13.59-32.22 30.81-33.76-7.82-6.84-12.81-17.07-12.81-28.48 0-18.67 14.2-34.48 32.51-36.22C99.2 122.46 97 115.84 97 108.78c0-21 17-38 38-38z"
    />
    <path
      {...stroke}
      d="M192 53.84S208 48 256 48s74 16 96 32h64a64 64 0 0164 64v112a64 64 0 01-64 64h-48a24 24 0 00-20.43 11.42l-66.37 107.75A36.7 36.7 0 01249.87 456c-17.94 0-32.16-14.37-32.16-32.31 0-11.41 5.21-30.86 13.79-49.49 4.78-10.38 6.48-24.4-2.55-31.78a22.14 22.14 0 00-14.12-4.89H96a48 48 0 01-48-48c0-15.86 10.37-29.66 24.21-33.49-12.1-4.4-20.21-16.58-20.21-30.51 0-17.56 13.59-32.22 30.81-33.76-7.82-6.84-12.81-17.07-12.81-28.48 0-18.67 14.2-34.48 32.51-36.22C99.2 122.46 97 115.84 97 108.78c0-21 17-38 38-38z"
    />
  </>,
)

export const RadioButtonOffIcon = icon(
  <>
    <circle cx="256" cy="256" r="192" {...duotone} />
    <circle cx="256" cy="256" r="192" {...stroke} />
  </>,
)

export const RadioButtonOnIcon = icon(
  <>
    <circle cx="256" cy="256" r="192" {...duotoneStrong} />
    <circle cx="256" cy="256" r="192" {...stroke} />
    <circle fill="currentColor" cx="256" cy="256" r="112" />
  </>,
)

export const ArrowBackIcon = icon(<path {...stroke} strokeWidth={48} d="M244 400L100 256l144-144M120 256h292" />)

export const ArrowForwardIcon = icon(<path {...stroke} strokeWidth={48} d="M268 112l144 144-144 144M392 256H100" />)

export const ArrowUpIcon = icon(<path {...stroke} strokeWidth={48} d="M112 244l144-144 144 144M256 120v292" />)

export const ArrowUndoOutlineIcon = icon(
  <>
    <path {...duotone} d="M240 424v-96c116.4 0 159.39 33.76 208 96 0-119.23-39.57-240-208-240V88L64 256z" />
    <path {...stroke} d="M240 424v-96c116.4 0 159.39 33.76 208 96 0-119.23-39.57-240-208-240V88L64 256z" />
  </>,
)

export const CloseOutlineIcon = icon(<path {...stroke} strokeWidth={40} d="M368 368L144 144M368 144L144 368" />)

export const CheckmarkIcon = icon(<path {...stroke} strokeWidth={44} d="M416 128L192 384l-96-96" />)

export const ChevronForwardOutlineIcon = icon(<path {...stroke} strokeWidth={40} d="M184 112l144 144-144 144" />)

export const ChevronBackOutlineIcon = icon(<path {...stroke} strokeWidth={40} d="M328 112L184 256l144 144" />)

export const ChevronDownOutlineIcon = icon(<path {...stroke} strokeWidth={40} d="M112 184l144 144 144-144" />)

export const EllipsisHorizontalIcon = icon(
  <>
    <circle cx="256" cy="256" r="48" fill="currentColor" />
    <circle cx="416" cy="256" r="48" fill="currentColor" fillOpacity={0.7} />
    <circle cx="96" cy="256" r="48" fill="currentColor" fillOpacity={0.7} />
  </>,
)

export const CalendarOutlineIcon = icon(
  <>
    <rect x="64" y="96" width="384" height="352" rx="48" {...duotone} />
    <rect x="64" y="96" width="384" height="352" rx="48" {...stroke} />
    <path {...stroke} d="M144 48v48M368 48v48M64 192h384" />
    <circle cx="176" cy="288" r="24" fill="currentColor" />
    <circle cx="256" cy="288" r="24" fill="currentColor" />
    <circle cx="336" cy="288" r="24" fill="currentColor" />
  </>,
)

export const RefreshCwOutlineIcon = icon(
  <>
    <circle cx="256" cy="256" r="176" {...duotone} />
    <path {...stroke} d="M416 196a168 168 0 00-308-52M96 316a168 168 0 00308 52" />
    <path {...stroke} d="M356 204h68v-68M156 308H88v68" />
  </>,
)

export const LogoGoogleIcon = icon(
  <path
    fill="currentColor"
    d="M473.16 221.48l-2.26-9.59H262.46v88.22H387c-12.93 61.4-72.93 93.72-121.94 93.72-35.66 0-73.25-15-98.13-39.11a140.08 140.08 0 01-41.8-98.88c0-37.16 16.7-74.33 41-98.78s61-38.13 97.49-38.13c41.79 0 71.74 22.19 82.94 32.31l62.69-62.36C390.86 72.72 340.34 32 261.6 32c-60.75 0-119 23.27-161.58 65.71C58 139.5 36.25 199.93 36.25 256s20.58 113.48 61.3 155.6c43.51 44.92 105.13 68.4 168.58 68.4 57.73 0 112.45-22.62 151.45-63.66 38.34-40.4 58.17-96.3 58.17-154.9 0-24.67-2.48-39.32-2.59-39.96z"
  />,
)
