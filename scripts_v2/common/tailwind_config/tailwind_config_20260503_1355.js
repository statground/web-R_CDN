window.tailwind = window.tailwind || {};
window.tailwind.config = {
  theme: {
    screens: {
      xl: { max: "1536px" },
      lg: { max: "1280px" },
      md: { max: "1024px" },
      sm: { max: "768px" },
      xs: { max: "640px" },
    },
    extend: {
      fontFamily: {
        sans: ["Noto Sans KR", "Apple SD Gothic Neo", "Malgun Gothic", "system-ui", "sans-serif"],
      },
    },
  },
};
