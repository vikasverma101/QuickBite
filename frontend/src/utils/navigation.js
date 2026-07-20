export const getRoleHome = (userData) => {
  if (userData?.role === 'owner') return '/admin'
  if (userData?.role === 'deliveryBoy') return '/delivery'
  return '/'
}
