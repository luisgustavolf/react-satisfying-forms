import * as React from 'react';
import { configure, mount } from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import { Form, Field, FieldGroup } from "../react-satisfying-forms";

beforeAll(() => {
    configure({ adapter: new Adapter() });
})

it ('Sets values from model correcly', () => {
    const form = mount(
        <Form >
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

it ('Form group prefixes nested fields fieldnames', () => {

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

/**
 * Form Tests
 * 
 * General
 *  it shows the inspector correcly
 *  it sets the inical values correcly
 *  it sinalize on any field change
 *  it works in stateless mode
 *
 * Outside controll
 *  it sets field value programactly
 *  it removes a field programactly
 *  it validates
 *  it submits
 *  
 * Validations
 *  it only submits if all fields doesnt contains errors
 * 
 * Form Status
 *  it detects if form is dirty
 *  it detects if any field is validating
 *  it detects that all fields has validated
 *  it detects if any fields has errors
 */

/** 
 * FieldGroup tests
 * 
 * it Prefixes child fields
 * it Respects form boudary
*/

/** 
 * Field tests
 * 
 * General
 *  it shows the inspector correcly
 *  it debounce engine works right
 * 
 * Validation
 *  it executes validations
 * 
 * FieldStatus
 *  it sinalizes when field was touched
 *  it sinalizes when field is dirty
 *  it sinalizes when field has erros
 *  it sinalizes when field is validating
 * 
 * Passthrough props
 *  it Passesthrough OnClick
 *  it Passesthrough OnChange
 *  it Passesthrough OnBlur
 *  it Passesthrough OnFocus
 * 
 * Factory
 *  it sums properties
 */

export default {}