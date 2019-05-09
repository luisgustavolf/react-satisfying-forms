import * as React from 'react'
import { Form, Field } from '../react-satisfying-forms';
import { delayedBobValidator } from '../react-satisfying-forms/validations/exampleValidators';
import { CheckboxField } from '../rsf-default-fields/checkboxField';

export function PassTroughtEvents() {
    
    function handleChange(evt: any) {
        console.log(evt)
    }

    return <>
    <Form inspect>
        <CheckboxField fName={'teste'} fOnChange={handleChange}/>
    </Form>
    </>
    
}