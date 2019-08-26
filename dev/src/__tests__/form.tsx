import * as React from 'react'
import { mount, configure } from "enzyme";
import { StatelessForm } from "../react-satisfying-forms-staless/statelessform";
import { IFormValues } from "../react-satisfying-forms-staless/interfaces/iFormValues";
import { ContextedField } from "../react-satisfying-forms-staless/contextedField";
import { FieldBidings } from "../react-satisfying-forms/interfaces/fieldBidings";
import Adapter from 'enzyme-adapter-react-16';
import { IFieldStatus } from '../react-satisfying-forms-staless/interfaces/iFieldStatus';

beforeAll(() => {
    configure({ adapter: new Adapter() });
})

describe('Form values', () => {
    
    it('Sets returns the default structure', () => { 
        const handleChange = jest.fn();
        const defaultStructure:IFormValues<any> = {
            fields: {
                status: {},
                values: {
                    field1: "newFieldValue1"
                }
            },
            form: {
                dirty: false,
                hasErrors: false,
                hasValidated: false,
                isValidating: false
            }
        }

        const form = mount(
            <StatelessForm onChange={handleChange}>
                <ContextedField fName={'field1'}>
                    {(bindings:FieldBidings) => <input className={'field1'} {...bindings}/>}
                </ContextedField>
            </StatelessForm>
        )

        form.find('.field1').simulate('change', {target: {value: 'newFieldValue1'}});
        expect(handleChange).toBeCalledWith(defaultStructure)

    })

    it('Sets field values object', () => { 
        const formValues: IFormValues<any> = {
            fields: {
                values: {
                    field1: 'fieldValue1',
                    field2: 'fieldValue2',
                    group: {
                        field3: 'fieldValue3'
                    }
                }
            }
        }

        const form = mount(
            <StatelessForm values={formValues}>
                <ContextedField fName={'field1'}>
                    {(bindings:FieldBidings) => <input className={'field1'} {...bindings}/>}
                </ContextedField>
                <ContextedField fName={'field2'}>
                    {(bindings:FieldBidings) => <input className={'field2'} {...bindings}/>}
                </ContextedField>
                <ContextedField fName={'group.field3'}>
                    {(bindings:FieldBidings) => <input className={'field3'} {...bindings}/>}
                </ContextedField>
            </StatelessForm>
        )

        expect(form.find('.field1').prop('value')).toBe('fieldValue1')
        expect(form.find('.field2').prop('value')).toBe('fieldValue2')
        expect(form.find('.field3').prop('value')).toBe('fieldValue3')
    })
    
    it.only('Sets field status', () => { 
        const handleChange = jest.fn();
        const formValues: IFormValues<any> = {
            fields: {
                values: {
                    field1: 'fieldValue1',
                    field2: 'fieldValue2',
                    group: {
                        field3: 'fieldValue3'
                    }
                }
            }
        }

        const newFormValues: IFormValues<any> = { ...formValues }
        newFormValues.fields!.values!.field1 = "newFieldValue1";

        const form = mount(
            <StatelessForm values={formValues} onChange={handleChange}>
                <ContextedField fName={'field1'}>
                    {(bindings:FieldBidings) => <input className={'field1'} {...bindings}/>}
                </ContextedField>
            </StatelessForm>
        )

        form.find('.field1').simulate('change', {target: {value: 'newFieldValue1'}});
        expect(handleChange).toBeCalled()
        
        const args:IFormValues<any> = handleChange.mock.calls[0][0]
        expect(args.fields!.values!.field1).toEqual("newFieldValue1")
        expect(args.fields!.status!['field1']).toEqual({
            dirty: true,
        } as IFieldStatus)
    })


    it('Sets field status', () => { })
})

describe('Fields validations', () => {
    it('Sets fields validation props', () => { })
    it('Sets form validation props', () => { })
})