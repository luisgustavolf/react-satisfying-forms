import { IFieldValidator } from "../interface/iFieldValidator";

export const requiredValidation: IFieldValidator = (value: any) => {
    return value ? undefined : 'This fied is required...'
}

export const delayedRequiredValidation: IFieldValidator = (value: any) => {
    return new Promise((resolve) => {
        setTimeout(() => {
           resolve(value ? undefined : 'This user exists on the server...');
        }, 2000);
    });
}