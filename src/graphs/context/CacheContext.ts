class CacheContextSingleton {
    private _context: number = 0

    get context() {
        return this._context
    }

    update() {
        this._context += 1
    }
}

export const CacheContext = new CacheContextSingleton()
