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

it ('Form group respescts its owners forms', () => {

    const form = mount(
        <Form>
            {(submit, state) => 
                <FieldGroup name='group'>
                    
                    <Field fName='field' fUseDebounce={false}>
                        {(props, status) => 
                            <input {...props}/>
                        }
                    </Field>

                    <Form>
                        {(submit, state) => 
                            <React.Fragment>
                                <FieldGroup name='innerGroup'>
                                    <Field fName='field' fUseDebounce={false}>
                                        {(props, status) => 
                                            <input {...props} className={'innerInput'}/>
                                        }
                                    </Field>
                                </FieldGroup>
                            </React.Fragment>
                        }
                    </Form>

                </FieldGroup>
            }
        </Form>
    )

    form.find('.innerInput').simulate('change', { target: { value: 'value' }});
    expect(form.state()).not.toHaveProperty('fieldValues.innerGroup.field')
    expect(form.find('Form').last().state()).not.toHaveProperty('fieldValues.group.innerGroup.field', 'value')
    expect(form.find('Form').last().state()).toHaveProperty('fieldValues.innerGroup.field', 'value')
})


/** 
 * FieldGroup tests
 * 
 * it Prefixes child fields
 * it Respects form boudary
*/