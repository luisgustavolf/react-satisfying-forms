import * as React from 'react'
import { StatelessForm as Form, Field, ValuesHelper } from '../react-satisfying-forms-staless';

export function SimpleForm() {
    const [formValues, setFormValues] = React.useState();
    
    return (
        <Form values={formValues} onChange={(values) => { setFormValues(values) }}>
            <Field name={'field1'} require>
                {(bindings) => <input {...bindings}/>}
            </Field>
            <Field name={'group1.field2'}>
                {(bindings) => <input {...bindings}/>}
            </Field>

            <pre>
                { JSON.stringify(formValues, null, 4) }
            </pre>
        </Form>
    )
}