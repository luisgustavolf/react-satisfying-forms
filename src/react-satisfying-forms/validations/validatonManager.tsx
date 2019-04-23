import { FieldState } from "../interfaces/fieldData";
import { FieldValidator, FieldValidatorResult, FieldValidatorAssyncResult, FieldValidatorSyncResult } from "../interfaces/fieldValidator";

export class ValidationManager {
    private runningValidators: number
    private lastValdationResults: FieldValidatorResult[]
    private reportedErrors: string[]

    constructor() {
        this.lastValdationResults = [];
        this.reportedErrors = [];
        this.runningValidators = 0
    }

    getRunningValidators() {
        return this.runningValidators;
    }

    async validate(fieldData: FieldState, validators: FieldValidator[], onError: (errors: string[]) => void, onComplete: () => void) {
        this.terminateAssyncValidators()
        
        this.runningValidators++
        await Promise.all(this.executeValidators(fieldData, validators, onError));
        this.runningValidators--
        onComplete();
    }
    
    executeValidators(fieldData: FieldState, validators: FieldValidator[], onError: (error: string[]) => void) {
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

    handleError(exection: FieldValidatorSyncResult, onError: (error: string[]) => void) {
        if (exection)
            this.reportedErrors.push(exection)
        
        onError(this.reportedErrors);
    }

    getValidatorResult(validatorResult: FieldValidatorResult) {
        if (validatorResult == undefined)
            return undefined
        
        const resultPromise = (validatorResult as FieldValidatorAssyncResult).promise
        return resultPromise || validatorResult;
    }

    terminateAssyncValidators() {
        this.lastValdationResults.forEach((result) => {
            if (result) {
                const interrupCallback = (result as FieldValidatorAssyncResult).cancel
                interrupCallback && interrupCallback();
            }
        })
    }
}