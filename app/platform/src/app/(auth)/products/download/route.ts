import { NextRequest, NextResponse } from "next/server";
import fs from 'fs';
import path from "path";

const ensureDirExists = (dirPath: string) => {
    if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
    }
};

export async function GET(req:NextRequest) {
    const fileUrl = req.nextUrl.searchParams.get("url");
    if (!fileUrl) return NextResponse.json({error: "No data url"}, {status:400})
    
    try{
        const response = await fetch(fileUrl);
        if(!response.ok) throw new Error("Error when loading the file");
        const buffer = await response.arrayBuffer();
        const fileName = path.basename(fileUrl);

        const tempDir = path.join(process.cwd(), "temp");
        ensureDirExists(tempDir);

        const tempPath = path.join(tempDir, fileName);

        fs.writeFileSync(tempPath, Buffer.from(buffer));

        return new NextResponse(Buffer.from(buffer), {
            headers: {
                "Content-Type": response.headers.get("Content-Type") || "application/octet-stream",
                "Content-Disposition": `attachment; filename="${fileName}"`,
            }
        })
    } catch(error){
        console.error("Fehler beim Datei Download", error)
        return NextResponse.json({error: "Error when downloading the File"}, {status:500})
    }
      
}