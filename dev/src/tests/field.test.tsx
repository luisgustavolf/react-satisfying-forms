import * as React from 'react'
import { configure, mount } from "enzyme";
import { Form, FieldGroup, Field } from "../react-satisfying-forms";
import Adapter from 'enzyme-adapter-react-16';

beforeAll(() => {
    configure({ adapter: new Adapter() });
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

    form.find('input').simulate('change', { target: { value: 'a' }});
    expect(form.find('input').props().value).toBe('a')
    expect(form.state()).not.toHaveProperty('fieldValues.first.second')

    form.find('input').simulate('change', { target: { value: 'ab' }});
    expect(form.find('input').props().value).toBe('ab')
    expect(form.state()).not.toHaveProperty('fieldValues.first.second')

    form.find('input').simulate('change', { target: { value: 'abc' }});
    expect(form.find('input').props().value).toBe('abc')
    expect(form.state()).not.toHaveProperty('fieldValues.first.second')

    setTimeout(() => {
        expect(form.state()).toHaveProperty('fieldValues.first.second')
        done()
    }, 300);

})