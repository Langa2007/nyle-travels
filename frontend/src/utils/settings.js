export const getApiUrl = () => {
  const url = (process.env.NEXT_PUBLIC_API_URL || 'https://nyle-travels.onrender.com/api').replace(/\/+$/, '');
  return url;
};

export const fetchSettings = async (section) => {
  try {
    const apiUrl = getApiUrl();
    const res = await fetch(`${apiUrl}/settings/${section}`);
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
    const apiUrl = getApiUrl();
    const res = await fetch(`${apiUrl}/settings`);
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
