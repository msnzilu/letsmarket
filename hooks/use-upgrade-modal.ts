import { useSyncExternalStore } from 'react';

// Global state singleton
let isOpen = false;
const listeners = new Set<() => void>();

const store = {
    subscribe(listener: () => void) {
        listeners.add(listener);
        return () => listeners.delete(listener);
    },
    getSnapshot() {
        return isOpen;
    },
    onOpen() {
        isOpen = true;
        listeners.forEach(l => l());
    },
    onClose() {
        isOpen = false;
        listeners.forEach(l => l());
    }
};

export const useUpgradeModal = () => {
    const isModalOpen = useSyncExternalStore(
        store.subscribe,
        store.getSnapshot,
        () => false // getServerSnapshot for SSR
    );

    return {
        isOpen: isModalOpen,
        onOpen: store.onOpen,
        onClose: store.onClose
    };
};
