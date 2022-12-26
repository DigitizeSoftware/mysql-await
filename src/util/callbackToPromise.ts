export function callbackToPromise<E>(resolve: () => void, reject: (reason: E) => void) {
    return (err: E) => {
        if (err == null) {
            resolve();
        }
        else {
            reject(err);
        }
    }
}
