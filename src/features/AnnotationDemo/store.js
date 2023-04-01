import create from 'zustand'
import { cloneDeep, find, filter, remove } from 'lodash'

import { MODES, STAGE_PADDING, DEFAULT_TOOL_CONFIG, IMAGES_PER_PAGE } from './constants'
import getPointerPosition from './utils/getPointerPosition'
import loadImageFromURL from '../../utils/loadImageFromURL'
import resizeImage from '../../utils/resizeImage'


import ImageService from '../../services/ImageService'
import AnnotationService from '../../services/AnnotationService'
import DatasetService from '../../services/DatasetService'
import LabelService from '../../services/LabelService'

const useAnnotationStore = create((set, get) => ({
  datasetId: null,
  dataset: {},
  isLoading: {},
  stageRef: null,
  stageSize: { width: 0, height: 0 },
  activeMode: MODES.CURSOR.name,

  setStageRef: (newStageRef) => set({ stageRef: newStageRef }),
  setStageSize: (newStageSize) => set({ stageSize: newStageSize }),
  setActiveMode: (newActiveMode) => set(state => {
    const stageCursor = get(find(MODES, { name: state.activeMode }), 'cursor', 'default')
    state.stageRef.container().style.cursor = stageCursor

    return {
      activeMode: newActiveMode,
      drawingAnnotation: null,
      editingAnnotationId: null,
    }
  }),
  setIsLoading: (name, value) => set(state => ({ isLoading: { ...state.isLoading, [name]: value } })),


  annotations: [],
  imageId: null,
  image: null,
  imageList: [],
  selectedId: null,
  highlightId: null,

  setImageId: async (newImageId) => {
    if (!newImageId) {
      return set({
        imageId: null,
        image: null,
        annotations: [],
      })
    }
    const imageList = get().imageList
    const stage = get().stageRef
    const stageSize = get().stageSize
    const setIsLoading = get().setIsLoading
    const getAnnotationByImage = get().getAnnotationByImage

    setIsLoading("isLoadingImageData", true)

    const data = imageList.find(data => data.id === newImageId)
    let imageBlob = null
    const newImage = await loadImageFromURL(data.imageURL)
      .then(({ blob, base64 }) => {
        imageBlob = blob
        return resizeImage(base64, {
          maxWidth: stageSize.width - STAGE_PADDING,
          maxHeight: stageSize.height - STAGE_PADDING,
        })
      })

    stage.position({
      x: (stageSize.width - newImage.width) / 2,
      y: (stageSize.height - newImage.height) / 2,
    });
    stage.scale({ x: 1, y: 1 })

    set({
      imageId: newImageId,
      image: {
        obj: data,
        blob: imageBlob,
        ...newImage,
      },
      drawingAnnotation: null,
      editingAnnotationId: null,
    })

    setIsLoading("isLoadingImageData", false)

    await getAnnotationByImage(newImageId)
  },
  getImageId: () => get().imageId,
  getImage: () => get().image,

  currentMousePosition: { x: 0, y: 0 },
  drawingAnnotation: null,

  getAnnotations: () => get().annotations,
  setAnnotations: (newAnnotations) => set({ annotations: newAnnotations }),
  appendAnnotation: (newAnnotation) => {
    newAnnotation.applyUpdateAnnotation()
    set(state => ({ annotations: [...state.annotations, newAnnotation] }))
  },
  updateCurrentMousePosition: () => set(state => ({ currentMousePosition: getPointerPosition(state.stageRef) })),
  getCurrentMousePosition: () => get().currentMousePosition,
  setCurrentMousePosition: (newMousePosition) => set({ currentMousePosition: newMousePosition }),
  getDrawingAnnotation: () => get().drawingAnnotation,
  setDrawingAnnotation: (newDrawingAnnotation) => set({ drawingAnnotation: newDrawingAnnotation }),
  deleteAnnotation: (deleteAnnotationId) => {
    AnnotationService.deleteAnnotationById(deleteAnnotationId)

    set(state => ({
      annotations: filter(state.annotations, ann => ann.id !== deleteAnnotationId)
    }))
  },
  getAnnotationByImage: async (imageId) => {
    const setIsLoading = get().setIsLoading
    setIsLoading("annotations", true)

    try {
      const annotations = await AnnotationService.getAnnotationByImage(imageId)

      set({ annotations })
    } catch (error) {
      console.log(error)
    }

    setIsLoading("annotations", false)
  },

  editingAnnotationId: null,
  getEditingAnnotationId: () => get().editingAnnotationId,
  getEditingAnnotation: () => find(get().annotations, { id: get().editingAnnotationId }),
  setEditingAnnotationId: (newEditingAnnotationId) => {
    // Put the editing annotation to front of rendering layer
    let annotations = get().annotations
    let editingAnnotation = find(annotations, { id: newEditingAnnotationId })
    if (newEditingAnnotationId) {
      remove(annotations, { id: newEditingAnnotationId })
      annotations = [...annotations, editingAnnotation]

      set({
        editingAnnotationId: newEditingAnnotationId,
        annotations
      })
    } else {

      set({ editingAnnotationId: newEditingAnnotationId, })
    }
  },
  setEditingAnnotation: (newEditingAnnotationData, commitAnnotation) => {
    const editingAnnotationId = get().editingAnnotationId

    const annotations = get().annotations.map(annotation => {
      if (annotation.id !== editingAnnotationId) {
        return annotation
      } else {
        let newAnnotation = cloneDeep(annotation)
        newAnnotation.updateData = newEditingAnnotationData
        if (commitAnnotation) {
          newAnnotation.applyUpdateAnnotation()
        }
        return newAnnotation
      }
    })

    set({ annotations })
  },
  setAnnotationProperties: (id, newProperties) => {
    const annotations = get().annotations.map(annotation => {
      if (annotation.id !== id) {
        return annotation
      } else {
        let newAnnotation = cloneDeep(annotation)
        newAnnotation.updateProperties = newProperties
        return newAnnotation
      }
    })

    set({ annotations: annotations })
  },

  labels: [],
  setEditingAnnotationLabelId: (newLabelId) => set(state => ({
    annotations: state.annotations.map(annotation => {
      if (annotation.id !== state.editingAnnotationId) {
        return annotation
      } else {
        let newAnnotation = cloneDeep(annotation)
        newAnnotation.updateLabel = newLabelId
        newAnnotation.applyUpdateAnnotation()
        return newAnnotation
      }
    })
  })),
  setLabelProperties: (id, newProperties) => set(state => ({
    labels: state.labels.map(label => {
      if (label.id !== id) {
        return label
      } else {
        let newLabel = cloneDeep(label)
        newLabel.updateProperties = newProperties
        return newLabel
      }
    })
  })),

  toolConfig: DEFAULT_TOOL_CONFIG,
  setToolConfig: (newToolConfig) => set(state => ({ toolConfig: { ...state.toolConfig, [state.activeMode]: newToolConfig } })),
  getToolConfig: () => get().toolConfig[get().activeMode] || {},


  getDatasetData: async (projectId, datasetId, page) => {
    const setIsLoading = get().setIsLoading
    const getImagesOfDataset = get().getImagesOfDataset
    setIsLoading("isLoadingDatasetData", true)
    // load dataset
    const dataset = await DatasetService.getDatasetById(datasetId)

    // load images
    await getImagesOfDataset(datasetId, page)

    // load annotation label
    const annotationsLabels = await LabelService.getLabelByProject(projectId)

    set({
      dataset,
      labels: annotationsLabels,
    })
    setIsLoading("isLoadingDatasetData", false)
  },
  getImagesOfDataset: async (datasetId, page) => {
    const setIsLoading = get().setIsLoading
    setIsLoading("images", true)

    const imagesObj = await ImageService.getImagesByDataset(datasetId, page, IMAGES_PER_PAGE)

    set({ imageList: imagesObj })

    setIsLoading("images", false)
  }
}))

export default useAnnotationStore