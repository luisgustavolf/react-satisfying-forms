import * as React from 'react'
import { mount } from "enzyme";
import { Form } from "../react-satisfying-forms-staless/form";
import { IFormValues } from "../react-satisfying-forms-staless/interfaces/iFormValues";
import { ContextedField } from "../react-satisfying-forms-staless/contextedField";
import { FieldBidings } from "../react-satisfying-forms/interfaces/fieldBidings";

describe('Form values', () => {
    
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
            <Form values={formValues}>
                <ContextedField fName={'field1'}>
                    {(bindings:FieldBidings) => <input className={'field1'} {...bindings}/>}
                </ContextedField>
                <ContextedField fName={'field2'}>
                    {(bindings:FieldBidings) => <input className={'field2'} {...bindings}/>}
                </ContextedField>
                <ContextedField fName={'group.field3'}>
                    {(bindings:FieldBidings) => <input className={'field3'} {...bindings}/>}
                </ContextedField>
            </Form>
        )

        expect(form.find('.field1').prop('value')).toBe('fieldValue1')
        expect(form.find('.field2').prop('value')).toBe('fieldValue2')
        expect(form.find('.field3').prop('value')).toBe('fieldValue3')
    })
    
    it('Sets field status', () => { })
    it('Sets field status', () => { })
})

describe('Fields validations', () => {
    it('Sets fields validation props', () => { })
    it('Sets form validation props', () => { })
})