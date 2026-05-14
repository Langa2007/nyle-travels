export function getUserInitials(user) {
  const firstName = user?.first_name || user?.firstName || '';
  const lastName = user?.last_name || user?.lastName || '';
  const fullName = user?.name || '';

  const initials = [firstName, lastName]
    .filter(Boolean)
    .map((part) => part.trim()[0])
    .join('');

  if (initials) return initials.toUpperCase();

  const nameInitials = fullName
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('');

  if (nameInitials) return nameInitials.toUpperCase();

  return (user?.email?.[0] || 'U').toUpperCase();
}

export function getUserDisplayName(user) {
  const firstName = user?.first_name || user?.firstName || '';
  const lastName = user?.last_name || user?.lastName || '';
  const fullName = [firstName, lastName].filter(Boolean).join(' ').trim();

  return fullName || user?.name || user?.email || 'Traveler';
}
