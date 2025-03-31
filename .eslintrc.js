module.exports = {
  extends: [
    "next/core-web-vitals",
    "plugin:prettier/recommended", // Enables eslint-plugin-prettier and eslint-config-prettier
  ],
  plugins: ["prettier"],
  rules: {
    "prettier/prettier": "error",
    "react/react-in-jsx-scope": "off",
    "react/prop-types": "off",
    "react/jsx-props-no-spreading": "off",
  },
};
