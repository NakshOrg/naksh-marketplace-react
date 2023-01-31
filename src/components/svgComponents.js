export function UploadNftPlaceholder(props) {
    return <svg
        width={props.size}
        height={props.size}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <path
        d="M85.333 85.333 64 64 42.666 85.333M64 64v48"
        stroke="#E6EEFF"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        />
        <path
        d="M108.748 98.08a26.669 26.669 0 0 0 3.609-44.462A26.668 26.668 0 0 0 96.001 48h-6.72a42.665 42.665 0 0 0-75.762-14.488 42.667 42.667 0 0 0 2.482 53.421"
        stroke="#E6EEFF"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        />
        <path
        d="M85.333 85.333 64 64 42.666 85.333"
        stroke="#E6EEFF"
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
        />
    </svg>
}

export function EditIcon(props) {
    return (
        <svg
        xmlns="http://www.w3.org/2000/svg"
        width={props.size}
        height={props.size}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="prefix__feather prefix__feather-edit-2"
        {...props}
        >
        <path d="M17 3a2.828 2.828 0 114 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
        </svg>
    )
}

export const AddWalletIcon = (props) => (
    <svg
    width={46}
    height={46}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <g filter="url(#a)">
      <rect width={46} height={46} rx={23} fill="#fff" />
    </g>
    <path
      d="M22.745 15.894v13.702M15.894 22.745h13.702"
      stroke="#14192B"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <filter
        id="a"
        x={-96.181}
        y={-96.181}
        width={238.361}
        height={238.361}
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feGaussianBlur in="BackgroundImageFix" stdDeviation={48.09} />
        <feComposite
          in2="SourceAlpha"
          operator="in"
          result="effect1_backgroundBlur_105_2232"
        />
        <feBlend
          in="SourceGraphic"
          in2="effect1_backgroundBlur_105_2232"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
  )


export const Pricing = (props) => (
  <svg
    width={27}
    height={27}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="m23.164 15.086-8.067 8.066a2.25 2.25 0 0 1-3.183 0L2.25 13.5V2.25H13.5l9.664 9.664a2.25 2.25 0 0 1 0 3.172Z"
      fill="#12192B"
      stroke="#fff"
      strokeWidth={2.25}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx={8.5} cy={8.5} r={1} fill="#fff" />
  </svg>
)

export const Clock = (props) => (
  <svg
    width={27}
    height={27}
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path
      d="M13.5 24.75c6.213 0 11.25-5.037 11.25-11.25S19.713 2.25 13.5 2.25 2.25 7.287 2.25 13.5 7.287 24.75 13.5 24.75Z"
      fill="#fff"
      stroke="#fff"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.5 8.75V14l3.5 1.75"
      stroke="#000"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)