// app/api/upload/route.js
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request) {
    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const type = formData.get('type');
        const email = formData.get('email');

        if (!file || !type || !email) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Validate file type
        if (!file.type.startsWith('image/')) {
            return NextResponse.json({ error: 'Invalid file type' }, { status: 400 });
        }

        // Create unique filename
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop();
        const safeEmail = email.replace(/[^a-zA-Z0-9]/g, '_');
        const filename = `${safeEmail}_${type}_${timestamp}.${fileExtension}`;

        // Create upload directory if it doesn't exist
        const uploadDir = join(process.cwd(), 'public', 'uploads');
        if (!existsSync(uploadDir)) {
            await mkdir(uploadDir, { recursive: true });
        }

        // Convert file to buffer and save
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const filepath = join(uploadDir, filename);
        
        await writeFile(filepath, buffer);

        // Return the public URL
        const imageUrl = `/uploads/${filename}`;
        
        return NextResponse.json({ 
            success: true, 
            url: imageUrl,
            message: 'File uploaded successfully'
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: 'Failed to upload file' }, 
            { status: 500 }
        );
    }
}