import { IFieldData } from "../interface/iFieldData";
import { IFieldValidator, FieldValidatorReturn, FieldValidatorAssyncReturn, FieldValidatorSyncReturn } from "../interface/iFieldValidator";

export class ValidationManager {
    private runningValidators: number
    private lastValdationResults: FieldValidatorReturn[]
    private reportedErrors: string[]

    constructor() {
        this.lastValdationResults = [];
        this.reportedErrors = [];
        this.runningValidators = 0
    }

    async validate(fieldData: IFieldData, validators: IFieldValidator[], onError: (errors: string[]) => void, onComplete: () => void) {
        this.terminateAssyncValidators()
        
        this.runningValidators++
        await Promise.all(this.executeValidators(fieldData, validators, onError));
        this.runningValidators--
        onComplete();
    }
    
    executeValidators(fieldData: IFieldData, validators: IFieldValidator[], onError: (error: string[]) => void) {
        this.reportedErrors = []
        this.lastValdationResults = [];

        return validators.map((validator) => {
            const execution = validator(fieldData.value);
            const executionResult = this.getValidatorResult(execution);
            this.lastValdationResults.push(execution);

            if (executionResult instanceof Promise) {
                return executionResult.then((error) => { this.handleError(error, onError) })
            } else {
                this.handleError(executionResult, onError)
                return Promise.resolve()
            }
        })
    }

    handleError(exection: FieldValidatorSyncReturn, onError: (error: string[]) => void) {
        this.reportedErrors.push(exection!)
        onError(this.reportedErrors);
    }

    getValidatorResult(validatorResult: FieldValidatorReturn) {
        if (validatorResult == undefined)
            return undefined
        
        const resultPromise = (validatorResult as FieldValidatorAssyncReturn).promise
        return resultPromise || validatorResult;
    }

    terminateAssyncValidators() {
        this.lastValdationResults.forEach((result) => {
            if (result) {
                const interrupCallback = (result as FieldValidatorAssyncReturn).interrupCallback
                interrupCallback && interrupCallback();
            }
        })
    }
}