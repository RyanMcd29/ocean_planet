import React from "react";

export const LogoIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M3 9C3 7.89543 3.89543 7 5 7H19C20.1046 7 21 7.89543 21 9V20C21 21.1046 20.1046 22 19 22H5C3.89543 22 3 21.1046 3 20V9Z"
      className="fill-current"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M3 4C3 2.89543 3.89543 2 5 2H19C20.1046 2 21 2.89543 21 4V7H3V4ZM7 5C7 5.55228 6.55228 6 6 6C5.44772 6 5 5.55228 5 5C5 4.44772 5.44772 4 6 4C6.55228 4 7 4.44772 7 5ZM10 6C10.5523 6 11 5.55228 11 5C11 4.44772 10.5523 4 10 4C9.44772 4 9 4.44772 9 5C9 5.55228 9.44772 6 10 6Z"
      className="fill-current"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 10.5C12 10.2239 12.2239 10 12.5 10H17.5C17.7761 10 18 10.2239 18 10.5V15.5C18 15.7761 17.7761 16 17.5 16H12.5C12.2239 16 12 15.7761 12 15.5V10.5ZM13 11V15H17V11H13Z"
      fill="white"
    />
    <path
      d="M6 14.5C6 14.2239 6.22386 14 6.5 14H9.5C9.77614 14 10 14.2239 10 14.5C10 14.7761 9.77614 15 9.5 15H6.5C6.22386 15 6 14.7761 6 14.5Z"
      fill="white"
    />
    <path
      d="M6 12.5C6 12.2239 6.22386 12 6.5 12H9.5C9.77614 12 10 12.2239 10 12.5C10 12.7761 9.77614 13 9.5 13H6.5C6.22386 13 6 12.7761 6 12.5Z"
      fill="white"
    />
    <path
      d="M6 18.5C6 18.2239 6.22386 18 6.5 18H17.5C17.7761 18 18 18.2239 18 18.5C18 18.7761 17.7761 19 17.5 19H6.5C6.22386 19 6 18.7761 6 18.5Z"
      fill="white"
    />
  </svg>
);

export const WaveIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M2 12C2 12 5.5 7 12 7C18.5 7 22 12 22 12C22 12 18.5 17 12 17C5.5 17 2 12 2 12Z"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stroke-current"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M12 14C13.1046 14 14 13.1046 14 12C14 10.8954 13.1046 10 12 10C10.8954 10 10 10.8954 10 12C10 13.1046 10.8954 14 12 14Z"
      className="fill-current"
    />
    <path
      d="M4 8C5.5 9.667 8.4 13 12 13C15.6 13 18.5 9.667 20 8"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stroke-current"
    />
    <path
      d="M4 16C5.5 14.333 8.4 11 12 11C15.6 11 18.5 14.333 20 16"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stroke-current"
    />
  </svg>
);

export const DiveFlagIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M4 2V22"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="stroke-current"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4 4H20L16 9L20 14H4V4Z"
      className="fill-current"
    />
  </svg>
);
