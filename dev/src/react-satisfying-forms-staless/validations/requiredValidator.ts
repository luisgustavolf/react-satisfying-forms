import { IFieldValidator } from "../interfaces/iFieldValidator";

// Sync
export const requiredValidator: IFieldValidator = (value: any) => {
    return value ? undefined : 'Campo obrigatório...'
}