export function isAuthenticated() {
  return sessionStorage.getItem('isLoggedIn') === 'true'
}

export function logout() {
  sessionStorage.removeItem('isLoggedIn')
}
