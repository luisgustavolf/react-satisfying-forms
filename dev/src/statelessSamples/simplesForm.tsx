import * as React from 'react'
import { StatelessForm as Form } from '../react-satisfying-forms-staless/statelessForm';
import { Field } from '../react-satisfying-forms-staless/field';

export function SimpleForm() {
    const [formValues, setFormValues] = React.useState();
    
    return (
        <Form values={formValues} onChange={(values) => { setFormValues(values) }}>
            <Field name={'field1'} require>
                {(bindings) => <input {...bindings}/>}
            </Field>
            <Field name={'field2'}>
                {(bindings) => <input {...bindings}/>}
            </Field>

            <pre>
                { JSON.stringify(formValues, null, 4) }
            </pre>
        </Form>
    )
}