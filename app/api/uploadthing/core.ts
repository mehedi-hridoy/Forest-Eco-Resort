import { createUploadthing, type FileRouter } from 'uploadthing/next';
import { cookies } from 'next/headers';
import { createHash } from 'node:crypto';

const f = createUploadthing();

// Helper: verify the forest_session cookie against the DB via internal API
async function verifySession(): Promise<boolean> {
  try {
    const cookieStore = await cookies();
    const sessionCookie = cookieStore.get('forest_session');
    if (!sessionCookie?.value) return false;

    const apiBase = process.env.API_INTERNAL_URL || 'http://127.0.0.1:4000';
    const res = await fetch(`${apiBase}/api/v1/auth/me`, {
      headers: { cookie: `forest_session=${sessionCookie.value}` },
    });
    if (!res.ok) return false;
    const { user } = await res.json();
    // Only content-capable roles can upload
    return ['Super Admin', 'Content Administrator'].includes(user?.role);
  } catch {
    return false;
  }
}

export const ourFileRouter = {
  // Used from the Media tab in the admin panel
  imageUploader: f({
    image: { maxFileSize: '8MB', maxFileCount: 1 },
  })
    .middleware(async () => {
      const ok = await verifySession();
      if (!ok) throw new Error('Unauthorized');
      return {};
    })
    .onUploadComplete(async ({ file }) => {
      // Return the URL back to the client
      return { url: file.ufsUrl || file.url, name: file.name };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
