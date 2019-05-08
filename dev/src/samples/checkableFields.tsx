import * as React from 'react'
import { Form, Field } from '../react-satisfying-forms';
import { delayedBobValidator } from '../react-satisfying-forms/validations/exampleValidators';

export function CheckableFields() {
    return <>
    <Form inspect>
        <div>
            <Field fName={'checkbox'} fCheckable fCheckedValue={'checkbox'}>
                {(props) => <input type={'checkbox'} {...props} />}
            </Field>
        </div>
        <div>
            <Field fName={'radio'} fCheckable fCheckedValue={'radio1'}>
                {(props) => <input type={'radio'} {...props} />}
            </Field>
            <Field fName={'radio'} fCheckable fCheckedValue={'radio2'}>
                {(props) => <input type={'radio'} {...props} />}
            </Field>
            <Field fName={'radio'} fCheckable fCheckedValue={'radio3'}>
                {(props) => <input type={'radio'} {...props} />}
            </Field>
        </div>
    </Form>
    </>
    
}