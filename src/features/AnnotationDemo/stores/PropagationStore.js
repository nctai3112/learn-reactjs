import create from 'zustand'

const usePropagationStore = create((set, get) => ({
  isPropagating: false,
  blockPropagation: false,

  setBlockPropagation: (value) => set({ blockPropagation: value }),
  setIsPropagating: (value) => set({ isPropagating: value }),
  getIsPropagating: () => get().isPropagating,

  propagationTask: {},
  setPropagationTask: (newConfig) => set({ propagationTask: newConfig }),
  getPropagationTask: () => get().propagationTask,

  cancelToken: null,
  setCancelToken: (token) => set({ cancelToken: token }),
  getCancelToken: () => get().cancelToken,

  localAnnotationStore: {},
  setLocalAnnotationStore: (newValue) => set({ localAnnotationStore: newValue }),
  getLocalAnnotationStore: () => get().localAnnotationStore,
  updateLocalAnnotationStore: (key, value) => set(state => ({
    localAnnotationStore: {
      ...state.localAnnotationStore,
      [key]: value
    }
  })),
}))

export default usePropagationStore