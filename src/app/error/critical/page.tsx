// app/error/critical/page.tsx
"use client";

import { BASE_PATH } from "@/lib/basepath";
import Image from "next/image";

export default function CriticalErrorPage() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 text-center">
            <Image
                src={`${BASE_PATH}/hmm.gif`}
                alt="Server bingung"
                width={200}
                height={200}
                unoptimized // wajib supaya animasi GIF tidak dimatikan image optimizer
                priority
            />
            <h1 className="mt-4 text-2xl font-semibold text-gray-900">
                Layanan Sedang Gangguan
            </h1>
            <p className="mt-2 text-gray-500 max-w-md">
                Server tidak dapat terhubung ke database. Silakan coba lagi beberapa saat lagi.
            </p>
            <button
                onClick={() => window.location.reload()}
                className="mt-6 rounded-md bg-black px-4 py-2 text-sm text-white hover:bg-gray-800"
            >
                Coba Lagi
            </button>
        </div>
    );
}