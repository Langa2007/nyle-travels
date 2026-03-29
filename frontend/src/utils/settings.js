import { buildApiUrl } from '@/lib/api-base';

export const getApiUrl = () => {
  return buildApiUrl();
};

export const fetchSettings = async (section) => {
  try {
    const res = await fetch(buildApiUrl(`/settings/${section}`), { cache: 'no-store' });
    const result = await res.json();
    
    if (result.status === 'success' && result.data) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch settings for ${section}:`, error);
    return null;
  }
};

export const fetchAllSettings = async () => {
  try {
    const res = await fetch(buildApiUrl('/settings'), { cache: 'no-store' });
    const result = await res.json();
    
    if (result.status === 'success' && result.data) {
      return result.data;
    }
    return null;
  } catch (error) {
    console.error(`Failed to fetch all settings:`, error);
    return null;
  }
};
