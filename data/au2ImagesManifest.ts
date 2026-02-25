// Image manifest for African Union Site visual assets
// Lists filenames per subfolder. Paths are resolved relative to `/public/African Union Site- visual Assets`.

import { VATICAN_IMAGES_MANIFEST } from './vaticanImagesManifest';

export const AU2_IMAGES_MANIFEST: Record<string, string[]> = {
  'Building image': ['3 (4).jpg', '4 (4).jpg'],
  'Floor Plan': ['01.jpg', '1 (3).jpg'],
  'Type A 3 bedroom + maids': [
    'Enscape_2023-08-01-00-52-32.png',
    'Enscape_2023-08-01-01-05-34.png',
    'Enscape_2023-08-01-01-13-11.png',
    'Enscape_2023-08-16-19-02-12.png',
    'Enscape_2023-08-17-01-57-41.png',
    'Enscape_2023-08-17-22-57-29_Enscape scene 2.png',
    'Enscape_2023-08-17-22-57-29_Enscape scene 6.png',
    'Enscape_2023-08-18-16-48-42.png',
    'Enscape_2023-08-18-16-52-53.png',
    'Enscape_2023-08-18-23-46-32.png',
    'Enscape_2023-08-19-03-13-24.png',
    'Artboard 5.jpg',
  ],
  'Type B 3 bedroom + maids': [
    'Enscape_2023-08-01-00-59-11.png',
    'Enscape_2023-08-01-01-05-34.png',
    'Enscape_2023-08-01-03-25-21.png',
    'Enscape_2023-08-16-19-09-19.png',
    'Enscape_2023-08-17-16-14-10.png',
    'Enscape_2023-08-17-22-57-29_Enscape scene 1.png',
    'Enscape_2023-08-17-22-57-29_Enscape scene 3.png',
    'Enscape_2023-08-18-16-48-42.png',
    'Enscape_2023-08-18-16-52-53.png',
    'Enscape_2023-08-18-23-46-32.png',
    'Enscape_2023-08-19-03-13-24.png',
    'Artboard 7.jpg',
  ],
  'Type C 2 bedroom + maids': [
    'Enscape_2023-08-01-00-59-11.png',
    'Enscape_2023-08-01-03-25-21.png',
    'Enscape_2023-08-16-19-52-47.png',
    'Enscape_2023-08-17-16-16-41.png',
    'Enscape_2023-08-18-16-48-42.png',
    'Enscape_2023-08-18-16-52-53.png',
    'Enscape_2023-08-18-23-46-32.png',
    'Enscape_2023-08-19-03-13-24.png',
    'Artboard 4.jpg',
  ],
  'Type D 2 bedroom + maids': [
    'Enscape_2023-08-01-00-59-11.png',
    'Enscape_2023-08-01-01-05-34.png',
    'Enscape_2023-08-01-01-13-11.png',
    'Enscape_2023-08-01-03-18-37.png',
    'Enscape_2023-08-01-03-25-21.png',
    'Enscape_2023-08-16-20-13-37.png',
    'Enscape_2023-08-17-16-18-00.png',
    'Enscape_2023-08-18-16-48-42.png',
    'Enscape_2023-08-18-16-52-53.png',
    'Enscape_2023-08-18-23-46-32.png',
    'Enscape_2023-08-19-03-13-24.png',
    'Artboard 6.jpg',
  ],
  'Type E 2 bedroom + maids': [
    'Enscape_2023-08-01-00-52-32.png',
    'Enscape_2023-08-01-00-59-11.png',
    'Enscape_2023-08-01-01-05-34.png',
    'Enscape_2023-08-01-01-13-11.png',
    'Enscape_2023-08-16-20-31-33.png',
    'Enscape_2023-08-17-16-25-15.png',
    'Enscape_2023-08-18-16-48-42.png',
    'Enscape_2023-08-18-16-52-53.png',
    'Enscape_2023-08-18-23-46-32.png',
    'Enscape_2023-08-19-03-13-24.png',
    'Artboard 3.jpg',
  ],
};

export function buildPublicPaths(folder: string): string[] {
  const au2Files = AU2_IMAGES_MANIFEST[folder];
  if (au2Files) {
    const base = '/African Union Site- visual Assets/' + folder;
    return au2Files.map((f) => `${base}/${f}`);
  }

  const vaticanFiles = VATICAN_IMAGES_MANIFEST[folder];
  if (vaticanFiles) {
    const base = '/VATICAN-SITE/' + folder;
    return vaticanFiles.map((f) => {
      if (f.startsWith('/')) {
        return f;
      }

      const auMatch = findAuPathForFile(f);
      return auMatch ?? `${base}/${f}`;
    });
  }

  return [];
}

function findAuPathForFile(fileName: string): string | null {
  for (const [folder, files] of Object.entries(AU2_IMAGES_MANIFEST)) {
    if (files.includes(fileName)) {
      return `/African Union Site- visual Assets/${folder}/${fileName}`;
    }
  }

  return null;
}
