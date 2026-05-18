export type SectionWallpaperTheme =
  | "blog"
  | "projects"
  | "cinema"
  | "radio"
  | "podcast"
  | "engineering"
  | "profile";

const textRows = Array.from({ length: 18 }, (_, index) => index);
const codeRows = Array.from({ length: 14 }, (_, index) => index);
const filmFrames = Array.from({ length: 8 }, (_, index) => index);
const sprockets = Array.from({ length: 16 }, (_, index) => index);
const grilleRows = Array.from({ length: 12 }, (_, index) => index);
const blueprintRows = Array.from({ length: 10 }, (_, index) => index);

function BlogWallpaper() {
  return (
    <>
      <g transform="translate(-126 92) rotate(-6 430 450)">
        <rect
          x="150"
          y="42"
          width="640"
          height="830"
          rx="12"
          fill="currentColor"
          opacity="0.028"
        />
        <rect
          x="150"
          y="42"
          width="640"
          height="830"
          rx="12"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.13"
        />
        <line
          x1="250"
          y1="44"
          x2="250"
          y2="872"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.08"
        />
        {textRows.map((row) => (
          <line
            key={row}
            x1="205"
            y1={126 + row * 36}
            x2={row % 5 === 4 ? 610 : row % 3 === 0 ? 710 : 742}
            y2={126 + row * 36}
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="3"
            opacity={row % 4 === 0 ? "0.13" : "0.08"}
          />
        ))}
      </g>
      <g transform="translate(830 82) rotate(8 260 260)" opacity="0.92">
        <rect
          x="0"
          y="0"
          width="470"
          height="610"
          rx="10"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.11"
        />
        <path
          d="M72 82h314M72 136h260M72 190h330M72 244h292M72 298h340M72 352h246M72 406h318M72 460h276"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="7"
          opacity="0.072"
        />
      </g>
      <path
        d="M850 760c100-110 150-205 202-286 48-75 95-78 123-42 34 44-21 102-82 83-82-26-35-144 71-141"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="9"
        opacity="0.09"
      />
      <path
        d="M1030 764l122 64-36-132-86 68Z"
        stroke="currentColor"
        strokeLinejoin="round"
        strokeWidth="3"
        opacity="0.11"
      />
    </>
  );
}

function ProjectsWallpaper() {
  return (
    <>
      <g transform="translate(120 84)">
        <rect
          x="0"
          y="0"
          width="790"
          height="560"
          rx="14"
          fill="currentColor"
          opacity="0.018"
        />
        <rect
          x="0"
          y="0"
          width="790"
          height="560"
          rx="14"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.13"
        />
        <line
          x1="0"
          y1="54"
          x2="790"
          y2="54"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.08"
        />
        <circle cx="34" cy="27" r="6" fill="currentColor" opacity="0.1" />
        <circle cx="58" cy="27" r="6" fill="currentColor" opacity="0.07" />
        <circle cx="82" cy="27" r="6" fill="currentColor" opacity="0.05" />
        {codeRows.map((row) => (
          <g key={row} transform={`translate(44 ${92 + row * 30})`}>
            <text
              x="0"
              y="0"
              fill="currentColor"
              fontFamily="monospace"
              fontSize="14"
              opacity="0.08"
            >
              {String(row + 1).padStart(2, "0")}
            </text>
            <line
              x1="58"
              y1="-5"
              x2={row % 4 === 1 ? 500 : row % 3 === 0 ? 650 : 585}
              y2="-5"
              stroke="currentColor"
              strokeLinecap="round"
              strokeWidth="8"
              opacity={row % 2 === 0 ? "0.08" : "0.045"}
            />
          </g>
        ))}
      </g>
      <g transform="translate(820 230)">
        <rect
          x="0"
          y="0"
          width="430"
          height="315"
          rx="12"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.1"
        />
        <path
          d="M50 78h146M50 126h256M50 174h192M50 222h304"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="7"
          opacity="0.06"
        />
        <path
          d="M42 66l34-24M42 66l34 24M354 224l34-24M354 224l-34-24"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="5"
          opacity="0.09"
        />
      </g>
      <path
        d="M180 742h270v-74h180v-80h210v74h260"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.08"
      />
      <path
        d="M1010 82v88h104v92"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.075"
      />
      <circle cx="1010" cy="82" r="7" fill="currentColor" opacity="0.08" />
      <circle cx="1114" cy="262" r="7" fill="currentColor" opacity="0.08" />
    </>
  );
}

function CinemaWallpaper() {
  return (
    <>
      <path
        d="M170 475c205-160 515-250 910-196"
        stroke="currentColor"
        strokeWidth="96"
        strokeLinecap="round"
        opacity="0.026"
      />
      <g transform="translate(-72 238) rotate(-10 760 240)">
        <rect
          x="0"
          y="130"
          width="1580"
          height="250"
          rx="8"
          fill="currentColor"
          opacity="0.025"
        />
        <rect
          x="0"
          y="130"
          width="1580"
          height="250"
          rx="8"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.12"
        />
        {filmFrames.map((frame) => (
          <rect
            key={frame}
            x={115 + frame * 170}
            y="176"
            width="120"
            height="158"
            rx="4"
            stroke="currentColor"
            strokeWidth="2"
            opacity={frame % 2 === 0 ? "0.11" : "0.075"}
          />
        ))}
        {sprockets.map((hole) => (
          <g key={hole}>
            <rect
              x={48 + hole * 92}
              y="148"
              width="30"
              height="22"
              rx="4"
              fill="currentColor"
              opacity="0.075"
            />
            <rect
              x={48 + hole * 92}
              y="340"
              width="30"
              height="22"
              rx="4"
              fill="currentColor"
              opacity="0.075"
            />
          </g>
        ))}
      </g>
      <g transform="translate(710 120)">
        <rect
          x="120"
          y="48"
          width="430"
          height="245"
          rx="8"
          stroke="currentColor"
          strokeWidth="3"
          opacity="0.095"
        />
        <path
          d="M60 512 170 318h332l110 194"
          stroke="currentColor"
          strokeWidth="3"
          opacity="0.07"
        />
        <path
          d="M236 72h198M236 122h198M236 172h198"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="5"
          opacity="0.045"
        />
      </g>
    </>
  );
}

function RadioWallpaper() {
  return (
    <>
      <g transform="translate(120 148)">
        <circle
          cx="320"
          cy="320"
          r="308"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.11"
        />
        <circle
          cx="320"
          cy="320"
          r="238"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.08"
        />
        <circle
          cx="320"
          cy="320"
          r="164"
          stroke="currentColor"
          strokeWidth="1.5"
          opacity="0.065"
        />
        <circle
          cx="320"
          cy="320"
          r="68"
          fill="currentColor"
          opacity="0.025"
        />
        <circle
          cx="320"
          cy="320"
          r="68"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.105"
        />
      </g>
      <path
        d="M620 520c22-54 44-54 66 0s44 54 66 0 44-54 66 0 44 54 66 0 44-54 66 0 44 54 66 0 44-54 66 0 44 54 66 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="9"
        opacity="0.075"
      />
      <g transform="translate(900 164)">
        <rect
          x="0"
          y="0"
          width="330"
          height="500"
          rx="18"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.09"
        />
        {grilleRows.map((row) => (
          <line
            key={row}
            x1="52"
            y1={58 + row * 24}
            x2="278"
            y2={58 + row * 24}
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="5"
            opacity={row % 2 === 0 ? "0.06" : "0.04"}
          />
        ))}
        <circle
          cx="165"
          cy="382"
          r="76"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.095"
        />
        <circle
          cx="165"
          cy="382"
          r="32"
          fill="currentColor"
          opacity="0.03"
        />
      </g>
    </>
  );
}

function PodcastWallpaper() {
  return (
    <>
      <g transform="translate(790 78)">
        <rect
          x="128"
          y="0"
          width="248"
          height="520"
          rx="124"
          fill="currentColor"
          opacity="0.018"
        />
        <rect
          x="128"
          y="0"
          width="248"
          height="520"
          rx="124"
          stroke="currentColor"
          strokeWidth="3"
          opacity="0.13"
        />
        <path
          d="M72 280c0 112 72 194 180 194s180-82 180-194"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="9"
          opacity="0.1"
        />
        <path
          d="M252 474v172M144 646h216M98 716h308"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="9"
          opacity="0.08"
        />
        {grilleRows.map((row) => (
          <line
            key={row}
            x1="172"
            y1={64 + row * 30}
            x2="332"
            y2={64 + row * 30}
            stroke="currentColor"
            strokeLinecap="round"
            strokeWidth="4"
            opacity={row % 3 === 0 ? "0.12" : "0.065"}
          />
        ))}
        <path
          d="M252 32v410"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="2"
          opacity="0.08"
        />
      </g>
      <path
        d="M142 520c66-46 118-46 156 0s90 46 156 0 118-46 156 0 90 46 156 0"
        stroke="currentColor"
        strokeLinecap="round"
        strokeWidth="5"
        opacity="0.045"
      />
      <circle
        cx="300"
        cy="290"
        r="130"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.055"
      />
      <circle
        cx="300"
        cy="290"
        r="76"
        stroke="currentColor"
        strokeWidth="2"
        opacity="0.04"
      />
    </>
  );
}

function EngineeringWallpaper() {
  return (
    <>
      <g opacity="0.34">
        {blueprintRows.map((row) => (
          <line
            key={`h-${row}`}
            x1="70"
            y1={100 + row * 74}
            x2="1370"
            y2={100 + row * 74}
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.045"
          />
        ))}
        {Array.from({ length: 16 }, (_, index) => (
          <line
            key={`v-${index}`}
            x1={100 + index * 82}
            y1="50"
            x2={100 + index * 82}
            y2="860"
            stroke="currentColor"
            strokeWidth="1"
            opacity="0.04"
          />
        ))}
      </g>
      <g transform="translate(166 108)">
        <rect
          x="0"
          y="0"
          width="565"
          height="430"
          rx="10"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.105"
        />
        <rect
          x="52"
          y="58"
          width="188"
          height="112"
          rx="8"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.08"
        />
        <rect
          x="300"
          y="58"
          width="188"
          height="112"
          rx="8"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.08"
        />
        <path
          d="M146 170v88h248v-88M146 258H80v92M394 258h86v92"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.085"
        />
        <circle cx="80" cy="350" r="9" fill="currentColor" opacity="0.08" />
        <circle cx="480" cy="350" r="9" fill="currentColor" opacity="0.08" />
      </g>
      <g transform="translate(792 172)">
        <path
          d="M0 292h390M24 292V96h334v196M80 96V22h222v74"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="5"
          opacity="0.075"
        />
        <path
          d="M82 168h220M82 218h146M82 268h268"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="7"
          opacity="0.05"
        />
        <path
          d="M390 292l94 106M0 292l-94 106"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="4"
          opacity="0.06"
        />
      </g>
      <path
        d="M168 700h234l54-74h156l62 74h292l52-70h168"
        stroke="currentColor"
        strokeDasharray="10 16"
        strokeLinecap="round"
        strokeWidth="2"
        opacity="0.08"
      />
    </>
  );
}

function ProfileWallpaper() {
  return (
    <>
      <g transform="translate(170 118) rotate(-5 300 310)">
        <rect
          x="0"
          y="0"
          width="560"
          height="710"
          rx="18"
          fill="currentColor"
          opacity="0.018"
        />
        <rect
          x="0"
          y="0"
          width="560"
          height="710"
          rx="18"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.11"
        />
        <rect
          x="70"
          y="92"
          width="184"
          height="230"
          rx="8"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.1"
        />
        <circle
          cx="162"
          cy="170"
          r="46"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.075"
        />
        <path
          d="M92 292c20-44 48-66 70-66s50 22 70 66"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="4"
          opacity="0.065"
        />
        <path
          d="M302 120h170M302 174h130M302 228h188M72 410h414M72 466h346M72 522h388"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="7"
          opacity="0.055"
        />
        <path
          d="M72 620h22m16 0h8m16 0h30m16 0h12m18 0h44m16 0h8m16 0h24m18 0h52m16 0h18m18 0h32"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="16"
          opacity="0.055"
        />
      </g>
      <g transform="translate(780 170) rotate(6 240 270)">
        <rect
          x="0"
          y="0"
          width="460"
          height="560"
          rx="10"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.075"
        />
        <path
          d="M70 82h320M70 144h242M70 206h292M70 268h198M70 330h320"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="7"
          opacity="0.045"
        />
        <circle
          cx="342"
          cy="426"
          r="74"
          stroke="currentColor"
          strokeWidth="2"
          opacity="0.07"
        />
        <path
          d="M290 426h104M342 374v104"
          stroke="currentColor"
          strokeLinecap="round"
          strokeWidth="3"
          opacity="0.055"
        />
      </g>
    </>
  );
}

function renderWallpaper(theme: SectionWallpaperTheme) {
  switch (theme) {
    case "blog":
      return <BlogWallpaper />;
    case "projects":
      return <ProjectsWallpaper />;
    case "cinema":
      return <CinemaWallpaper />;
    case "radio":
      return <RadioWallpaper />;
    case "podcast":
      return <PodcastWallpaper />;
    case "engineering":
      return <EngineeringWallpaper />;
    case "profile":
      return <ProfileWallpaper />;
  }
}

export function SectionWallpaper({ theme }: { theme: SectionWallpaperTheme }) {
  return (
    <div
      aria-hidden="true"
      className={`section-wallpaper section-wallpaper--${theme}`}
    >
      <svg
        className="section-wallpaper__svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMin slice"
        fill="none"
      >
        {renderWallpaper(theme)}
      </svg>
    </div>
  );
}
