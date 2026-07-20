// Determine API URL based on environment
const getApiUrl = () => {
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL
  }
  if (typeof window !== 'undefined') {
    const isDevelopment = window.location.hostname === 'localhost'
    return isDevelopment ? 'http://localhost:5000' : window.location.origin
  }
  return 'http://localhost:5000'
}

export const serverUrl = getApiUrl()
export const geoApiKey = import.meta.env.VITE_GEOAPIKEY || ''
export const razorpayKeyId = import.meta.env.VITE_RAZORPAY_KEY_ID || ''
export const firebaseApiKey = import.meta.env.VITE_FIREBASE_APIKEY || ''
