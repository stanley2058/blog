import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
  experimental: {
    mdxRs: {
      mdxType: "gfm",
    },
    turbopackFileSystemCacheForDev: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "hackmd.io",
      },
    ],
  },
  cacheComponents: true,
  async headers() {
    return [
      {
        source: "/",
        headers: [
          {
            key: "Link",
            value: '</llms.txt>; rel="describedby"; type="text/markdown"',
          },
        ],
      },
      {
        source: "/articles/:slug",
        headers: [
          {
            key: "Link",
            value:
              '</articles/raw/:slug>; rel="describedby"; type="text/markdown"',
          },
        ],
      },
    ];
  },
  async redirects() {
    return [];
  },
  async rewrites() {
    return [
      {
        source: "/ph/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ph/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
    ];
  },
  skipTrailingSlashRedirect: true,
};

const withMDX = createMDX({
  extension: /\.(md|mdx)$/,
});

export default withMDX(nextConfig);
