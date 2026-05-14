export const GOOGLE_ACCOUNT_NOT_FOUND = 'google_account_not_found';

export const GOOGLE_ACCOUNT_NOT_FOUND_MESSAGE =
  "This Google account isn't registered yet. Please create an account first.";

export function buildGoogleAccountNotFoundUrl(basePath = '/login') {
  return `${basePath}?authError=${GOOGLE_ACCOUNT_NOT_FOUND}`;
}

export function isGoogleAccountNotFoundError(error) {
  const message = String(error || '').toLowerCase();

  return (
    message.includes(GOOGLE_ACCOUNT_NOT_FOUND) ||
    message.includes('no account found') ||
    message.includes('credentialssignin')
  );
}
