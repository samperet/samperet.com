// The pixel size of a photo in public/, read at build time so a gallery can give every photo
// its own shape (no cropping) and reserve its space before it loads. Pages that use this are
// prerendered, so sharp only ever runs during the build.
import path from 'node:path';
import sharp from 'sharp';

export type Size = { width: number; height: number };

const sizes = new Map<string, Promise<Size | null>>();

export function sizeOf(src: string): Promise<Size | null> {
  if (!src.startsWith('/')) return Promise.resolve(null);
  let size = sizes.get(src);
  if (!size) {
    size = sharp(path.join(process.cwd(), 'public', src))
      .metadata()
      .then(({ width, height, orientation }) => {
        if (!width || !height) return null;
        // EXIF orientations 5–8 are turned a quarter, so the picture shows height × width.
        return orientation && orientation >= 5 ? { width: height, height: width } : { width, height };
      })
      .catch(() => null);
    sizes.set(src, size);
  }
  return size;
}
