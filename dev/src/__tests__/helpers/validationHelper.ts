import Adapter from 'enzyme-adapter-react-16';
import { configure } from "enzyme";
import * as ValidationHelper from '../../react-satisfying-forms-staless/helpers/validationHelper'
import { IFormValues } from '../../react-satisfying-forms-staless/interfaces/iFormValues';
import { requiredValidator } from '../../react-satisfying-forms-staless/validations/requiredValidator';

interface FormData {
    firstField: string
    secondField?: string
}

beforeAll(() => {
    configure({ adapter: new Adapter() });
})

describe('Validation Helper cases', () => { 
    it ('Validates all sync fields', () => {
        const onErrorFn = jest.fn();
        const onCompleteFn = jest.fn();

        const initialValues:IFormValues<FormData> = {
            fields: {
                values: {
                    firstField: ''
                },
                registeredFieldsAndValidators: {
                    firstField: [requiredValidator],
                    secondField: [requiredValidator]
                }
            }
        }

        const resultValues:IFormValues<FormData> = {
            ...initialValues,
            fields: {
                ...initialValues.fields,
                status: {
                    firstField: {
                        errors: ["Campo obrigatório..."]
                    },
                    secondField: {
                        errors: ["Campo obrigatório..."]
                    }
                }
            },
            form: {
                dirty: false,
                hasErrors: true
            }
        }

        ValidationHelper.validateForm(initialValues, onErrorFn, onCompleteFn);
        expect(onErrorFn).not.toBeCalled()
        expect(onCompleteFn).toBeCalledTimes(1)
        expect(onCompleteFn).toBeCalledWith(resultValues)

        const initialValuesAfter:IFormValues<FormData> = {
            ...resultValues,
            fields: {
                ...resultValues.fields,
                values: {
                    firstField: '123'
                },
                registeredFieldsAndValidators: {
                    firstField: [requiredValidator],
                    secondField: [requiredValidator]
                }
            }
        }

        const resultValuesAfter:IFormValues<FormData> = {
            ...initialValuesAfter,
            fields: {
                ...initialValuesAfter.fields,
                status: {
                    firstField: { },
                    secondField: {
                        errors: ["Campo obrigatório..."]
                    }
                }
            },
            form: {
                dirty: false,
                hasErrors: true
            }
        }

        ValidationHelper.validateForm(initialValuesAfter, onErrorFn, onCompleteFn);
        expect(onErrorFn).not.toBeCalled()
        expect(onCompleteFn).toBeCalledTimes(2)
        expect(onCompleteFn).toBeCalledWith(resultValuesAfter)
    })

    it.skip ('Validates sync and async', () => {})
    it.skip ('Validates a specific field', () => {})
})

export default {}