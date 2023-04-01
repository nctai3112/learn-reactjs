import create from 'zustand'

import getPointerPosition from '../utils/getPointerPosition'

import { MODES, DEFAULT_TOOL_CONFIG } from '../constants'

const useGeneralStore = create((set, get) => ({
  isLoading: {},
  setIsLoading: (name, value) => set(state => ({ isLoading: { ...state.isLoading, [name]: value } })),

  stage: null,
  stageSize: { width: 0, height: 0 },
  renderingSize: { width: 1, height: 1 },
  setStage: (newStage) => set({ stage: newStage }),
  setStageSize: (newStageSize) => set({ stageSize: newStageSize }),
  setRenderingSize: (newRenderingSize) => set({ renderingSize: newRenderingSize }),
  getRenderingSize: () => get().renderingSize,
  
  activeMode: MODES.EDIT.name,
  setActiveMode: (newMode) => set({ activeMode: newMode }),

  toolConfig: DEFAULT_TOOL_CONFIG,
  setToolConfig: (newToolConfig) => set(state => ({ toolConfig: { ...state.toolConfig, [state.activeMode]: newToolConfig } })),
  getToolConfig: () => get().toolConfig[get().activeMode] || {},

  currentMousePosition: { x: 0, y: 0 },
  updateCurrentMousePosition: () => set(state => ({ currentMousePosition: getPointerPosition(state.stage) })),
  getCurrentMousePosition: () => get().currentMousePosition,
}))

export default useGeneralStore