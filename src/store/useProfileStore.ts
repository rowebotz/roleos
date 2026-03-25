import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface ProfileState {
  profile: Record<string, string>;
  activeSectionId: string;
  isHydrated: boolean;
  hasDismissedIntro: boolean;
  updateField: (fieldId: string, value: string) => void;
  setActiveSection: (id: string) => void;
  setHydrated: () => void;
  dismissIntro: () => void;
  resetProfile: () => void;
  importProfile: (data: Record<string, string>) => void;
}
export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: {},
      activeSectionId: "professional-identity",
      isHydrated: false,
      hasDismissedIntro: false,
      updateField: (fieldId, value) =>
        set((state) => ({
          profile: { ...state.profile, [fieldId]: value }
        })),
      setActiveSection: (id) => set({ activeSectionId: id }),
      setHydrated: () => set({ isHydrated: true }),
      dismissIntro: () => set({ hasDismissedIntro: true }),
      resetProfile: () => set({ profile: {}, hasDismissedIntro: false }),
      importProfile: (data) => set({ profile: data }),
    }),
    {
      name: 'roleos-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);