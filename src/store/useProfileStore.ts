import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface ProfileState {
  profile: Record<string, string>;
  activeSectionId: string;
  isHydrated: boolean;
  hasDismissedIntro: boolean;
  hasDismissedResumeBanner: boolean;
  updateField: (fieldId: string, value: string) => void;
  setActiveSection: (id: string) => void;
  setHydrated: () => void;
  dismissIntro: () => void;
  setDismissedResumeBanner: (val: boolean) => void;
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
      hasDismissedResumeBanner: false,
      updateField: (fieldId, value) =>
        set((state) => ({
          profile: { ...state.profile, [fieldId]: value }
        })),
      setActiveSection: (id) => set({ activeSectionId: id }),
      setHydrated: () => set({ isHydrated: true }),
      dismissIntro: () => set({ hasDismissedIntro: true }),
      setDismissedResumeBanner: (val) => set({ hasDismissedResumeBanner: val }),
      resetProfile: () => set({ 
        profile: {}, 
        hasDismissedIntro: false, 
        hasDismissedResumeBanner: false,
        activeSectionId: "professional-identity" 
      }),
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