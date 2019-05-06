import * as React from 'react';
import { configure, mount } from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import { Form, Field, FieldGroup } from "../react-satisfying-forms";

beforeAll(() => {
    configure({ adapter: new Adapter() });
})

describe('General', () => { 

    it('Shows inspector correcly', () => {
        const form = mount(
            <Form inspect/>
        )
        
        expect(form.find('.rsf-inspector')).toHaveLength(1)
    })

    it('Sets the initial value correcly', () => {
        const initialValues = {
            a: 'a',
            b: {
                c: 'c'
            }
        }
        
        const form = mount(
            <Form initialValues={initialValues} inspect/>
        )
        
        expect((form.state() as any).fieldValues).toEqual(initialValues)
    })


    it ('It triggers on change, on any field change', () => {
        const fn = jest.fn();

        const form = mount(
            <Form onChange={fn} >
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
        expect(fn).toBeCalledWith({first: { second : 'value'}})
    })

    it ('It Works in statelss mode', () => { 
        let outsideState = {
            a: 'a',
            b: {
                c: 'c'
            }
        }

        const handleChange = jest.fn((state: any) => {
            outsideState = state
        })        

        const form = mount(
            <Form fieldValues={outsideState} onChange={handleChange} >
                {(submit, state) => 
                    <Field fName='b.c' fUseDebounce={false}>
                        {(props, status) => 
                            <input {...props}/>
                        }
                    </Field>
                }
            </Form>
        )
        
        expect(form.find('input').prop('value')).toBe('c')
        form.find('input').simulate('change', { target: { value: 'value' }});
        expect(handleChange).toBeCalled()
        expect(outsideState.b.c).toBe('value')
        expect(form.find('input').prop('value')).toBe('value')
    })


    it ('Sets model\'s values correcly', () => {
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
        expect(form.state()).toHaveProperty('fieldValues.first.second', 'value')
    })

})

describe('Outside controll', () => {
    it ('Sets field values programmatically', () => {
        const inputRef = React.createRef<HTMLInputElement>();
        const localForm = mount(
            <Form>
                {(submit, state) => 
                    <Field fName='a.b.c'>
                        {(bindinds, status) => 
                             <input {...bindinds} ref={inputRef}/>
                        }
                    </Field>
                }
            </Form>
        )
        
        const formRef = (localForm.instance() as Form);
        
        formRef.setFieldValue('a.b.c', 'value');
        
        expect(localForm.state()).toHaveProperty('fieldValues.a.b.c', 'value')
        expect(inputRef.current!.value).toBe('value')
    }) 


    it ('Removes a field programmatically', () => {
        const initialValues = {
            a: {
                b: {
                    c: 'old'
                }
            }
        }
        
        const inputRef = React.createRef<HTMLInputElement>();
        const localForm = mount(
            <Form>
                {(submit, state) => 
                    <Field fName='a.b.c'>
                        {(bindinds, status) => 
                             <input {...bindinds} ref={inputRef}/>
                        }
                    </Field>
                }
            </Form>
        )
        
        const formRef = (localForm.instance() as Form);
        
        formRef.removeField('a.b.c');
        
        expect(localForm.state()).not.toHaveProperty('fieldValues.a.b.c')
        
    }) 

    it ('Validates and revalidates', async (done) => {
        const localForm = mount(
            <Form>
                {(submit, state) => 
                    <Field fName='a.b.c' fRequired fUseDebounce={false}>
                        {(bindinds, status) => 
                             <input {...bindinds}/>
                        }
                    </Field>
                }
            </Form>
        )

        const formRef = (localForm.instance() as Form);
        const result1 = await formRef.validate()
        expect(result1).toEqual([{ fieldname: 'a.b.c', errors: ["This fied is required..."] }])
        expect(localForm.state()).toHaveProperty('formStatus.isValidating', false)
        expect(localForm.state()).toHaveProperty('formStatus.hasValidated', true)
        expect(localForm.state()).toHaveProperty('formStatus.hasErros', true)

        localForm.find('input').simulate('change', { target: { value: 'value' }});
        const result2 = await formRef.validate()
        expect(result2).toHaveLength(0)

        done()
    })

    it ('Submits only if forms dont have errors', async (done) => {
        const localForm = mount(
            <Form>
                {(submit, state) => 
                    <Field fName='field' fRequired fUseDebounce={false}>
                        {(bindinds, status) => 
                             <input {...bindinds}/>
                        }
                    </Field>
                }
            </Form>
        )

        const formRef = (localForm.instance() as Form);
        const submitTry1 = await formRef.submit()
        expect(submitTry1).toBe(false)

        localForm.find('input').simulate('change', { target: { value: 'value' }});
        
        console.log(formRef.state)
        const submitTry2 = await formRef.submit()
        expect(submitTry2).toEqual({ field: 'value' })

        done()
    })
})

/**
 * Form Tests
 * 
 * General
 *  it shows the inspector correcly
 *  it sets the inical values correcly
 *  it sinalize on any field change
 *  it works in stateless mode
 *  it sets model's values correcly
 *
 * Outside controll
 *  it sets field value programmatically
 *  it removes a field programmatically
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