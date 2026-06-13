/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Geist: tipografía distintiva pero profesional (no la genérica Inter).
        sans: ["Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        mono: ["Geist Mono", "ui-monospace", "monospace"],
      },
      colors: {
        // Paleta fría "slate" moderna: tinta gris-azulada nítida sobre un
        // fondo casi blanco frío. Más crisp y profesional (estilo SaaS) que
        // la versión cálida anterior. El acento índigo aporta el color de marca
        // y se complementa con una familia semántica para identificar acciones.
        ink: {
          DEFAULT: "#0f172a", // slate-900
          soft: "#475569", // slate-600
          faint: "#94a3b8", // slate-400
        },
        paper: "#f6f7f9", // gris muy claro y frío
        line: "#e6e9ef", // borde frío suave
        accent: {
          DEFAULT: "#7c6cff", // violeta brillante: botones primarios, activos
          deep: "#6a5af0", // violeta más profundo para hover/active
          soft: "#f0eefe", // violeta muy claro: fondos suaves del acento
          ring: "#7c6cff",
        },
        // Tonos del sidebar oscuro ("Midnight").
        midnight: {
          DEFAULT: "#0b1020", // fondo del sidebar (slate casi negro)
          soft: "#151b30", // superficies sutiles dentro del sidebar
          line: "#222a44", // bordes dentro del sidebar
        },
        // Familia semántica para identificar acciones por color (icon chips,
        // botones y badges). Cada acción tiene un color consistente.
        success: { DEFAULT: "#059669", soft: "#ecfdf5" }, // emerald-600 / 50
        info: { DEFAULT: "#2563eb", soft: "#eff6ff" }, // blue-600 / 50
        danger: "#e11d48", // rose-600
        // Nota: sky/amber/rose/violet/emerald se usan vía las escalas nativas
        // de Tailwind (sky-500, amber-50, etc.). No se redefinen como tokens
        // string porque eso sobrescribiría la escala numérica completa.
      },
      boxShadow: {
        // Sombras frías neutras, nítidas y discretas.
        card: "0 1px 2px rgba(15,23,42,0.04), 0 8px 24px -12px rgba(15,23,42,0.12)",
        focus: "0 0 0 3px rgba(124,108,255,0.18)",
      },
      borderRadius: {
        xl2: "1rem",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(8px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "scale-in": {
          "0%": { opacity: "0", transform: "scale(0.97)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        spin: {
          to: { transform: "rotate(360deg)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.16,1,0.3,1) both",
        "fade-in": "fade-in 0.2s ease-out both",
        "scale-in": "scale-in 0.2s cubic-bezier(0.16,1,0.3,1) both",
      },
    },
  },
  plugins: [],
};
