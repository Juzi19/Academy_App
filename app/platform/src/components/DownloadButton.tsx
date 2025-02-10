"use client";

import { useState } from "react";

export default function DownloadButton({ fileUrl }: { fileUrl: string }) {
    const [loading, setLoading] = useState(false);

    async function downloadFile() {
        setLoading(true);
        try {
            const apiUrl = `/products/download?url=${encodeURIComponent(fileUrl)}`;
            const response = await fetch(apiUrl);
            const blob = await response.blob();
            const blobUrl = window.URL.createObjectURL(blob);

            const link = document.createElement("a");
            link.href = blobUrl;
            link.download = fileUrl.split("/").pop() || "datei";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(blobUrl);
        } catch (error) {
            console.error("Fehler beim Download:", error);
        } finally {
            setLoading(false);
        }
    }

    return (
        <button onClick={downloadFile} className="bg-black font-bold text-white px-4 py-2 rounded hover:opacity-80">
            {loading ? "Lade..." : "Datei herunterladen"}
        </button>
    );
}
