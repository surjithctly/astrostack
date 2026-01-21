export type CacheProfile = {
  sMaxAge: number
  staleWhileRevalidate: number
}

const DEFAULT_PROFILE: CacheProfile = {
  sMaxAge: 600,
  staleWhileRevalidate: 86400,
}

export const cacheControlFor = (override: Partial<CacheProfile> = {}) => {
  const cache = {
    sMaxAge: override.sMaxAge ?? DEFAULT_PROFILE.sMaxAge,
    staleWhileRevalidate:
      override.staleWhileRevalidate ?? DEFAULT_PROFILE.staleWhileRevalidate,
  }
  return `public, max-age=0, s-maxage=${cache.sMaxAge}, stale-while-revalidate=${cache.staleWhileRevalidate}`
}

export const applyCacheControl = (headers: Headers, override: Partial<CacheProfile> = {}) => {
  headers.set('Cache-Control', cacheControlFor(override))
}
