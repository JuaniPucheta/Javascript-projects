onmessage = async event => {
    const { code, data, duration } = event.data

    let result
    try {
        result = await eval(`(async () => {
            let VAR__ops = 0;
            let VAR__start = Date.now();
            let VAR__end = VAR__start + ${duration};
            ${data};

            while (Date.now() < VAR__end) {
            ${code};
            VAR__ops++;
            }

            return VAR__ops
        })()`) // IIFE (Immediately Invoked Function Expression)
    } catch (e) {
        result = 0
        console.error(e)
    }

    postMessage(result)
}