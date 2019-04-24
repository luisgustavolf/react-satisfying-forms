import * as React from 'react'
import { Form } from './react-satisfying-forms/form';
import { InputField } from './rsf-default-fields/inputField';
import { SelectField } from './rsf-default-fields/selectField';
import { TextAreaField } from './rsf-default-fields/textArea';
import { CheckboxField } from './rsf-default-fields/checkboxField';

export function SatisfyingFormExample() {
    return <>
    <Form inspect>
        {(submit, state) => 
            <React.Fragment>
                <div>
                    <div>Input</div>
                    <InputField name='name'/>
                </div>
                <div>
                    <div>Select</div>
                    <SelectField name='cities'>
                        <option>Opt 1</option>
                        <option>Opt 2</option>
                        <option>Opt 3</option>
                    </SelectField>
                </div>
                <div>
                    <div>Textara</div>
                    <TextAreaField name='text'/>
                </div>
                <div>
                    <div>Checkbox</div>
                    <CheckboxField name='cb1'/> Checkbox 1
                </div>
            </React.Fragment>
        }
    </Form>
    </>
}