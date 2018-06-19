class Event {
  constructor () {
    this.propagationStopped = false
    this.stageX = null
    this.stageY = null
    this.pureEvent = null
  }

  stopPropagation () {
    this.propagationStopped = true
  }

  preventDefault () {
    this.pureEvent.preventDefault()
  }
}

export default Event
