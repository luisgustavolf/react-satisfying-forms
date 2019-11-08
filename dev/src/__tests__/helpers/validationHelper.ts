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
        const onUpdateFn = jest.fn();
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

        ValidationHelper.validateForm(initialValues, onUpdateFn, onCompleteFn);
        expect(onUpdateFn).not.toBeCalled()
        expect(onCompleteFn).toBeCalledWith(resultValues)
    })

    it.skip ('Validates a specific field', () => {})
})

export default {}