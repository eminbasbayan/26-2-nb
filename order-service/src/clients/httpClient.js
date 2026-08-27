class ServiceClientError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ServiceClientError';
    this.status = status;
  }
}

const request = async (baseUrl, path, options = {}) => {
  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: options.headers || {},
      signal: AbortSignal.timeout(5000),
    });
  } catch (error) {
    throw new ServiceClientError('Bağımlı servise ulaşılamadı', 502);
  }

  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new ServiceClientError(body.message || 'Bağımlı servis hatası', response.status);
  }
  return body;
};

module.exports = { request, ServiceClientError };
