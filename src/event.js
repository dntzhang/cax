class Event{
    constructor(){
        this.propagationStopped = false;
        this.stageX = null;
        this.stageY = null;
        this.pureEvent = null;
    }

    stopPropagation(){
        this.propagationStopped = true;
    }

}

export default Event;