import { IFieldValidator } from "../interfaces/iFieldValidator";
import { CancelableValidator } from "./cancelableValidation";

// Sync
export const requiredValidator: IFieldValidator = (value: any) => {
    return value ? undefined : 'Campo obrigatório...'
}

// Assync
export const delayedBobValidator: IFieldValidator = (value: any) => {
    return CancelableValidator((done, cancel) => {
        const timerId = setTimeout(() => {
            done(value == 'bob' ? undefined : `No Bob... was "${value}"`);
         }, 2000);
         
         cancel(() => { clearTimeout(timerId) })
    })
}