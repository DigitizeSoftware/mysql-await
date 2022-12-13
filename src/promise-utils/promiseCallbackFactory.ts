export function promiseCallbackFactory<T, E>(res: (result?: T) => void, rej: (reason: E) => void) {
    return (err: E | null) => {
        if (err != null) {
            rej(err);
        }
        else {
            res();
        }
    }
}
