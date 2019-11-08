import * as React from 'react'
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from "enzyme";
import { StatelessForm as Form } from "../react-satisfying-forms-staless/statelessForm";
import { Field } from '../react-satisfying-forms-staless/field';
import { FieldBidings } from '../react-satisfying-forms/interfaces/fieldBidings';
import { IFormValues } from '../react-satisfying-forms-staless/interfaces/iFormValues';
import { IFieldValidator } from '../react-satisfying-forms-staless/interfaces/iFieldValidator';

beforeAll(() => {
    configure({ adapter: new Adapter() });
})

describe ('Form values', () => {
    it('It validates required fields', () => { 
        const handleChange = jest.fn();
        const defaultStructure:IFormValues<any> = {
            fields: {
                status: {
                    field1: {
                        errors: ['Campo obrigatorio']
                    }
                },
                values: {
                    field1: ''
                }
            },
            form: {
                dirty: true,
                hasErrors: true
            }
        }

        const form = mount(
            <Form onChange={handleChange}>
                <Field name={'field1'} require>
                    {(bindings:FieldBidings) => <input className={'field1'} {...bindings}/>}
                </Field>
            </Form>
        )

        form.find('.field1').simulate('change', { target: { value: '' }});
        expect(handleChange).toBeCalled()
        const args:IFormValues<any> = handleChange.mock.calls[0][0]
        expect(args).toMatchObject(defaultStructure)
    })

    it('Can do adicional validations', async () => {
        const handleChange = jest.fn();
        const defaultStructure:IFormValues<any> = {
            fields: {
                status: {
                    field1: {
                        errors: ['Campo obrigatorio', 'It\'s no bob...']
                    }
                },
                values: {
                    field1: ''
                }
            },
            form: {
                dirty: true,
                hasErrors: true
            }
        }
        
        const myValidation: IFieldValidator = (value: any) => {
            return value != 'bob' ? 'It\'s no bob...' : undefined
        }
        
        const form = mount(
            <Form onChange={handleChange}>
                <Field name={'field1'} validators={[myValidation]} require>
                    {(bindings:FieldBidings) => <input className={'field1'} {...bindings}/>}
                </Field>
            </Form>
        )

        form.find('.field1').simulate('change', { target: { value: '' }});
        expect(handleChange).toBeCalled()
        const args:IFormValues<any> = handleChange.mock.calls[0][0]
        expect(args).toMatchObject(defaultStructure)
    })
})