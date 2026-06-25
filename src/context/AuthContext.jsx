import { createContext, useState, useEffect, useCallback } from 'react';
import client from '../api/client';

export const AuthContext = createContext(null);

// Decode JWT payload (base64) without verifying signature
function decodeToken(token) {
  try {
    const base64Payload = token.split('.')[1];
    const decoded = JSON.parse(atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/')));
    return decoded;
  } catch {
    return null;
  }
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('prepmate_token'));
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('prepmate_user');
    if (stored) {
      try { return JSON.parse(stored); } catch { return null; }
    }
    return null;
  });
  const [hasResume, setHasResume] = useState(() => {
    return localStorage.getItem('prepmate_has_resume') === 'true';
  });
  const [userStats, setUserStats] = useState({
    total_interviews: 0,
    has_roadmap: false
  });
  const [loading, setLoading] = useState(false);

  const syncUserStatus = async () => {
    try {
      const res = await client.get('/api/user_status');
      
      setUserStats({
        total_interviews: res.data.total_interviews || 0,
        has_roadmap: res.data.has_roadmap || false
      });

      if (res.data.has_resume) {
        localStorage.setItem('prepmate_has_resume', 'true');
        setHasResume(true);
      } else {
        localStorage.removeItem('prepmate_has_resume');
        setHasResume(false);
      }
    } catch (err) {
      console.error('Failed to sync user status', err);
    }
  };

  // Decode user info from token if not already stored, and sync resume status
  useEffect(() => {
    if (token) {
      if (!user) {
        const decoded = decodeToken(token);
        if (decoded) {
          const userInfo = {
            id: decoded.id,
            name: decoded.name,
            email: decoded.email,
          };
          setUser(userInfo);
          localStorage.setItem('prepmate_user', JSON.stringify(userInfo));
        }
      }
      syncUserStatus();
    }
  }, [token]);

  const login = useCallback((newToken) => {
    const decoded = decodeToken(newToken);
    if (decoded) {
      const userInfo = {
        id: decoded.id,
        name: decoded.name,
        email: decoded.email,
      };
      localStorage.setItem('prepmate_token', newToken);
      localStorage.setItem('prepmate_user', JSON.stringify(userInfo));
      setToken(newToken);
      setUser(userInfo);
      // We don't need to manually call syncUserStatus here because setting the token 
      // will trigger the useEffect above which calls syncUserStatus()
    }
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('prepmate_token');
    localStorage.removeItem('prepmate_user');
    localStorage.removeItem('prepmate_has_resume');
    setToken(null);
    setUser(null);
    setHasResume(false);
    setUserStats({ total_interviews: 0, has_roadmap: false });
  }, []);

  const markResumeUploaded = useCallback(() => {
    localStorage.setItem('prepmate_has_resume', 'true');
    setHasResume(true);
  }, []);

  const markResumeDeleted = useCallback(() => {
    localStorage.removeItem('prepmate_has_resume');
    setHasResume(false);
  }, []);

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider value={{
      token,
      user,
      userStats,
      isAuthenticated,
      hasResume,
      loading,
      login,
      logout,
      markResumeUploaded,
      markResumeDeleted,
    }}>
      {children}
    </AuthContext.Provider>
  );
}
