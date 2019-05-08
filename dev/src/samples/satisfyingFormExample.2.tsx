import * as React from 'react'
import { Form } from '../react-satisfying-forms/form';
import { InputField } from '../rsf-default-fields/inputField';
import { SelectField } from '../rsf-default-fields/selectField';
import { TextAreaField } from '../rsf-default-fields/textArea';
import { CheckboxField } from '../rsf-default-fields/checkboxField';
import { RadioButtonField } from '../rsf-default-fields/radioButton';
import { FieldGroup } from '../react-satisfying-forms/fieldGroup';
import { FieldValidations } from '../react-satisfying-forms/interfaces/fieldValidations';
import { requiredValidator, delayedBobValidator } from '../react-satisfying-forms/validations/exampleValidators';
import { Field } from '../react-satisfying-forms';

interface DTOPerson {
    name: string
    forign: boolean
}

export function ListExample() {
    const formRef = React.createRef<Form<any>>();
    const initialValues = {
        obj: [{id: 0}, {id: 1}, {id: 2}]
    }

    function removeItem(index: number) {
        formRef.current!.removeField(`obj.${index}`)
    }

    function addItem() {
        const itens = formRef.current!.state.fieldValues.obj.length
        formRef.current!.setFieldValue(`obj.${itens}`, {})
        formRef.current!.setFieldValue(`a.b.c`, Math.random())
    }

    return <>
    <Form<any> ref={formRef} inspect initialValues={initialValues}>
        {(submit, state) => 
            <React.Fragment>
                <div>
                    <Field fName='a.b.c'>
                        {(props, status) => 
                            <input {...props}/>
                        }
                    </Field>
                </div>

                <button onClick={submit}>Submit</button>
                {state.fieldValues.obj.map((el: any, index: number) => 
                    <div key={index}>
                        <InputField fName={`obj.${index}.id`}/>
                        <div onClick={() => removeItem(index)}>Remove</div>
                    </div>
                )}        
                <div onClick={() => addItem()}>addItem</div>
            </React.Fragment>
        }
    </Form>
    </>
}