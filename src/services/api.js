const API_BASE_URL = 'http://localhost:3000/api';

export const generateCertificate = async (formData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/certificates`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
      // Handle HTTP errors
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.message || 'Failed to generate certificate');
    }

    return data;
  } catch (error) {
    console.error('Certificate generation error:', error);
    throw new Error(error.message || 'Failed to connect to server');
  }
};

export const downloadCertificate = async (filename, format = 'pdf') => {
  try {
    if (!filename) throw new Error('Filename is required');

    const response = await fetch(
      `${API_BASE_URL}/certificates/download/${filename}?format=${format}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Download failed with status: ${response.status}`);
    }

    const blob = await response.blob();
    const extension = format === 'pdf' ? 'pdf' : 'jpg';
    const downloadFilename = filename.replace(/\.[^/.]+$/, `.${extension}`);
    
    return {
      blob,
      url: URL.createObjectURL(blob),
      filename: downloadFilename
    };
  } catch (error) {
    console.error('Download error:', error);
    throw new Error('Failed to download certificate');
  }
};

// Add a cleanup function to revoke object URLs
export const revokeObjectURL = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url);
  }
};
