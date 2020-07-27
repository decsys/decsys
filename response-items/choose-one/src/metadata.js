import React from "react";

// https://reactsvgicons.com/ionicons
// list-sharp
export const Icon = (p) => (
  <svg viewBox="0 0 512 512" fill="currentColor" {...p}>
    <path
      fill="none"
      stroke="currentColor"
      strokeLinejoin="round"
      strokeWidth={48}
      d="M144 144h320M144 256h320M144 368h320"
    />
    <path
      fill="none"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="round"
      strokeWidth={32}
      d="M64 128h32v32H64zM64 240h32v32H64zM64 352h32v32H64z"
    />
  </svg>
);
