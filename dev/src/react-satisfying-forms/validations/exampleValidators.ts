import { FieldValidator } from "../interfaces/fieldValidator";
import { CancelableValidator } from "./cancelableValidation";

// Sync
export const requiredValidator: FieldValidator = (value: any) => {
    return value ? undefined : 'Campo obrigatório...'
}

// Assync
export const delayedBobValidator: FieldValidator = (value: any) => {
    return CancelableValidator((done, cancel) => {
        const timerId = setTimeout(() => {
            done(value === 'bob' ? undefined : `No Bob... was "${value}"`);
         }, 2000);
         
         cancel(() => { clearTimeout(timerId) })
    })
}