import { FieldStatusWithValue } from "../interfaces/fieldStatusWithValue";
import { FieldValidator, FieldValidatorResult, FieldValidatorAssyncResult, FieldValidatorSyncResult } from "../interfaces/fieldValidator";

export class FieldValidationManager {
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

    async validate(value: any, validators: FieldValidator[], onError: (errors: string[]) => void, onComplete: (errors?: string[]) => void) {
        this.terminateAssyncValidators()
        
        this.runningValidators++
        await Promise.all(this.executeValidators(value, validators, onError));
        this.runningValidators--
        onComplete(this.reportedErrors);
    }
    
    private executeValidators(value: any, validators: FieldValidator[], onError: (error: string[]) => void) {
        this.reportedErrors = []
        this.lastValdationResults = [];

        return validators.map((validator) => {
            const execution = validator(value);
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

    private handleError(exection: FieldValidatorSyncResult, onError: (error: string[]) => void) {
        if (exection)
            this.reportedErrors.push(exection)
        
        onError(this.reportedErrors);
    }

    private getValidatorResult(validatorResult: FieldValidatorResult) {
        if (validatorResult == undefined)
            return undefined
        
        const resultPromise = (validatorResult as FieldValidatorAssyncResult).promise
        return resultPromise || validatorResult;
    }

    private terminateAssyncValidators() {
        this.lastValdationResults.forEach((result) => {
            if (result) {
                const interrupCallback = (result as FieldValidatorAssyncResult).cancel
                interrupCallback && interrupCallback();
            }
        })
    }
}