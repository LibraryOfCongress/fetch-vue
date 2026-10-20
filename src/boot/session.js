import { boot } from 'quasar/wrappers'
import { useUserStore } from '@/stores/user-store'

// Restore the user session from the HttpOnly auth cookie on app start.
//
// After an SSO redirect (or a returning user with a still-valid cookie) the JWT
// lives in an HttpOnly cookie the SPA can't read. The only way to know whether
// we're authenticated is to ask the API: GET /auth/me with the cookie attached.
// A 200 means the cookie is valid, so we hydrate the user store; a 401 just means
// we're anonymous and stay logged out.
//
// This is what makes cookie-based SSO actually log the user in: the backend sets
// the cookie and redirects here, but nothing else in the app calls /auth/me.
export default boot(async () => {
  // Already hydrated (e.g. fresh internal login this session) — nothing to do.
  if (localStorage.getItem('user')) {
    return
  }

  const userStore = useUserStore()
  try {
    // 'Sso' skips the credential POST and just verifies the cookie via /auth/me.
    await userStore.patchLogin({}, 'Sso')
  } catch (e) {
    // Expected for anonymous visitors / expired cookie — not an error to surface.
  }
})
