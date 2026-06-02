/** Instagram reel permalinks for the homepage Spotlight carousel. */
export const INSTAGRAM_SPOTLIGHT_REELS: string[] = [
  "https://www.instagram.com/reel/DXt58wOEywy/",
  "https://www.instagram.com/reel/DUs2-2nCErP/",
  "https://www.instagram.com/reel/DW89yCykxBR/",
  "https://www.instagram.com/reel/DXovOrgk-Ry/",
  "https://www.instagram.com/reel/DW6Vo3yEwuc/",
  "https://www.instagram.com/reel/DX_4nNKzy3b/",
  "https://www.instagram.com/reel/DXrVl6aiKT_/",
  "https://www.instagram.com/reel/DXUX5NSkxQH/",
];

export function instagramReelPermalink(url: string): string {
  try {
    const u = new URL(url);
    return `${u.origin}${u.pathname}`;
  } catch {
    return url;
  }
}
