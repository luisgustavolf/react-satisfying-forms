import * as React from 'react'
import { Form, Field } from '../react-satisfying-forms';
import { FieldFactory } from '../react-satisfying-forms/field';

const CheckboxField = FieldFactory<React.InputHTMLAttributes<HTMLInputElement>>((fprops, props, bindings, status) => 
    <input type={'checkbox'} {...props} {...bindings} />
, { fCheckable: true })

const RadioField = FieldFactory<React.InputHTMLAttributes<HTMLInputElement>>((fprops, props, bindings, status) => 
    <input type={'radio'} {...props} {...bindings} />
, { fCheckable: true })

export function CheckableFields() {
    return <>
    <Form inspect>
        <div>
            Declarative
            <Field fName={'declarativeCheckbox'} fCheckable fCheckedValue={'declarative'}>
                {(props) => <input type={'checkbox'} {...props} />}
            </Field>
        </div>
        <div>
            Factoried
            <CheckboxField fName={'factoriedCheckbox'}/>
        </div>
        <div>
            <Field fName={'radio'} fCheckable fCheckedValue={'radio1'}>
                {(props) => <input type={'radio'} {...props} />}
            </Field>
            <RadioField fName={'radio'} fCheckedValue={'radio2'}/>
            <RadioField fName={'radio'} fCheckedValue={'radio3'}/>
        </div>
    </Form>
    </>
    
}