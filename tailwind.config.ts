import type { Config } from "tailwindcss";
import plugin from "tailwindcss/plugin";

export default {
  plugins: [
    plugin(({ addVariant }) => addVariant("hocus", ["&:hover", "&:focus"])),
  ],
} satisfies Config;
