import create from 'zustand'
import { filter, cloneDeep, find, findIndex } from 'lodash'

import LabelService from '../../../services/LabelService'
import AnnotationObjectService from '../../../services/AnnotationObjectService'
import AnnotationService from '../../../services/AnnotationService'
import AnnotationObjectClass from '../../../classes/AnnotationObjectClass'


const useAnnotationStore = create((set, get) => ({
  isLoading: {},
  setIsLoading: (name, value) => set(state => ({ isLoading: { ...state.isLoading, [name]: value } })),

  labels: [],
  loadAnnotationLabels: async (datasetId) => {
    const setIsLoading = get().setIsLoading
    setIsLoading("loading_dataset_labels", true)

    const labels = await LabelService.getLabelByDataset(datasetId)
    set({ labels })

    setIsLoading("loading_dataset_labels", false)
  },

  selectedObjectId: null,
  annotationObjects: [],
  loadAnnotationObjects: async (instanceId) => {
    const setIsLoading = get().setIsLoading
    setIsLoading("loading_annotation_objects", true)

    const annotationObjects = await AnnotationObjectService.getAnnotationObjectsByDataInstance(instanceId)
    set({ 
      selectedObjectId: null,
      annotationObjects 
    })

    setIsLoading("loading_annotation_objects", false)
  },
  setSelectedObjectId: (newObjectId) => set({ selectedObjectId: newObjectId }),
  getSelectedObjectId: () => get().selectedObjectId,
  getOrCreateSelectedObjectId: async (dataInstanceId, annotationType, properties = {}, attributes = {}) => {
    const selectedObjectId = get().selectedObjectId
    const annotationObjects = get().annotationObjects

    if (selectedObjectId) {
      return selectedObjectId
    } else {
      const newAnnotationObject = new AnnotationObjectClass('', dataInstanceId, '', annotationType, properties, attributes)
      await AnnotationObjectService.postAnnotationObject(newAnnotationObject)
      set({
        annotationObjects: [...annotationObjects, newAnnotationObject],
        selectedObjectId: newAnnotationObject.id,
      })
      return newAnnotationObject.id
    }
  },
  setAnnotationObjectProperties: (id, newProperties, commit = true) => {
    const annotationObjects = get().annotationObjects.map(object => {
      if (object.id !== id) {
        return object
      } else {
        let newAnnotation = cloneDeep(object)
        newAnnotation.updateProperties = newProperties
        if (commit) {
          AnnotationObjectService.postAnnotationObject(newAnnotation)
        }
        return newAnnotation
      }
    })

    set({ annotationObjects })
  },
  setAnnotationObjectAttributes: (id, newAttributes, commit = true) => {
    const annotationObjects = get().annotationObjects.map(object => {
      if (object.id !== id) {
        return object
      } else {
        let newAnnotation = cloneDeep(object)
        newAnnotation.updateAttributes = newAttributes
        if (commit) {
          AnnotationObjectService.postAnnotationObject(newAnnotation)
        }
        return newAnnotation
      }
    })

    set({ annotationObjects })
  },
  setAnnotationObjectLabel: (id, newLabelId) => {
    const annotationObjects = get().annotationObjects.map(object => {
      if (object.id !== id) {
        return object
      } else {
        let newAnnotationObject = cloneDeep(object)
        newAnnotationObject.labelId = newLabelId
        AnnotationObjectService.postAnnotationObject(newAnnotationObject)
        return newAnnotationObject
      }
    })

    set({ annotationObjects })
  },
  deleteAnnotationObject: (objectId) => {
    const selectedObjectId = get().selectedObjectId
    let newAnnotationObjects = get().annotationObjects
    let newAnnotations = get().annotations

    Object.keys(newAnnotations).forEach(annotationImageId => {
      newAnnotations[annotationImageId] = filter(newAnnotations[annotationImageId], ann => ann.annotationObjectId !== objectId)
    })
    newAnnotationObjects = filter(newAnnotationObjects, obj => obj.id !== objectId)

    set({ annotations: newAnnotations, annotationObjects: newAnnotationObjects })

    if (selectedObjectId === objectId) {
      set({ selectedObjectId: null })
    }
    AnnotationObjectService.deleteAnnotationObjectById(objectId)
  },

  annotations: {},
  loadAnnotations: async (instanceId) => {
    const setIsLoading = get().setIsLoading
    setIsLoading("loading_annotations", true)

    let annotationsObj = await AnnotationService.getAnnotationsByDataInstance(instanceId)
    let annotations = {}
    annotationsObj.forEach(ann => {
      if (!annotations[ann.annotationImageId]) {
        annotations[ann.annotationImageId] = []
      }
      annotations[ann.annotationImageId].push(ann)
    })
    set({ 
      drawingAnnotation: null,
      annotations 
    })
    setIsLoading("loading_annotations", false)
  },
  setAnnotation: async (annotationId, newEditingAnnotationData, options = {}) => {
    const { commitAnnotation = true, setKeyFrame = false } = options
    let annotations = cloneDeep(get().annotations)

    Object.keys(annotations).forEach(annotationImageId => {
      annotations[annotationImageId] = annotations[annotationImageId].map((annotation) => {
        if (annotation.id !== annotationId) {
          return annotation
        } else {

          annotation.updateData = newEditingAnnotationData
          if (setKeyFrame) {
            annotation.keyFrame = true
            annotation.isPropagating = false
          }
          if (commitAnnotation) {
            annotation.applyUpdate()
          }

          return annotation
        }
      })
    })

    set({ annotations })
  },
  setAnnotationWithImageId: async (annotationId, annotationImageId, newEditingAnnotationData, options = {}) => {
    const { commitAnnotation = true, setKeyFrame = false } = options
    let annotations = cloneDeep(get().annotations)

    annotations[annotationImageId] = annotations[annotationImageId].map((annotation) => {
      if (annotation.id !== annotationId) {
        return annotation
      } else {

        annotation.updateData = newEditingAnnotationData
        if (setKeyFrame) {
          annotation.keyFrame = true
          annotation.isPropagating = false
        }
        if (commitAnnotation) {
          annotation.applyUpdate()
        }

        return annotation
      }
    })

    set({ annotations })
  },
  updateAnnotation: async (newAnnotation, options = {}) => {
    const { commitAnnotation = true } = options
    let annotations = cloneDeep(get().annotations)

    let clonedAnnotation = cloneDeep(newAnnotation)

    try {
      if (commitAnnotation) {
        await clonedAnnotation.applyUpdate()
      }
    } catch (error) {
      console.log(error)
    }
    
    const annotationImageId = newAnnotation.annotationImageId
    annotations[annotationImageId] = annotations[annotationImageId].map((annotation) => {
      if (annotation.id !== newAnnotation.id) {
        return annotation
      } else {
        return clonedAnnotation
      }
    })

    set({ annotations })
    return "finish"
  },
  updateAnnotations: async (newAnnotationsDict, options = {}) => {
    const { commitAnnotation = true } = options
    let annotations = cloneDeep(get().annotations)

    try {
      if (commitAnnotation) {
        await Promise.all(Object.keys(newAnnotationsDict).map(id => newAnnotationsDict[id].applyUpdate()))
      }
    } catch (error) {
      console.log(error)
    }

    Object.keys(annotations).forEach(annotationImageId => {
      annotations[annotationImageId] = annotations[annotationImageId].map((annotation) => {
        if (!!newAnnotationsDict[annotation.id]) {
          return newAnnotationsDict[annotation.id]
        } else {
          return annotation
        }
      })
    })

    set({ annotations })
  },
  getAnnotationByAnnotationObjectId: (annotationObjectId, annotationImageId) => {
    let annotations = get().annotations

    return find(annotations[annotationImageId], { annotationObjectId })
  },
  deleteAnnotation: (deleteAnnotationId, options = {}) => {
    const { commitAnnotation = true } = options

    try {
      if (commitAnnotation) {
        AnnotationService.deleteAnnotationById(deleteAnnotationId)
      }
    } catch (error) {
      console.log(error)
    }

    let annotations = cloneDeep(get().annotations)

    Object.keys(annotations).forEach(annotationImageId => {
      annotations[annotationImageId] = filter(annotations[annotationImageId], (ann) => ann.id !== deleteAnnotationId)
    }) 

    set({ annotations })
  },
  cleanUpPropagatingAnnotations: () => {
    let annotations = cloneDeep(get().annotations)

    Object.keys(annotations).forEach(annotationImageId => {
      let newAnnotations = []
      annotations[annotationImageId].forEach((ann) => {
        if (!ann.isTemporary) {
          ann.isPropagating = false
          newAnnotations.push(ann)
        }
      })
      annotations[annotationImageId] = newAnnotations
    })
    set({ annotations })
  },


  drawingAnnotation: null,
  getDrawingAnnotation: () => get().drawingAnnotation,
  setDrawingAnnotation: (newDrawingAnnotation) => set({ drawingAnnotation: newDrawingAnnotation }),
  appendAnnotation: async (newAnnotation, options = {} ) => {
    const { commitAnnotation = true, awaitUpdate = true } = options
    try {
      if (commitAnnotation) {
        awaitUpdate ? await newAnnotation.applyUpdate() : newAnnotation.applyUpdate()
      }
    } catch (error) {
      console.log(error)
    }
    const annotations = cloneDeep(get().annotations)
    if (!annotations[newAnnotation.annotationImageId]) {
      annotations[newAnnotation.annotationImageId] = []
    }
    annotations[newAnnotation.annotationImageId] = [...annotations[newAnnotation.annotationImageId], newAnnotation]

    set({ annotations })
  },
  appendAnnotations: async (newAnnotations, options = {}) => {
    const { commitAnnotation = true } = options
    try {
      if (commitAnnotation) {
        await Promise.all(newAnnotations.map((ann) => ann.applyUpdate()))
      }
    } catch (error) {
      console.log(error)
    }
    const annotations = cloneDeep(get().annotations)

    newAnnotations.forEach(newAnnotation => {
      if (!annotations[newAnnotation.annotationImageId]) {
        annotations[newAnnotation.annotationImageId] = []
      }
      annotations[newAnnotation.annotationImageId] = [...annotations[newAnnotation.annotationImageId], newAnnotation]
    })

    set({ annotations })
  },


  /**
   * 
   * @param {*} newAnnotationsDict 
   * @param {*} options 
   * @returns {*} reaching keyFrame index or not propagating
   */
  updatePropagatedAnnotations: async (newAnnotations, options = {}) => {
    const { commitAnnotation = true } = options
    let annotations = cloneDeep(get().annotations)

    let breakFrameIndex = undefined
    newAnnotations.every((newAnnotation, index) => {
      const pos = findIndex(annotations[newAnnotation.annotationImageId], { id: newAnnotation.id })
      const oldAnnotation = annotations[newAnnotation.annotationImageId][pos]
      if (oldAnnotation.keyFrame || !oldAnnotation.isPropagating) {
        breakFrameIndex = index;
        return false;
      }

      annotations[newAnnotation.annotationImageId][pos] = newAnnotation
      return true;
    })


    if (commitAnnotation) {
      await Promise.all(newAnnotations.slice(0, breakFrameIndex).map(ann => ann.applyUpdate()))
    }

    set({ annotations })
    return breakFrameIndex;
  },
}))

export default useAnnotationStore