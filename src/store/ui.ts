import { create } from 'zustand';

interface UIState {
    // Sidebar state
    sidebarOpen: boolean;
    setSidebarOpen: (open: boolean) => void;
    toggleSidebar: () => void;

    // Modal state
    modals: Record<string, boolean>;
    openModal: (modalId: string) => void;
    closeModal: (modalId: string) => void;
    closeAllModals: () => void;

    // Toast state
    toasts: Array<{
        id: string;
        type: 'success' | 'error' | 'warning' | 'info';
        message: string;
        duration?: number;
    }>;
    addToast: (
        toast: Omit<UIState['toasts'][0], 'id'>
    ) => void;
    removeToast: (id: string) => void;
    clearToasts: () => void;

    // Loading state
    loadingStates: Record<string, boolean>;
    setLoading: (key: string, loading: boolean) => void;
    isLoading: (key: string) => boolean;

    // Theme state
    theme: 'light' | 'dark' | 'system';
    setTheme: (theme: 'light' | 'dark' | 'system') => void;

    // Search state
    searchQuery: string;
    setSearchQuery: (query: string) => void;
    searchFilters: Record<string, any>;
    setSearchFilters: (
        filters: Record<string, any>
    ) => void;
    clearSearch: () => void;
}

export const useUIStore = create<UIState>((set, get) => ({
    // Sidebar state
    sidebarOpen: false,
    setSidebarOpen: (open) => set({ sidebarOpen: open }),
    toggleSidebar: () =>
        set((state) => ({
            sidebarOpen: !state.sidebarOpen,
        })),

    // Modal state
    modals: {},
    openModal: (modalId) =>
        set((state) => ({
            modals: { ...state.modals, [modalId]: true },
        })),
    closeModal: (modalId) =>
        set((state) => ({
            modals: { ...state.modals, [modalId]: false },
        })),
    closeAllModals: () => set({ modals: {} }),

    // Toast state
    toasts: [],
    addToast: (toast) => {
        const id = Math.random().toString(36).substr(2, 9);
        set((state) => ({
            toasts: [...state.toasts, { ...toast, id }],
        }));

        // Auto remove toast after duration
        const duration = toast.duration || 5000;
        setTimeout(() => {
            get().removeToast(id);
        }, duration);
    },
    removeToast: (id) =>
        set((state) => ({
            toasts: state.toasts.filter(
                (toast) => toast.id !== id
            ),
        })),
    clearToasts: () => set({ toasts: [] }),

    // Loading state
    loadingStates: {},
    setLoading: (key, loading) =>
        set((state) => ({
            loadingStates: {
                ...state.loadingStates,
                [key]: loading,
            },
        })),
    isLoading: (key) => get().loadingStates[key] || false,

    // Theme state
    theme: 'system',
    setTheme: (theme) => set({ theme }),

    // Search state
    searchQuery: '',
    setSearchQuery: (query) => set({ searchQuery: query }),
    searchFilters: {},
    setSearchFilters: (filters) =>
        set({ searchFilters: filters }),
    clearSearch: () =>
        set({ searchQuery: '', searchFilters: {} }),
}));
