import { NextRequest, NextResponse } from "next/server";
import path from "path";
import { S3Client, GetObjectCommand } from "@aws-sdk/client-s3";

export async function GET(req:NextRequest) {
    const fileUrl = req.nextUrl.searchParams.get("url");
    if (!fileUrl) return NextResponse.json({error: "No data url"}, {status:400})
    
    try{
        if(!process.env.ACCESS_KEY||!process.env.SECRET_ACCESS_KEY||!process.env.BUCKET_NAME||!process.env.S3_ENDPOINT){
            throw new Error("Tokens are empty")
        }
        const s3Client = new S3Client({
            region: "auto",
            endpoint: process.env.S3_ENDPOINT, // Cloudflare R2 Endpoint
            credentials: {
                accessKeyId: process.env.ACCESS_KEY,
                secretAccessKey: process.env.SECRET_ACCESS_KEY,
            },
        });

        //preparing filename to fetch from r2
        const fileName = path.basename(fileUrl);
        const urlObj = new URL(fileUrl);
        const fileKey = urlObj.pathname.substring(1);

        const params = {
            Bucket: process.env.BUCKET_NAME,
            Key: fileKey
        }

        const command = new GetObjectCommand(params);
        const response = await s3Client.send(command);

        // file-stream
        const stream = response.Body;
        if (!stream) throw new Error("No file body received!");

        // Stream Respose
        return new NextResponse(stream as ReadableStream, {
            headers: {
                "Content-Type": response.ContentType || "application/octet-stream",
                "Content-Disposition": `attachment; filename="${fileName}"`,
            },
        });
    } catch(error){
        console.error("Fehler beim Datei Download", error)
        return NextResponse.json({error: "Error when downloading the File"}, {status:500})
    }
      
}