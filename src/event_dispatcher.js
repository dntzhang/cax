
class EventDispatcher{
    constructor(){
        this._listeners = null;
        this._captureListeners = null;
    }

    addEventListener (type, listener, useCapture) {
        var listeners;
        if (useCapture) {
            listeners = this._captureListeners = this._captureListeners||{};
        } else {
            listeners = this._listeners = this._listeners||{};
        }
        var arr = listeners[type];
        if (arr) { this.removeEventListener(type, listener, useCapture); }
        arr = listeners[type]; // remove may have deleted the array
        if (!arr) { listeners[type] = [listener];  }
        else { arr.push(listener); }
        return listener;
    }

    removeEventListener (type, listener, useCapture) {
        var listeners = useCapture ? this._captureListeners : this._listeners;
        if (!listeners) { return; }
        var arr = listeners[type];
        if (!arr) { return; }

        arr.every((item, index) =>{
            if (item == listener) {
                arr.splice(index, 1)
                return false
            }
        })
    }

    dispatchEvent (eventObj, bubbles, cancelable) {

    }

}

export default EventDispatcher;