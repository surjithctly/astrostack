import { defineMiddleware } from 'astro/middleware'

const adminOrigin = import.meta.env.ADMIN_PROXY_ORIGIN ?? 'http://localhost:3001'

const proxyPrefixes = ['/admin', '/_next', '/api', '/graphql', '/graphql-playground']

function shouldProxy(pathname: string): boolean {
  return proxyPrefixes.some((p) => pathname === p || pathname.startsWith(`${p}/`))
}

export const onRequest = defineMiddleware(async (context, next) => {
  const url = new URL(context.request.url)

  if (!shouldProxy(url.pathname)) {
    return next()
  }

  const targetUrl = new URL(`${url.pathname}${url.search}`, adminOrigin)
  const method = context.request.method.toUpperCase()

  // Build request headers
  const reqHeaders = new Headers(context.request.headers)
  reqHeaders.delete('host')
  reqHeaders.delete('connection')
  reqHeaders.set('accept-encoding', 'identity') // Request uncompressed
  reqHeaders.set('x-forwarded-host', url.host)
  reqHeaders.set('x-forwarded-proto', url.protocol.replace(':', ''))

  const requestInit: RequestInit & { duplex?: 'half' } = {
    method,
    headers: reqHeaders,
    redirect: 'manual',
  }

  if (method !== 'GET' && method !== 'HEAD') {
    requestInit.body = context.request.body
    requestInit.duplex = 'half'
  }

  try {
    const proxyRes = await fetch(targetUrl, requestInit)

    // Buffer the response body
    const body = await proxyRes.arrayBuffer()

    // Copy response headers, removing problematic ones
    const resHeaders = new Headers()
    proxyRes.headers.forEach((value, key) => {
      const lk = key.toLowerCase()
      // Skip hop-by-hop and encoding headers
      if (
        lk === 'transfer-encoding' ||
        lk === 'content-encoding' ||
        lk === 'connection' ||
        lk === 'keep-alive'
      ) {
        return
      }
      resHeaders.set(key, value)
    })

    // Set correct content-length for buffered body
    resHeaders.set('content-length', String(body.byteLength))

    return new Response(body, {
      status: proxyRes.status,
      statusText: proxyRes.statusText,
      headers: resHeaders,
    })
  } catch (err) {
    console.error('[proxy error]', err)
    return new Response('Proxy error', { status: 502 })
  }
})
