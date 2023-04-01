import { Subject } from 'rxjs';

class EventCenter {
  constructor() {
    this.subjects = []
  }

  getSubjects = () => {
    return this.subjects
  }

  getSubject = (subjectName) => {
    if (!(subjectName in this.subjects)) {
      let newSubject = new Subject()

      this.subjects[subjectName] = newSubject
    }
    return this.subjects[subjectName]
  }

  emitEvent = (action) => (data) => {
    const subject = this.getSubject(action)
    subject.next(data)
  }
}

export default EventCenter