import { CancelableValidator } from "./cancelableValidation";

it('Performs the validation', (done) => {
    const delay = 100;
    const doneFn = jest.fn()
    
    const validation = CancelableValidator((done) => {
        setTimeout(() => {
            done("ok")
        }, delay);
    })

    validation.promise.then((value) => { doneFn() })

    setTimeout(() => {
        expect(doneFn).toBeCalled()
        done()
    }, delay + 50);
});

it('Cancels the validation', (testDone) => {
    const delay = 100;
    const doneFn = jest.fn()
    const cancelFn = jest.fn()
    
    const validation = CancelableValidator((done, cancel) => {
        const timer = setTimeout(() => {
            done("ok")
        }, delay);

        cancel(() => { cancelFn(); clearTimeout(timer) })
    })

    validation.promise.then(() => { doneFn() })
    validation.cancel()
    
    setTimeout(() => {
        validation.promise.then((value) => { doneFn() })
        expect(cancelFn).toBeCalled()
        expect(doneFn).not.toBeCalled()
        testDone()
    }, delay + 50);
});





export default {}