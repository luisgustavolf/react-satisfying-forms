import * as React from 'react';
import { configure, mount } from "enzyme";
import Adapter from 'enzyme-adapter-react-16';
import { Form, Field, FieldGroup } from "../react-satisfying-forms";
import { delayedBobValidator } from '../react-satisfying-forms/validations/exampleValidators';

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
                <Field fName='first.second' fUseDebounce={false}>
                    {(props, status) => 
                        <input {...props}/>
                    }
                </Field>
            </Form>
        )

        form.find('input').simulate('change', { target: { value: 'value' }});
        expect(fn).toBeCalledWith({first: { second : 'value'}})
    })


    it('Submits from helper', () => {
        const handleSubmit = jest.fn();

        const form = mount(
            <Form onSubmit={handleSubmit} >
                <Field fName='name' fUseDebounce={false}>
                    {(props, status) => 
                        <input {...props}/>
                    }
                </Field>
                <Form.Submit>
                    {(submit) => <button onClick={submit}>Submit</button>}
                </Form.Submit>
            </Form>
        )

        form.find('input').simulate('change', { target: { value: 'value' }});
        form.find('button').simulate('click');
        expect(handleSubmit).toHaveBeenCalledWith({ name: 'value' })
    }) 


    it('Passes FieldsValues trough the helper', () => {
        const values = {
            name: 'value'
        }

        const form = mount(
            <Form initialValues={values}>
                <Form.Values<any>>
                    {(values) => <input value={values.name} onChange={() => {}}></input>}
                </Form.Values>
            </Form>
        )

        expect(form.find('input').props().value).toBe('value')
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
                <Field fName='b.c' fUseDebounce={false}>
                    {(props, status) => 
                        <input {...props}/>
                    }
                </Field>
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
                <Field fName='first.second' fUseDebounce={false}>
                    {(props, status) => 
                        <input {...props}/>
                    }
                </Field>
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
                <Field fName='a.b.c'>
                    {(bindinds, status) => 
                            <input {...bindinds} ref={inputRef}/>
                    }
                </Field>
            </Form>
        )
        
        const formRef = (localForm.instance() as Form);
        
        formRef.setFieldValue('a.b.c', 'value');
        
        expect(localForm.state()).toHaveProperty('fieldValues.a.b.c', 'value')
        expect(inputRef.current!.value).toBe('value')
    }) 

    it ('Sets fields values programmatically', () => {

        const localForm = mount(
            <Form>
                <Field fName='a.b.c' fUseDebounce={false}>
                    {(bindinds, status) => 
                            <input {...bindinds}/>
                    }
                </Field>
            </Form>
        )
        
        const formRef = (localForm.instance() as Form);
        localForm.find('input').simulate('change', { target: { value: 'value' }});
        expect(localForm.state()).toHaveProperty('fieldValues.a.b.c', 'value')
        
        formRef.setFieldsValues({ a: 'value' });
        
        expect(localForm.state()).not.toHaveProperty('fieldValues.a.b.c')
        expect(localForm.state()).toHaveProperty('fieldValues.a', 'value')
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
                <Field fName='a.b.c'>
                    {(bindinds, status) => 
                            <input {...bindinds} ref={inputRef}/>
                    }
                </Field>
            </Form>
        )
        
        const formRef = (localForm.instance() as Form);
        
        formRef.removeField('a.b.c');
        
        expect(localForm.state()).not.toHaveProperty('fieldValues.a.b.c')
        
    }) 

    it ('Validates and revalidates', async (done) => {
        const localForm = mount(
            <Form>
                <Field fName='a.b.c' fRequired fUseDebounce={false}>
                    {(bindinds, status) => 
                            <input {...bindinds}/>
                    }
                </Field>
            </Form>
        )

        const formRef = (localForm.instance() as Form);
        const result1 = await formRef.validate()
        expect(result1).toEqual([{ fieldname: 'a.b.c', errors: ["This fied is required..."] }])
        expect(localForm.state()).toHaveProperty('formStatus.isValidating', false)
        expect(localForm.state()).toHaveProperty('formStatus.hasValidated', true)
        expect(localForm.state()).toHaveProperty('formStatus.hasErrors', true)

        localForm.find('input').simulate('change', { target: { value: 'value' }});
        const result2 = await formRef.validate()
        
        setTimeout(() => {
            expect(result2).toHaveLength(0)    
            done()
        }, 100);
        
    })

    it ('Submits only if forms dont have errors', async (done) => {
        const form = mount(
            <Form>
                <Field fName='a.b.c' fRequired fUseDebounce={false}>
                    {(bindinds, status) => 
                            <input {...bindinds}/>
                    }
                </Field>
            </Form>
        )

        const formRef = (form.instance() as Form);
        const submitTry1 = await formRef.submit() 
        expect(submitTry1).toBe(false)

        form.find('input').simulate('change', { target: { value: 'value' }});
        
        // Waits a little to the change propagates internally
        setTimeout(async () => {
            const submitTry2 = await formRef.submit()
            expect(submitTry2).toEqual({ a: { b: { c: 'value' }}})
            done()    
        }, 50);
    })  
})

describe('Form Status', () => {

    it ('Detects if form is has been dirty', () => { 
        const form = mount(
            <Form>
                <Field fName='a.b.c' fRequired fUseDebounce={false}>
                    {(bindinds, status) => 
                            <input {...bindinds}/>
                    }
                </Field>
            </Form>
        )

        expect(form.state()).not.toHaveProperty('formStatus.dirty')
        form.find('input').simulate('change', { target: { value: 'value' }});
        expect(form.state()).toHaveProperty('formStatus.dirty', true)
    })


    it ('Detects if field is validating', async (done) => { 
        const form = mount(
            <Form>
                <Field fName='a.b.c' fUseDebounce={false} fExtraValidators={[delayedBobValidator]}>
                    {(bindinds, status) => 
                            <input {...bindinds}/>
                    }
                </Field>
            </Form>
        )

        expect(form.state()).not.toHaveProperty('formStatus.isValidating')
        form.find('input').simulate('change', { target: { value: 'value' }});
        setTimeout(() => {
            expect(form.state()).toHaveProperty('formStatus.isValidating', true);
        
            setTimeout(() => {
                expect(form.state()).toHaveProperty('formStatus.isValidating', false);
                done()
            }, 2500);    
        }, 50);
    })

    it ('Detects if all fields has validated', () => { 
        const form = mount(
            <Form>
                <React.Fragment>
                    <Field fName='a.b.c' fUseDebounce={false} fRequired>
                        {(bindinds, status) => 
                            <input className={'inp1'} {...bindinds}/>
                        }
                    </Field>
                    <Field fName='a.b.d' fUseDebounce={false} fRequired>
                        {(bindinds, status) => 
                            <input className={'inp2'} {...bindinds}/>
                        }
                    </Field>
                </React.Fragment>
            </Form>
        )

        expect(form.state()).not.toHaveProperty('formStatus.hasValidated')
        form.find('input.inp1').simulate('change', { target: { value: 'value' }});
        expect(form.state()).toHaveProperty('formStatus.hasValidated', false)
        form.find('input.inp2').simulate('change', { target: { value: 'value' }});
        setTimeout(() => {
            expect(form.state()).toHaveProperty('formStatus.hasValidated', true)    
        }, 50);
        
    })

    it ('It Detects if anyfields has errors', (done) => { 
        const form = mount(
            <Form>
                <Field fName='a.b.c' fUseDebounce={false} fRequired>
                    {(bindinds, status) => 
                            <input {...bindinds}/>
                    }
                </Field>
            </Form>
        )

        expect(form.state()).not.toHaveProperty('formStatus.hasErrors')
        form.find('input').simulate('change', { target: { value: 'value' }});
        form.find('input').simulate('change', { target: { value: '' }});
        setTimeout(() => {
            expect(form.state()).toHaveProperty('formStatus.hasErrors', true)    
            done()
        }, 50);
        
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
 *  it sets all field values programmatically
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


export default {}