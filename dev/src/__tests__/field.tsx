import * as React from 'react'
import Adapter from 'enzyme-adapter-react-16';
import { mount, configure } from "enzyme";
import { StatelessForm as Form } from "../react-satisfying-forms-staless/statelessform";
import { ContextedField } from '../react-satisfying-forms-staless/contextedField';
import { FieldBidings } from '../react-satisfying-forms/interfaces/fieldBidings';
import { IFormValues } from '../react-satisfying-forms-staless/interfaces/iFormValues';

beforeAll(() => {
    configure({ adapter: new Adapter() });
})

describe.only ('Form values', () => {
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
                <ContextedField name={'field1'} require>
                    {(bindings:FieldBidings) => <input className={'field1'} {...bindings}/>}
                </ContextedField>
            </Form>
        )

        form.find('.field1').simulate('change', { target: { value: '' }});
        expect(handleChange).toBeCalled()
        const args:IFormValues<any> = handleChange.mock.calls[0][0]
        expect(args).toMatchObject(defaultStructure)
    })
})