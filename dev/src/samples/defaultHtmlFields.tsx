import * as React from 'react'
import { Form } from '../react-satisfying-forms';
import { InputField } from '../rsf-default-fields/inputField';
import { CheckboxField } from '../rsf-default-fields/checkboxField';
import { RadioField } from '../rsf-default-fields/radioButton';
import { SelectField } from '../rsf-default-fields/selectField';
import { TextAreaField } from '../rsf-default-fields/textArea';

export function DefaultHtmlFields() {
    return (
        <Form inspect>
            <div>
                Input<br/>
                <InputField fName={'input'} fRequired/>
            </div>
            <div>
                Checkbox<br/>
                <CheckboxField fName={'checkbox'} fCheckedValue={'checkbox'} />
            </div>
            <div>
                Radio<br/>
                <RadioField fName={'radio'} fCheckedValue={'radio1'}/>
                <RadioField fName={'radio'} fCheckedValue={'radio2'}/>
            </div>
            <div>
                Select<br/>
                <SelectField fName={'select'}>
                    <option value=''></option>
                    <option value='select-1'>Valor 1</option>
                    <option value='select-2'>Valor 2</option>
                </SelectField>
            </div>
            <div>
                Textarea<br/>
                <TextAreaField fName={'textarea'}/>
            </div>
        </Form>
    )
}