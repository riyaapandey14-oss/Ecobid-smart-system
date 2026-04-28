export const AuthService = {
  getUsers: () => {
    try {
      const stored = localStorage.getItem('eco_users');
      if (stored) {
        return JSON.parse(stored);
      }
      return [];
    } catch {
      return [];
    }
  },

  register: (userData: any) => {
    const users = AuthService.getUsers();
    // Check if email already exists
    if (users.find((u: any) => u.email === userData.email)) {
      throw new Error('Email already registered');
    }
    
    // Add default metadata
    const newUser = {
        ...userData,
        type: 'Recycler', // Default type for self-registration
        status: 'active',
        joinDate: new Date().toISOString().split('T')[0]
    };

    users.push(newUser);
    localStorage.setItem('eco_users', JSON.stringify(users));
    return true;
  },

  login: (identifier: string, password: string) => {
    // Hardcoded Admin Credentials
    if ((identifier === 'admin' || identifier === 'admin@ecobid.com') && password === 'admin123') {
      return { success: true, role: 'admin' as const };
    }

    const users = AuthService.getUsers();
    // Allow login with email or phone
    const user = users.find((u: any) => (u.email === identifier || u.phone === identifier) && u.password === password);
    
    if (user) {
      if (user.status === 'disabled') {
        return { success: false, error: 'Account is disabled. Contact Admin.' };
      }
      return { success: true, role: 'user' as const, user };
    }

    return { success: false, error: 'Invalid email or password' };
  },

  updateUserStatus: (email: string, status: 'active' | 'disabled') => {
    const users = AuthService.getUsers();
    const index = users.findIndex((u: any) => u.email === email);
    if (index !== -1) {
      users[index].status = status;
      localStorage.setItem('eco_users', JSON.stringify(users));
      return true;
    }
    return false;
  }
};