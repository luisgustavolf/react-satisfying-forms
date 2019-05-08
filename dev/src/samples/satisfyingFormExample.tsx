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

interface DTOPerson {
    name: string
    forign: boolean
}

export function SatisfyingFormExample() {
    const formRef = React.createRef<Form<DTOPerson>>();
    
    const [person, setPerson] = React.useState<DTOPerson>({
        name: 'John',
        forign: false 
    })

    function handleFieldValuesChange(fieldValues: DTOPerson) {
        console.log(fieldValues)
        setPerson(fieldValues)
    }

    function handleSubmit(fields: DTOPerson) {
        console.log(fields);
    }

    function handleCityChange(evt: any) {
        console.log(evt)
    }

    const validations:FieldValidations<DTOPerson> = {
        name: () => [requiredValidator, delayedBobValidator]
    }

    return <>
    <Form<DTOPerson> onSubmit={handleSubmit} inspect>
        {(submit, state) => 
            <React.Fragment>
                <button onClick={submit}>Submit</button>
                <div>
                    <div>Input</div>
                    <InputField fName='name' fRequired fExtraValidators={[delayedBobValidator]}/>
                </div>
                <div>
                    <div>Select</div>
                    <SelectField fName='cities' onChange={handleCityChange}>
                        <option>Opt 1</option>
                        <option>Opt 2</option>
                        <option>Opt 3</option>
                    </SelectField>
                </div>
                
                {state.fieldValues.forign && 
                    <div>
                        <div>Descriço do pais</div>
                        <TextAreaField fName='text'/>
                    </div>
                }
                
                <div>
                    <div>Checkbox</div>
                    <CheckboxField fName='forign'/> Checkbox 1
                </div>

                <FieldGroup name={'external_data'}>
                    <div>RadioButtons</div>
                    <RadioButtonField fName='coutry' value='brazil'/> Brazil
                    <RadioButtonField fName='coutry' value='usa' /> USA
                    <RadioButtonField fName='coutry' value='angola' /> Angola
                </FieldGroup>
            </React.Fragment>
        }
    </Form>
    </>
}