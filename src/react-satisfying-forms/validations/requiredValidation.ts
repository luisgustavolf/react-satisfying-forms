import { IFieldValidator } from "../interface/iFieldValidator";

export const RequiredValidation: IFieldValidator = (value: any) => {
    return value ? undefined : 'This fied is required...'
}

export const DelayedRequiredValidation: IFieldValidator = (value: any) => {
    return new Promise((resolve) => {
        setTimeout(() => {
           resolve(value ? undefined : 'This fied is required...');
        }, 2000);
    });
}