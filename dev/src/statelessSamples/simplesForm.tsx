import * as React from 'react'
import { StatelessForm as Form, Field } from '../react-satisfying-forms-staless';
import { validateForm } from '../react-satisfying-forms-staless/helpers/validationHelper';
import { IFormValues } from '../react-satisfying-forms-staless/interfaces/iFormValues';

export interface FormData {
    input?: string,
    checkbox?: string,
    radio?: string,
    select?: string,
    group1?: {
        field2: string
    }
}

export function SimpleForm() {
    const [formValues, setFormValues] = React.useState<IFormValues<FormData>>({ fields: { values: { 
        input: '',
        checkbox: 'asd',
        radio: 'aaa',
        select: '1'
    } }});
    
    function submit() {
        validateForm(formValues, () => {}, (values) => { setFormValues(values) });
    }

    return (
        <Form values={formValues} onChange={(values) => { setFormValues(values) }} inspect>
            <Field name={'input'} require>
                {(bindings) => <input {...bindings}/>}
            </Field>

            <Field name={'checkbox'} checkable checkedValue={'asd'}>
                {(bindings) => <input type={'checkbox'} {...bindings}/>}
            </Field>

            <Field name={'radio'} checkable checkedValue={'aaa'}>
                {(bindings) => <input type={'radio'} {...bindings}/>}
            </Field>

            <Field name={'radio'} checkable checkedValue={'bbb'}>
                {(bindings) => <input type={'radio'} {...bindings}/>}
            </Field>

            <Field name={'select'}>
                {(bindings) => 
                    <select {...bindings}>
                        <option value={'1'}>Opt 1</option>
                        <option value={'2'}>Opt 2</option>
                        <option value={'3'}>Opt 3</option>
                    </select>
                }
            </Field>

            {formValues.fields.values.input !== '123' && 
                <Field name={'group1.field2'}>
                    {(bindings) => <input {...bindings}/>}
                </Field>
            }

            <button onClick={submit}>Submit</button>
        </Form>
    )
}