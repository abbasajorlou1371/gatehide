import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  const { filename } = await context.params;

  // Only allow .txt files
  if (!filename.endsWith('.txt')) {
    return NextResponse.json(
      { error: 'File not found' },
      { status: 404 }
    );
  }

  // Prevent directory traversal attacks
  if (filename.includes('..') || filename.includes('/') || filename.includes('\\')) {
    return NextResponse.json(
      { error: 'Invalid filename' },
      { status: 400 }
    );
  }

  try {
    // Read file from public/verification directory
    const filePath = join(process.cwd(), 'public', 'verification', filename);
    const fileContent = await readFile(filePath, 'utf-8');

    // Return the file content with appropriate headers
    return new NextResponse(fileContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Cache-Control': 'public, max-age=3600',
      },
    });
  } catch {
    // File not found or error reading file
    return NextResponse.json(
      { error: 'File not found' },
      { status: 404 }
    );
  }
}

