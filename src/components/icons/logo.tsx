import * as React from 'react';

export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 256 256"
    {...props}
    aria-label="S&G Logo Placeholder"
  >
    <rect width="256" height="256" fill="none" />
    <path
      d="M168,128.00005a40,40,0,1,1-40-40A40,40,0,0,1,168,128.00005Z"
      opacity="0.2"
    />
    <path
      d="M168,128.00005a40,40,0,1,1-40-40A40,40,0,0,1,168,128.00005Z"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    />
    <path
      d="M128,24.00005V40.34a80.21175,80.21175,0,0,1,64,78.2398"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    />
    <path
      d="M232,128.00005h-16.34a80.21175,80.21175,0,0,0-78.2398-64V24.00005"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    />
    <path
      d="M128,232.00005v-16.34a80.21175,80.21175,0,0,0-64-78.2398"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    />
    <path
      d="M24,128.00005H40.34a80.21175,80.21175,0,0,1,78.2398,64v16.34"
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="16"
    />
  </svg>
);
