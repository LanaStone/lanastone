/** Keep Lovable-hosted media reachable when the app runs on external hosts. */
export function hostedAssetUrl(asset: { url: string }): string {
  return new URL(asset.url, "https://lanastone.lovable.app").href;
}