import { create } from "zustand";

type UiState = {
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;

  isProductModalOpen: boolean;
  openProductModal: () => void;
  closeProductModal: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  isCartOpen: false,
  openCart: () => set({ isCartOpen: true }),
  closeCart: () => set({ isCartOpen: false }),

  isProductModalOpen: false,
  openProductModal: () => set({ isProductModalOpen: true }),
  closeProductModal: () => set({ isProductModalOpen: false }),
}));