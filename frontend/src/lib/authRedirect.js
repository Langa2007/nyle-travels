const HOME_PATH = '/';

export function isBookingRedirect(path = '') {
  if (!path || typeof path !== 'string') return false;

  try {
    const url = path.startsWith('http') ? new URL(path) : new URL(path, 'http://nyle.local');
    const pathname = url.pathname.toLowerCase();

    return (
      pathname === '/booking' ||
      pathname.startsWith('/booking/') ||
      pathname === '/bookings' ||
      pathname.startsWith('/bookings/') ||
      pathname === '/dashboard/bookings' ||
      pathname.startsWith('/dashboard/bookings/')
    );
  } catch {
    return false;
  }
}

export function getPostAuthRedirect(candidate) {
  if (!candidate || !isBookingRedirect(candidate)) {
    return HOME_PATH;
  }

  try {
    const url = candidate.startsWith('http') ? new URL(candidate) : new URL(candidate, 'http://nyle.local');
    return `${url.pathname}${url.search}${url.hash}`;
  } catch {
    return HOME_PATH;
  }
}
