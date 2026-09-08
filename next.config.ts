import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // รูปข่าวเก็บใน Supabase Storage — next/image ปฏิเสธโดเมนภายนอกที่ไม่ได้ระบุไว้
    // จำกัด pathname ไว้ที่ bucket สาธารณะ ไม่เปิดทั้งโดเมน
    remotePatterns: [
      {
        protocol: "https",
        hostname: "wltowmtbletifiezxxcx.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
  },
};

export default nextConfig;
