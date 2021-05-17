class Observer {
    #state = null
    #callbacks = null
    #observers = null
    constructor(source, state = {}) {
        const handler = {
            set: (target, prop, receiver) => {
                target[prop] = receiver
                for (let i = 0; i < this.#callbacks.length; i++) {
                    if (this.#callbacks[i]) {
                        this.#callbacks[i](this.#observers[i])
                    }
                }
                return true
            },
        }
        this.#observers = []
        this.#callbacks = []
        this.#state = new Proxy(state, handler)
        Object.entries(state).forEach(([key]) => {
            Object.defineProperty(source, key, {
                get: () => {
                    return this.#state[key]
                },
                set: (value) => {
                    this.#state[key] = value
                },
            })
        })
    }
    subscribe(observer, callback = null) {
        if (observer.length) {
            observer.forEach((observer) => {
                observer.state = this.#state
                this.#observers.push(observer)
                this.#callbacks.push(callback)
            })
            return
        }
        this.#observers.push(observer)
        this.#callbacks.push(callback)
    }
}
