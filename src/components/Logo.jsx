import React from 'react'

const Logo = () => {
    return (
        <svg width="260" height="64" viewBox="0 0 260 64" xmlns="http://www.w3.org/2000/svg" aria-labelledby="snapshareTitle2" role="img">
            <title id="snapshareTitle2">SnapShare</title>
            <defs>
                <linearGradient id="snapGradient" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="#10B981" />  
                    <stop offset="100%" stopColor="#3B82F6" /> 
                </linearGradient>
            </defs>

            <g transform="translate(0,6)" fill="none" stroke="url(#snapGradient)" strokeWidth="4">
                <rect x="4" y="10" width="60" height="40" rx="10" />
                <path d="M20 10l6-6h16l6 6" strokeLinecap="round" strokeLinejoin="round" />
                <circle cx="34" cy="30" r="10" />
            </g>

            <path d="M54 24l2-4 2 4 4 2-4 2-2 4-2-4-4-2 4-2z" fill="url(#snapGradient)" />

            <g transform="translate(74,6)" fill="currentColor">
                <text
                    x="0"
                    y="32"
                    fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Noto Sans'"
                    fontSize="30"  // ← was 28
                    fontWeight="700"
                    letterSpacing="0.5"
                >
                    Snap
                </text>
                <text
                    x="92"  // ← slightly adjusted position (was 88)
                    y="32"
                    fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Noto Sans'"
                    fontSize="30"  // ← was 28
                    fontWeight="700"
                    opacity="0.82"
                    letterSpacing="0.5"
                >
                    Share
                </text>
                <text
                    x="0"
                    y="54"  // ← was 52
                    fontFamily="Inter, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, 'Noto Sans'"
                    fontSize="13"  // ← was 12
                    opacity="0.6"
                    color='white'
                >
                    Capture. Share. Connect.
                </text>
            </g>
        </svg>
    )
}

export default Logo
