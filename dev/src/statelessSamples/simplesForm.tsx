import * as React from 'react'
import { StatelessForm as Form, Field } from '../react-satisfying-forms-staless';
import { validateForm } from '../react-satisfying-forms-staless/helpers/validationHelper';
import { IFormValues } from '../react-satisfying-forms-staless/interfaces/iFormValues';

export interface FormData {
    field1?: string,
    group1?: {
        field2: string
    }
}

export function SimpleForm() {
    const [formValues, setFormValues] = React.useState<IFormValues<FormData>>({ fields: { values: { } }});
    
    function submit() {
        validateForm(formValues, () => {}, (values) => { setFormValues(values) });
    }

    return (
        <Form values={formValues} onChange={(values) => { setFormValues(values) }} inspect>
            <Field name={'field1'} require>
                {(bindings) => <input {...bindings}/>}
            </Field>

            {formValues.fields.values.field1 !== '123' && 
                <Field name={'group1.field2'} require>
                    {(bindings) => <input {...bindings}/>}
                </Field>
            }

            <button onClick={submit}>Submit</button>
        </Form>
    )
}