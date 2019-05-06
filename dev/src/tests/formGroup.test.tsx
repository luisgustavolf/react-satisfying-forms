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
 * FieldGroup tests
 * 
 * it Prefixes child fields
 * it Respects form boudary
*/