export function isAuthenticated() {
  return sessionStorage.getItem('isLoggedIn') === 'true'
}

export function logout() {
  localStorage.removeItem('isLoggedIn')
}
