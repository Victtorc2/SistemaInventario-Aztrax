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
        // Paleta cálida y amigable: tinta con matiz suave (no gris frío),
        // fondo crema y un acento índigo agradable. Mantiene el minimalismo
        // pero resulta más cercano y menos severo que el negro puro.
        ink: {
          DEFAULT: "#2e2a3f", // índigo muy oscuro en vez de negro
          soft: "#56516b",
          faint: "#8b86a0",
        },
        paper: "#faf8fc", // blanco cálido con leve tinte lila
        line: "#ebe7f2", // borde suave en la misma familia
        accent: {
          DEFAULT: "#6366f1", // indigo-500: botones primarios, activos
          soft: "#eef2ff", // indigo-50: fondos suaves del acento
          ring: "#6366f1",
        },
        // Acentos secundarios para variedad amigable (uso puntual).
        coral: "#fb7185", // rose-400
        sky: "#38bdf8", // sky-400
        amber: "#f59e0b",
        danger: "#e11d48", // rose-600, coherente con la paleta cálida
      },
      boxShadow: {
        // Sombras ligeras con leve tinte del acento, estilo dashboard moderno.
        card: "0 1px 2px rgba(99,102,241,0.04), 0 8px 24px -12px rgba(99,102,241,0.18)",
        focus: "0 0 0 3px rgba(99,102,241,0.15)",
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
