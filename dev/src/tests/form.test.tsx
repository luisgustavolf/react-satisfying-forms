import * as React from 'react';
import { configure, mount } from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import { Form, Field, FieldGroup } from "../react-satisfying-forms";

beforeAll(() => {
    configure({ adapter: new Adapter() });
})

it ('Sets values from model correcly', () => {
    const form = mount(
        <Form>
            {(submit, state) => 
                <Field fName='first.second' fUseDebounce={false}>
                    {(props, status) => 
                        <input {...props}/>
                    }
                </Field>
            }
        </Form>
    )

    form.find('input').simulate('change', { target: { value: 'value' }});
    expect(form.state()).toHaveProperty('fieldValues.first.second')
})

it ('Debounce engine works fine', (done) => {
    const form = mount(
        <Form>
            {(submit, state) => 
                <Field fName='first.second'>
                    {(props, status) => 
                        <input {...props}/>
                    }
                </Field>
            }
        </Form>
    )

    form.find('input').simulate('change', { target: { value: 'value' }});
    expect(form.find('input').props().value).toBe('value')
    expect(form.state()).not.toHaveProperty('fieldValues.first.second')

    setTimeout(() => {
        expect(form.state()).toHaveProperty('fieldValues.first.second')
        done()
    }, 300);
})

it ('Form group prefixes field names', () => {

    const form = mount(
        <Form>
            {(submit, state) => 
                <FieldGroup name='group'>
                    <Field fName='field' fUseDebounce={false}>
                        {(props, status) => 
                            <input {...props}/>
                        }
                    </Field>
                </FieldGroup>
            }
        </Form>
    )

    form.find('input').simulate('change', { target: { value: 'value' }});
    expect(form.state()).toHaveProperty('fieldValues.group.field')
})


// Valor
// Debounce
// FieldStatus
// FieldGroup
// Errors


export default {}