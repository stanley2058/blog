import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  plugins: [
    plugin(({ addVariant }) => addVariant("hocus", ["&:hover", "&:focus"])),
  ],
} satisfies Config;
