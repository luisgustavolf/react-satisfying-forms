import { FieldValidator } from "../interface/fieldValidator";
import { CancelableValidation } from "./cancelableValidation";

export const requiredValidation: FieldValidator = (value: any) => {
    return value ? undefined : 'This fied is required...'
}

export const delayedBobValidation: FieldValidator = (value: any) => {
    return CancelableValidation((done, cancel) => {
        const timerId = setTimeout(() => {
            done(value == 'bob' ? undefined : `No Bob... was "${value}"`);
         }, 2000);
         
         cancel(() => { clearTimeout(timerId) })
    })
}