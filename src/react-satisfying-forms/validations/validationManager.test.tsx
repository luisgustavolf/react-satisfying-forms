import { ValidationManager } from "./validatonManager";
import { FieldState } from "../interfaces/fieldData";
import { requiredValidator, delayedBobValidator } from "./exampleValidators";

class CommomConfigs {
    validationManager = new ValidationManager();
    validationErrors: string[] = []
    fnOnError = jest.fn((errors: string[]) => { this.validationErrors = errors });
    fnOnComplete = jest.fn();
    fieldState:FieldState = {
        value: ""
    }
}

it ("Performs sync validation" , () => {
    const configs = new CommomConfigs();

    configs.validationManager.validate(configs.fieldState, [requiredValidator], configs.fnOnError, configs.fnOnComplete)

    expect(configs.validationErrors).toHaveLength(1)

    setTimeout(() => {
        expect(configs.fnOnComplete).toBeCalledTimes(1)
    }, 100);
})

it ("Performs assync validation" , () => {
    const configs = new CommomConfigs();

    configs.validationManager.validate(configs.fieldState, [delayedBobValidator], configs.fnOnError, configs.fnOnComplete)

    setTimeout(() => {
        expect(configs.validationErrors).toHaveLength(1)
        expect(configs.fnOnComplete).toBeCalledTimes(1)
    }, 3000);
})

it ("Performs sync and assync validation" , () => {
    const configs = new CommomConfigs();

    configs.validationManager.validate(configs.fieldState, [requiredValidator, delayedBobValidator], configs.fnOnError, configs.fnOnComplete)

    //Sync first
    expect(configs.validationErrors).toHaveLength(1)

    setTimeout(() => {
        //Assync later
        expect(configs.validationErrors).toHaveLength(2)
        expect(configs.fnOnError).toBeCalledTimes(2)
        expect(configs.fnOnComplete).toBeCalledTimes(1)
    }, 3000);
})

it ("Performs sync and assync validation with cancelling control" , () => {
    const configs = new CommomConfigs();

    configs.validationManager.validate(configs.fieldState, [requiredValidator, delayedBobValidator], configs.fnOnError, configs.fnOnComplete)
    
    //Sync first
    expect(configs.validationErrors).toHaveLength(1)
    expect(configs.fnOnError).toBeCalledTimes(1)

    configs.validationManager.validate(configs.fieldState, [requiredValidator, delayedBobValidator], configs.fnOnError, configs.fnOnComplete)
    
    //Sync first
    expect(configs.validationErrors).toHaveLength(1)
    expect(configs.fnOnError).toBeCalledTimes(2)

    setTimeout(() => {
        //Assync later
        expect(configs.validationErrors).toHaveLength(2)
        expect(configs.fnOnError).toBeCalledTimes(3)
        expect(configs.fnOnComplete).toBeCalledTimes(1)
    }, 3000);
})

export default {}