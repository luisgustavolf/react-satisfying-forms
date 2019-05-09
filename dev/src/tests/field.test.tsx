import * as React from 'react'
import { configure, mount } from "enzyme";
import { Form, FieldGroup, Field } from "../react-satisfying-forms";
import Adapter from 'enzyme-adapter-react-16';
import { fProps, notFProps } from '../react-satisfying-forms/field';

beforeAll(() => {
    configure({ adapter: new Adapter() });
})

describe('regular tests', () => {
    it ('Debounce engine works fine', (done) => {
        const form = mount(
            <Form>
                <Field fName='first.second'>
                    {(props, status) => 
                        <React.Fragment>
                            <input {...props}/>
                            <div>{status.shouldDisplayErrors}</div>
                        </React.Fragment>
                    }
                </Field>
            </Form>
        )

        form.find('input').simulate('change', { target: { value: 'a' }});
        expect(form.find('input').props().value).toBe('a')
        expect(form.state()).not.toHaveProperty('fieldsValues.first.second')

        form.find('input').simulate('change', { target: { value: 'ab' }});
        expect(form.find('input').props().value).toBe('ab')
        expect(form.state()).not.toHaveProperty('fieldsValues.first.second')

        form.find('input').simulate('change', { target: { value: 'abc' }});
        expect(form.find('input').props().value).toBe('abc')
        expect(form.state()).not.toHaveProperty('fieldsValues.first.second')

        setTimeout(() => {
            expect(form.state()).toHaveProperty('fieldsValues.first.second', 'abc')
            done()
        }, 300);

    })
})

describe('Checkable Fields', () => {
    it ('Values workting fine', () => {
        const form = mount(
            <Form>
                <div>
                    <Field fName={'checkbox'} fCheckable fCheckedValue={'checkbox'} fUseDebounce={false}>
                        {(props) => <input className={'cb'} type={'checkbox'} {...props} />}
                    </Field>
                </div>
                <div>
                    <Field fName={'radio'} fCheckable fCheckedValue={'radio1'} fUseDebounce={false}>
                        {(props) => <input className={'rb1'} type={'radio'} {...props} />}
                    </Field>
                    <Field fName={'radio'} fCheckable fCheckedValue={'radio2'} fUseDebounce={false}>
                        {(props) => <input className={'rb2'} type={'radio'} {...props} />}
                    </Field>
                    <Field fName={'radio'} fCheckable fCheckedValue={'radio3'} fUseDebounce={false}>
                        {(props) => <input className={'rb3'} type={'radio'} {...props} />}
                    </Field>
                </div>
            </Form>
        )

        form.find('.cb').simulate('change', { target: { checked: true } })
        expect(form.state()).toHaveProperty('fieldsValues.checkbox', 'checkbox');
        
        form.find('.rb1').simulate('change', { target: { checked: true } })
        expect(form.state()).toHaveProperty('fieldsValues.radio', 'radio1');

        form.find('.rb2').simulate('change', { target: { checked: true } })
        expect(form.state()).toHaveProperty('fieldsValues.radio', 'radio2');

        form.find('.rb3').simulate('change', { target: { checked: true } })
        expect(form.state()).toHaveProperty('fieldsValues.radio', 'radio3');
       
    })
})




describe ('Event Passtrough', () => {
    
    it ('Events Passtrought', (done) => {
    
        const handleOnChange = jest.fn();
        const handleOnClick = jest.fn();
        const handleOnBlur = jest.fn();
        const handleOnFocus = jest.fn();

        const form = mount(
            <Form>
                <Field 
                    fName='name' 
                    fUseDebounce={false} 
                    fOnClick={handleOnClick}
                    fOnChange={handleOnChange}
                    fOnFocus={handleOnFocus}
                    fOnBlur={handleOnBlur}
                >
                    {(props, status) => 
                        <React.Fragment>
                            <input {...props}/>
                            <div>{status.shouldDisplayErrors}</div>
                        </React.Fragment>
                    }
                </Field>
            </Form>
        )

        form.find('input').simulate('change', { target: { value: 'abc' }});
        form.find('input').simulate('click');
        form.find('input').simulate('focus');
        form.find('input').simulate('blur');
        
        setTimeout(() => {
            expect(handleOnClick).toBeCalled()
            expect(handleOnChange).toBeCalled()
            expect(handleOnFocus).toBeCalled()
            expect(handleOnBlur).toBeCalled()
            done();
        }, 100);
    })

})

describe('Props handling', () => {

    it('Returns new object only with fProps', () => {
        const objA = {
            a: 'a',
            fProp1: 'fProp1',
            fProp2: 'fProp2',
            c: 'c',
            fan: []
        }
        
        const objB = {
            fProp3: 'fProp3',
            d: 'd',
            onClick: 'onClick',
            onBlur: 'onBlur',
            onFocus: 'onFocus',
            onChange: 'onChange'
        }

        const objWFprops = fProps(objA, objB);
        expect(objWFprops).toEqual({ 
            fProp1: 'fProp1', 
            fProp2: 'fProp2', 
            fProp3: 'fProp3'
        })
    }) 

    it('Returns new object with no fProps', () => {
        const objA = {
            a: 'a',
            fProp1: 'fProp1',
            fProp2: 'fProp2',
            c: 'c',
            fan: [],
            d: 'd1'
        }

        const objB = {
            fProp3: 'fProp3',
            d: 'd',
        }

        const objWFprops = notFProps(objA, objB);
        expect(objWFprops).toEqual({ a: 'a', c: 'c', fan: [], d: 'd' })
    }) 
})


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
 * fieldsStatus
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