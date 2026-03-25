import { create } from 'zustand';
import { persist } from 'zustand/middleware';
interface ProfileState {
  profile: Record<string, string>;
  savedShortcodes: Record<string, Record<string, string>>;
  activeSectionId: string;
  activeMobileView: 'sidebar' | 'engine' | 'preview' | 'export';
  isHydrated: boolean;
  hasDismissedIntro: boolean;
  hasDismissedResumeBanner: boolean;
  updateField: (fieldId: string, value: string) => void;
  setActiveSection: (id: string) => void;
  setMobileView: (view: 'sidebar' | 'engine' | 'preview' | 'export') => void;
  setHydrated: () => void;
  dismissIntro: () => void;
  setDismissedResumeBanner: (val: boolean) => void;
  resetProfile: () => void;
  importProfile: (data: Record<string, string>) => void;
  saveProfileSnapshot: (id: string, data: Record<string, string>) => void;
}
export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: {},
      savedShortcodes: {},
      activeSectionId: "professional-identity",
      activeMobileView: 'engine',
      isHydrated: false,
      hasDismissedIntro: false,
      hasDismissedResumeBanner: false,
      updateField: (fieldId, value) =>
        set((state) => ({
          profile: { ...state.profile, [fieldId]: value }
        })),
      setActiveSection: (id) => set({ activeSectionId: id }),
      setMobileView: (view) => set({ activeMobileView: view }),
      setHydrated: () => set({ isHydrated: true }),
      dismissIntro: () => set({ hasDismissedIntro: true }),
      setDismissedResumeBanner: (val) => set({ hasDismissedResumeBanner: val }),
      resetProfile: () => set({
        profile: {},
        hasDismissedIntro: false,
        hasDismissedResumeBanner: false,
        activeSectionId: "professional-identity",
        activeMobileView: 'engine'
      }),
      importProfile: (data) => set({ profile: data }),
      saveProfileSnapshot: (id, data) => set((state) => ({
        savedShortcodes: { ...state.savedShortcodes, [id]: data }
      })),
    }),
    {
      name: 'roleos-storage-v2',
      onRehydrateStorage: () => (state) => {
        state?.setHydrated();
      },
    }
  )
);