import chroma from 'chroma-js';

module.exports = {
  defaultTheme: {
    extend: {
        colors: {
          primary: "#BB2649",
          contrast: "#59B224",
          "primary-dark": "#7A0C26",
          "primary-dark-hover": chroma("#7A0C26").brighten(0.35).hex(),
          "primary-light": "#DD7C93",
          "primary-light-hover": chroma("#DD7C93").darken(0.35).hex(),
        },
    },
  },
  themes: [
    {
      name: "green-theme",
      extend: {
        colors: {
          primary: "#50AE73",
          contrast: "#F0856E",
          "primary-dark": "#1A713A",
          "primary-dark-hover": chroma("#1A713A").brighten(0.35).hex(),
          "primary-light": "#97D7AF",
          "primary-light-hover": chroma("#97D7AF").darken(0.35).hex(),
        },
      },
    },
    {
      name: "purple-theme",
      extend: {
        colors: {
          primary: "#8D77CE",
          contrast: "#FFEB86",
          "primary-dark": "#3F2786",
          "primary-dark-hover": chroma("#3F2786").brighten(0.35).hex(),
          "primary-light": "#BEB1E7",
          "primary-light-hover": chroma("#BEB1E7").darken(0.35).hex(),
        },
      },
    },
    {
      name: "orange-theme",
      extend: {
        colors: {
          primary: "#EA9E57",
          contrast: "#37848F",
          "primary-dark": "#98581C",
          "primary-dark-hover": chroma("#98581C").brighten(0.35).hex(),
          "primary-light": "#F4C9A0",
          "primary-light-hover": chroma("#F4C9A0").darken(0.35).hex(),
        },
      },
    },
    {
      name: "pink-theme",
      extend: {
        colors: {
          primary: "#F8389E",
          contrast: "#B7FC39",
          "primary-dark": "#A1125E",
          "primary-dark-hover": chroma("#A1125E").brighten(0.35).hex(),
          "primary-light": "#FC90C9",
          "primary-light-hover": chroma("#FC90C9").darken(0.35).hex(),
        },
      },
    },
    {
      name: "fuuu-theme",
      extend: {
        colors: {
          primary: "#4A412A",
          contrast: "#202233",
          "primary-dark": "#30260E",
          "primary-dark-hover": chroma("#30260E").brighten(0.35).hex(),
          "primary-light": "#A5997D",
          "primary-light-hover": chroma("#A5997D").darken(0.35).hex(),
        },
      },
    },
    {
      name: "blue-theme",
      extend: {
        colors: {
          primary: "#5E81F4",
          contrast: "#FFC84E",
          "primary-dark": "#1F3C9F",
          "primary-dark-hover": chroma("#1F3C9F").brighten(0.35).hex(),
          "primary-light": "#A5B9FA",
          "primary-light-hover": chroma("#A5B9FA").darken(0.35).hex(),
        },
      },
    },
    // {
    //   name: "pride-theme",
    //   extend: {
    //     colors: {
    //       primary: "linear-gradient(180deg, #f00000, #f00000 16.67%, #ff8000 16.67%, #ff8000 33.33%, #ffff00 33.33%, #ffff00 50%, #007940 50%, #007940 66.67%, #4040ff 66.67%, #4040ff 83.33%, #a000c0 83.33%, #a000c0)",
    //       contrast: "linear-gradient(180deg, #f00000, #f00000 16.67%, #ff8000 16.67%, #ff8000 33.33%, #ffff00 33.33%, #ffff00 50%, #007940 50%, #007940 66.67%, #4040ff 66.67%, #4040ff 83.33%, #a000c0 83.33%, #a000c0)",
    //       "primary-dark": "linear-gradient(180deg, #f00000, #f00000 16.67%, #ff8000 16.67%, #ff8000 33.33%, #ffff00 33.33%, #ffff00 50%, #007940 50%, #007940 66.67%, #4040ff 66.67%, #4040ff 83.33%, #a000c0 83.33%, #a000c0)",
    //       "primary-dark-hover": "linear-gradient(180deg, #f00000, #f00000 16.67%, #ff8000 16.67%, #ff8000 33.33%, #ffff00 33.33%, #ffff00 50%, #007940 50%, #007940 66.67%, #4040ff 66.67%, #4040ff 83.33%, #a000c0 83.33%, #a000c0)",
    //       "primary-light": "linear-gradient(180deg, #f00000, #f00000 16.67%, #ff8000 16.67%, #ff8000 33.33%, #ffff00 33.33%, #ffff00 50%, #007940 50%, #007940 66.67%, #4040ff 66.67%, #4040ff 83.33%, #a000c0 83.33%, #a000c0)",
    //       "primary-light-hover": "linear-gradient(180deg, #f00000, #f00000 16.67%, #ff8000 16.67%, #ff8000 33.33%, #ffff00 33.33%, #ffff00 50%, #007940 50%, #007940 66.67%, #4040ff 66.67%, #4040ff 83.33%, #a000c0 83.33%, #a000c0)",
    //     },
    //   },
    // },
  ],
};
