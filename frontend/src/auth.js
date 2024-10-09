export function isAuthenticated() {
  return localStorage.getItem('isLoggedIn') === 'true'
}

export function logout() {
  localStorage.removeItem('isLoggedIn') // Clear login state
}
