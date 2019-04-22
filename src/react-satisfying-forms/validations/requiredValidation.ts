import { IFieldValidator } from "../interface/iFieldValidator";

export const requiredValidation: IFieldValidator = (value: any) => {
    return value ? undefined : 'This fied is required...'
}

export const delayedRequiredValidation: IFieldValidator = (value: any) => {
    let timerId: NodeJS.Timeout;
    const promise = new Promise<string | undefined>((resolve) => {
        timerId = setTimeout(() => {
            resolve(value == 'bob' ? undefined : `No Bob... was ${value}`);
         }, 2000);
    })
    
    return {
        promise: promise,
        interrupCallback: () => { clearTimeout(timerId) }
    }
}