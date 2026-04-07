import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server'

const isPortalRoute = createRouteMatcher([
  '/dashboard(.*)',
  '/reports(.*)',
  '/articles(.*)',
  '/playbook(.*)',
  '/assets(.*)',
  '/events(.*)',
  '/referrals(.*)',
  '/case-studies(.*)',
])

export default clerkMiddleware((auth, req) => {
  if (isPortalRoute(req)) auth().protect()
})

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
}
