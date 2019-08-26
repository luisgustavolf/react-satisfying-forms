import { FieldValidationManager } from "../../react-satisfying-forms/validations/fieldValidatonManager";
import { FieldStatusWithValue } from "../../react-satisfying-forms/interfaces/fieldStatusWithValue";
import { requiredValidator, delayedBobValidator } from "../../react-satisfying-forms/validations/exampleValidators";

class CommomConfigs {
    validationManager = new FieldValidationManager();
    validationErrors: string[] = []
    fnOnError = jest.fn((errors: string[]) => { 
        this.validationErrors = errors 
    });
    fnOnComplete = jest.fn();
    fieldState:FieldStatusWithValue = {
        value: ""
    }
}

it ("Do not trigger OnError if evereything is ok" , () => {
    const configs = new CommomConfigs();

    configs.validationManager.validate("value", [requiredValidator], configs.fnOnError, configs.fnOnComplete)

    setTimeout(() => {
        expect(configs.fnOnError).not.toBeCalled()
        expect(configs.fnOnComplete).toBeCalledTimes(1)
    }, 100);
})

it ("Performs sync validation" , () => {
    const configs = new CommomConfigs();

    configs.validationManager.validate(configs.fieldState.value, [requiredValidator], configs.fnOnError, configs.fnOnComplete)

    expect(configs.validationErrors).toHaveLength(1)

    setTimeout(() => {
        expect(configs.fnOnError).toBeCalledTimes(1)
        expect(configs.fnOnComplete).toBeCalledTimes(1)
    }, 100);
})

it ("Performs assync validation" , () => {
    const configs = new CommomConfigs();

    configs.validationManager.validate(configs.fieldState.value, [delayedBobValidator], configs.fnOnError, configs.fnOnComplete)

    setTimeout(() => {
        expect(configs.validationErrors).toHaveLength(1)
        expect(configs.fnOnComplete).toBeCalledTimes(1)
    }, 3000);
})

it ("Performs sync and assync validation" , () => {
    const configs = new CommomConfigs();

    configs.validationManager.validate(configs.fieldState.value, [requiredValidator, delayedBobValidator], configs.fnOnError, configs.fnOnComplete)

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

    configs.validationManager.validate(configs.fieldState.value, [requiredValidator, delayedBobValidator], configs.fnOnError, configs.fnOnComplete)
    
    //Sync first
    expect(configs.validationErrors).toHaveLength(1)
    expect(configs.fnOnError).toBeCalledTimes(1)

    configs.validationManager.validate(configs.fieldState.value, [requiredValidator, delayedBobValidator], configs.fnOnError, configs.fnOnComplete)
    
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