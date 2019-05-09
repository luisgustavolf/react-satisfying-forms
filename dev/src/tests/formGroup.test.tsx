import * as React from 'react'
import { configure, mount } from "enzyme";
import { Form, FieldGroup, Field } from "../react-satisfying-forms";
import Adapter from 'enzyme-adapter-react-16';

beforeAll(() => {
    configure({ adapter: new Adapter() });
})


it ('Form group prefixes nested fields fieldnames', () => {

    const form = mount(
        <Form>
            <FieldGroup name='group'>
                <Field fName='field' fUseDebounce={false}>
                    {(props, status) => 
                        <input {...props}/>
                    }
                </Field>
            </FieldGroup>
        </Form>
    )

    form.find('input').simulate('change', { target: { value: 'value' }});
    expect(form.state()).toHaveProperty('fieldsValues.group.field')
})

it ('Form group respescts its owners forms', () => {

    const form = mount(
        <Form>
            <FieldGroup name='group'>
                
                <Field fName='field' fUseDebounce={false}>
                    {(props, status) => 
                        <input {...props}/>
                    }
                </Field>

                <Form>
                    <FieldGroup name='innerGroup'>
                        <Field fName='field' fUseDebounce={false}>
                            {(props, status) => 
                                <input {...props} className={'innerInput'}/>
                            }
                        </Field>
                    </FieldGroup>
                </Form>
                
            </FieldGroup>
        </Form>
    )

    form.find('.innerInput').simulate('change', { target: { value: 'value' }});
    expect(form.state()).not.toHaveProperty('fieldsValues.innerGroup.field')
    expect(form.find('Form').last().state()).not.toHaveProperty('fieldsValues.group.innerGroup.field', 'value')
    expect(form.find('Form').last().state()).toHaveProperty('fieldsValues.innerGroup.field', 'value')
})


/** 
 * FieldGroup tests
 * 
 * it Prefixes child fields
 * it Respects form boudary
*/