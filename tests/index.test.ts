// @ts-nocheck (ignoring the privite method)
import { KeeneticAPI } from '../src/index';

describe('KeeneticAPI', () => {
  let api: KeeneticAPI;

  beforeEach(() => {
    api = new KeeneticAPI('127.0.0.1', 'admin', 'password');
  });

  describe('constructor', () => {
    it('should initialize the API with the provided IP address, login, and password', () => {
      expect(api).toBeDefined();
      expect(api.ip).toBe('127.0.0.1');
      expect(api.login).toBe('admin');
      expect(api.pass).toBe('password');
    });

    it('should initialize the headers with the "Content-Type" set to "application/json"', () => {
      expect(api.headers.get('Content-Type')).toBe('application/json');
    });
  });

  describe('updateHeadersFromResponse', () => {
    it('should update the headers with the "Cookie" value from the response', () => {
      const response = new Response(null, { headers: { 'Set-Cookie': 'session=123456' } });
      api.updateHeadersFromResponse(response);
      expect(api.headers.get('Cookie')).toBe('session=123456');
    });

    it('should not update the headers if the response does not contain a "Set-Cookie" header', () => {
      const response = new Response(null, { headers: {} });
      api.updateHeadersFromResponse(response);
      expect(api.headers.get('Cookie')).toBeNull();
    });
  });

  describe('keenRequest', () => {
    it('should send a GET request with the correct URL and headers', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce(new Response());
      await api.keenRequest('status');
      expect(fetchSpy).toHaveBeenCalledWith('http://127.0.0.1/status', {
        headers: api.headers,
        method: 'GET',
      });
      fetchSpy.mockRestore();
    });

    it('should send a POST request with the correct URL, headers, and body', async () => {
      const fetchSpy = jest.spyOn(global, 'fetch').mockResolvedValueOnce(new Response());
      const postData = { name: 'John Doe' };
      await api.keenRequest('users', postData);
      expect(fetchSpy).toHaveBeenCalledWith('http://127.0.0.1/users', {
        headers: api.headers,
        method: 'POST',
        body: JSON.stringify(postData),
      });
      fetchSpy.mockRestore();
    });

    it('should update the headers from the response', async () => {
      const response = new Response(null, { headers: { 'Set-Cookie': 'session=123456' } });
      jest.spyOn(global, 'fetch').mockResolvedValueOnce(response);
      await api.keenRequest('status');
      expect(api.headers.get('Cookie')).toBe('session=123456');
    });

    it('should return the response', async () => {
      const response = new Response(null, { status: 200 });
      jest.spyOn(global, 'fetch').mockResolvedValueOnce(response);
      const result = await api.keenRequest('status');
      expect(result).toBe(response);
    });
  });

  describe('keenAuth', () => {
    it('should send an "auth" request and return true if the response status is 200', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValueOnce(new Response(null, { status: 200 }));
      const result = await api.keenAuth();
      expect(result).toBe(true);
    });

    it('should send an "auth" request with the login and password and return true if the response status is 200', async () => {
      const response = new Response(null, { status: 200 });
      jest.spyOn(global, 'fetch').mockResolvedValueOnce(
        new Response(null, {
          status: 401,
          headers: { 'X-NDM-Realm': 'realm', 'X-NDM-Challenge': 'challenge' },
        })
      );
      jest.spyOn(global, 'fetch').mockResolvedValueOnce(response);
      const result = await api.keenAuth();
      expect(result).toBe(true);
    });

    it('should send an "auth" request with the login and hashed password and return true if the response status is 200', async () => {
      const response = new Response(null, { status: 200 });
      jest.spyOn(global, 'fetch').mockResolvedValueOnce(
        new Response(null, {
          status: 401,
          headers: { 'X-NDM-Realm': 'realm', 'X-NDM-Challenge': 'challenge' },
        })
      );
      jest.spyOn(global, 'fetch').mockResolvedValueOnce(response);
      const result = await api.keenAuth();
      expect(result).toBe(true);
    });

    it('should send an "auth" request and return false if the response status is not 200', async () => {
      jest.spyOn(global, 'fetch').mockResolvedValue(new Response(null, { status: 401 }));
      const result = await api.keenAuth();
      expect(result).toBe(false);
    });
  });
});