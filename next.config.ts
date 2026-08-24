import { BASE_PATH } from "@/lib/basepath";
import type { NextConfig } from "next";


const nextConfig: NextConfig = {
 basePath: `${BASE_PATH}`,
assetPrefix: `${BASE_PATH}`,
};

export default nextConfig;
