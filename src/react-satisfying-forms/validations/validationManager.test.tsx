import { ValidationManager } from "./validatonManager";
import { FieldState } from "../interface/fieldData";
import { requiredValidator, delayedBobValidator } from "./requiredValidation";

it ("Performs sync validation" , () => {
    const vm = new ValidationManager();
    let validationErrors: string[] = []
    const fnOnError = jest.fn((errors: string[]) => { validationErrors = errors });
    const fnOnComplete = jest.fn();
    const fieldState:FieldState = {
        value: ""
    }

    vm.validate(fieldState, [requiredValidator], fnOnError, fnOnComplete)

    expect(validationErrors).toHaveLength(1)

    setTimeout(() => {
        expect(fnOnComplete).toBeCalledTimes(1)
    }, 100);
})

it ("Performs assync validation" , () => {
    const vm = new ValidationManager();
    let validationErrors: string[] = []
    const fnOnError = jest.fn((errors: string[]) => { validationErrors = errors });
    const fnOnComplete = jest.fn();
    const fieldState:FieldState = {
        value: ""
    }

    vm.validate(fieldState, [delayedBobValidator], fnOnError, fnOnComplete)

    setTimeout(() => {
        expect(validationErrors).toHaveLength(1)
        expect(fnOnComplete).toBeCalledTimes(1)
    }, 3000);
})

it ("Performs sync and assync validation" , () => {
    const vm = new ValidationManager();
    let validationErrors: string[] = []
    const fnOnError = jest.fn((errors: string[]) => { validationErrors = errors });
    const fnOnComplete = jest.fn();
    const fieldState:FieldState = {
        value: ""
    }

    vm.validate(fieldState, [requiredValidator, delayedBobValidator], fnOnError, fnOnComplete)

    //Sync first
    expect(validationErrors).toHaveLength(1)

    setTimeout(() => {
        //Assync later
        expect(validationErrors).toHaveLength(2)
        expect(fnOnError).toBeCalledTimes(2)
        expect(fnOnComplete).toBeCalledTimes(1)
    }, 3000);
})

it ("Performs sync and assync validation with cancelling control" , () => {
    const vm = new ValidationManager();
    let validationErrors: string[] = []
    const fnOnError = jest.fn((errors: string[]) => { validationErrors = errors });
    const fnOnComplete = jest.fn();
    const fieldState:FieldState = {
        value: ""
    }

    vm.validate(fieldState, [requiredValidator, delayedBobValidator], fnOnError, fnOnComplete)
    expect(validationErrors).toHaveLength(1)
    expect(fnOnError).toBeCalledTimes(1)

    vm.validate(fieldState, [requiredValidator, delayedBobValidator], fnOnError, fnOnComplete)
    expect(validationErrors).toHaveLength(1)
    expect(fnOnError).toBeCalledTimes(2)

    setTimeout(() => {
        //Assync later
        expect(validationErrors).toHaveLength(2)
        expect(fnOnError).toBeCalledTimes(3)
        expect(fnOnComplete).toBeCalledTimes(1)
    }, 3000);
})

export default {}