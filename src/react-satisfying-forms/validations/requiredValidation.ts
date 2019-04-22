import { FieldValidator } from "../interface/fieldValidator";

export const requiredValidation: FieldValidator = (value: any) => {
    return value ? undefined : 'This fied is required...'
}

export const delayedRequiredValidation: FieldValidator = (value: any) => {
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