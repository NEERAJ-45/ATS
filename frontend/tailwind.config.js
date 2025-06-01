// tailwind.config.js
module.exports = {
    content: ["./src/**/*.{js,jsx}"],
    theme: {
      extend: {
        animation: {
          "fade-in": "fadeIn 1s ease-out",
          "fade-in-fast": "fadeIn 0.3s ease-out",
          "zoom-in": "zoomIn 0.3s ease-out",
        },
        keyframes: {
          fadeIn: {
            from: { opacity: 0 },
            to: { opacity: 1 },
          },
          zoomIn: {
            from: { transform: "scale(0.95)", opacity: 0 },
            to: { transform: "scale(1)", opacity: 1 },
          },
        },
      },
    },
    plugins: [],
  };
  