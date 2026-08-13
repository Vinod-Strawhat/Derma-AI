export const mockProfile = {
  isDemo: true,
  isNewUser: false,
  name: 'Demo User',
  email: 'demo@example.com',
  preferredLanguage: 'English',
  statusLabel: 'Demo Account',
  stats: {
    totalScans: 5,
    concernsTracked: 2,
    lastScan: 'Aug 8, 2026',
    comparisons: 1,
  },
}

export const newUserProfile = {
  isDemo: true,
  isNewUser: true,
  name: 'New User',
  email: 'new@example.com',
  preferredLanguage: 'English',
  statusLabel: 'Demo Account',
  stats: {
    totalScans: 0,
    concernsTracked: 0,
    lastScan: null,
    comparisons: 0,
  },
}