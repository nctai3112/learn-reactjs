import RestConnector from '../connectors/RestConnector'

import ProjectClass from '../classes/ProjectClass'

class ProjectService {
  async getProjects() {
    return RestConnector.get(`/projects`)
      .then(response => response.data.map(data => ProjectClass.constructorFromServerData(data)))
  }

  async getProjectById(projectId) {
    const projectResponse = await RestConnector.get(`/projects?id=${projectId}`)
    const projectData = projectResponse.data[0]

    if (projectData) {
      return ProjectClass.constructorFromServerData(projectData)
    } else {
      return null
    }
  }

  createProject(data) {
    return RestConnector.post(`/projects`, {
      name: data.name,
      description: data.description,
    })
      .then(response => {
        return ProjectClass.constructorFromServerData(response.data)
      })
  }

  updateProject(newProject) {
    return RestConnector.put(`/projects`, {
      id: newProject.id,
      name: newProject.name,
      description: newProject.description,
    }).then(response => {
      return ProjectClass.constructorFromServerData(response.data)
    })
  }

  deleteProjectById(id) {
    return RestConnector.delete(`/projects?id=${id}`)
      .then((response) => {
        return response.data
      })
  }
}

export default new ProjectService()