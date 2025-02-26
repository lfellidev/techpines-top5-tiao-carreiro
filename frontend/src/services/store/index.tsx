import { create } from 'zustand';
import Cookies from 'js-cookie';

type UserTypes = {
  token: {
    value: string | undefined;
    set: (token: string) => void;
    clear: () => void;
  }

  user: {
    name: string | null;
    setName: (user: string) => void;	
    clear: () => void;
  },
  isAdmin: {
	value: string | null;
	set: (isAdmin: string) => void;
	clear: () => void;
  }  
};

const useData = create<UserTypes>((set) => ({
  token: {
    value: Cookies.get('token') || undefined,
    set: (token: string) => {
      Cookies.set('token', token);
      set((state) => ({
      token: {
        ...state.token,
        value: token,
      },
    }))
  },
    clear: () => {
      Cookies.remove('token');
      set((state) => ({
        token: {
          ...state.token,
          value: undefined,
        },
      }));
    },
  },
  user: {
    name: Cookies.get('userName') || null,
    setName: (user: string) => {
      Cookies.set('userName', user);
      set((state) => ({
        user: {
          ...state.user,
          name: user,
        },
      }));
    },
    clear: () => {
      Cookies.remove('userName');
      set((state) => ({
        token: {
          ...state.token,
          value: undefined,
        },
      }))
    },
  },

  isAdmin: {
	value: Cookies.get('isAdmin') || null,
	set: (isAdmin: string) => {
	  Cookies.set('isAdmin', String(isAdmin));
	  set((state) => ({
		isAdmin: {
		  ...state.isAdmin,
		  value: isAdmin,
		},
	  }));
	},
	clear: () => {
	  Cookies.remove('isAdmin');
	  set((state) => ({
		isAdmin: {
		  ...state.isAdmin,
		  value: null,
		},
	  }));
	},
  }
}));

export default useData;