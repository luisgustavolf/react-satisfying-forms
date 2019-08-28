import * as React from 'react'
import { StatelessForm } from '../react-satisfying-forms-staless/statelessForm';
import { ContextedField } from '../react-satisfying-forms-staless/contextedField';

export function SimpleForm() {
    const [formValues, setFormValues] = React.useState();
    
    return (
        <StatelessForm values={formValues} onChange={(values) => { setFormValues(values)}}>
            <ContextedField name={'field1'} require>
                {(bindings) => <input {...bindings}/>}
            </ContextedField>
            <ContextedField name={'field2'}>
                {(bindings) => <input {...bindings}/>}
            </ContextedField>

            <pre>
                { JSON.stringify(formValues, null, 4) }
            </pre>
        </StatelessForm>
    )
}