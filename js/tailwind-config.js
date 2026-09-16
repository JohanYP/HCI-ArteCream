// ARTECREAM - Centralized Tailwind CSS Configuration
tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "on-tertiary-container": "#a9b443",
        "surface-bright": "#fff8f6",
        "surface-container": "#ffe9e5",
        "primary-fixed-dim": "#ffb2bf",
        "on-primary-container": "#ff88a2",
        "error-container": "#ffdad6",
        "background": "#fff8f6",
        "tertiary-fixed-dim": "#c3ce5b",
        "on-tertiary-fixed": "#1a1d00",
        "on-tertiary-fixed-variant": "#444b00",
        "on-tertiary": "#ffffff",
        "surface-container-low": "#fff0ee",
        "tertiary-fixed": "#dfeb74",
        "on-surface-variant": "#554245",
        "error": "#ba1a1a",
        "surface": "#fff8f6",
        "surface-container-highest": "#f8dcd7",
        "surface-container-lowest": "#ffffff",
        "on-secondary-container": "#633000",
        "on-background": "#271815",
        "tertiary-container": "#3e4400",
        "primary-fixed": "#ffd9de",
        "on-surface": "#271815",
        "surface-dim": "#f0d4cf",
        "outline": "#887175",
        "tertiary": "#292d00",
        "inverse-surface": "#3d2c29",
        "on-error-container": "#93000a",
        "on-error": "#ffffff",
        "surface-variant": "#f8dcd7",
        "on-secondary-fixed": "#301400",
        "inverse-primary": "#ffb2bf",
        "secondary-fixed-dim": "#ffb784",
        "primary-container": "#7a1b38",
        "outline-variant": "#dbc0c3",
        "on-primary": "#ffffff",
        "secondary": "#944a00",
        "surface-container-high": "#fee2dd",
        "primary": "#5b0023",
        "surface-tint": "#a13a55",
        "on-primary-fixed": "#3f0016",
        "secondary-container": "#fd8b27",
        "on-secondary-fixed-variant": "#713700",
        "inverse-on-surface": "#ffede9",
        "on-primary-fixed-variant": "#82223e",
        "secondary-fixed": "#ffdcc5",
        "on-secondary": "#ffffff",
        "flavor-bocadillo": "#8e382b",
        "flavor-lulo": "#8c9628",
        "flavor-mora": "#7a1b38",
        "flavor-maracuya": "#e87b14"
      },
      boxShadow: {
        "elevation-1": "0 4px 20px -2px rgba(42,27,24,0.05), 0 1px 3px 0 rgba(42,27,24,0.03)",
        "elevation-2": "0 12px 32px -4px rgba(42,27,24,0.08), 0 2px 6px -1px rgba(42,27,24,0.04)",
        "elevation-3": "0 24px 48px -12px rgba(42,27,24,0.16)",
        "elevation-hover": "0 16px 32px -4px rgba(42,27,24,0.12)"
      },
      borderRadius: {
        "DEFAULT": "0.25rem",
        "md": "0.5rem",
        "lg": "0.75rem",
        "xl": "1rem",
        "2xl": "1.25rem",
        "3xl": "1.75rem",
        "full": "9999px"
      },
      spacing: {
        "margin": "3rem",
        "space-sm": "0.5rem",
        "space-xs": "0.25rem",
        "space-xl": "2.5rem",
        "gutter-mobile": "1rem",
        "gutter": "1.5rem",
        "space-lg": "1.5rem",
        "margin-mobile": "1.25rem",
        "space-md": "1rem"
      },
      fontFamily: {
        serif: ["EB Garamond", "serif"],
        display: ["EB Garamond", "serif"],
        sans: ["Montserrat", "sans-serif"],
        body: ["Montserrat", "sans-serif"]
      },
      fontSize: {
        "display-lg": ["56px", { "lineHeight": "64px", "letterSpacing": "-0.02em", "fontWeight": "500" }],
        "display-lg-mobile": ["40px", { "lineHeight": "48px", "letterSpacing": "-0.01em", "fontWeight": "500" }]
      }
    }
  }
};
