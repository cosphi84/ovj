// components/Loading.tsx
"use client";

import { BASE_PATH } from "@/lib/basepath";
import Image from "next/image";

interface LoadingProps {
    fullScreen?: boolean;
    text?: string;
}

export default function Loading({ fullScreen = false, text = "Loading..." }: LoadingProps) {
    return (
        <div
            className={
                fullScreen
                    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm"
                    : "flex flex-col items-center justify-center py-8"
            }
        >
            <Image
                src={`${BASE_PATH}/loading.gif`}
                alt="Loading"
                width={397}
                height={283}
                unoptimized // wajib, supaya animasi GIF tidak dimatikan oleh image optimizer Next.js
                priority
            />
            {text && <p className="mt-2 text-sm text-gray-500">{text}</p>}
        </div>
    );
}