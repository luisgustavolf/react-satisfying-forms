import * as React from 'react'
import { Form } from './react-satisfying-forms/form';
import { InputField } from './rsf-default-fields/inputField';
import { SelectField } from './rsf-default-fields/selectField';
import { TextAreaField } from './rsf-default-fields/textArea';
import { CheckboxField } from './rsf-default-fields/checkboxField';
import { RadioButtonField } from './rsf-default-fields/radioButton';
import { FieldGroup } from './react-satisfying-forms/fieldGroup';

interface DTOPerson {
    name: string
    forign: boolean
}


export function SatisfyingFormExample() {
    const [person, setPerson] = React.useState<DTOPerson>({
        name: 'John',
        forign: true 
    })

    function handleFieldValuesChange(fieldValues: DTOPerson) {
        console.log(fieldValues)
        setPerson(fieldValues)
    }

    function handleCityChange(evt: any) {
        console.log(evt)
    }

    return <>
    <Form<DTOPerson> initialValues={person} inspect>
        {(submit, state) => 
            <React.Fragment>
                <div>
                    <div>Input</div>
                    <InputField fName='name' fInspect fRequired/>
                </div>
                <div>
                    <div>Select</div>
                    <SelectField fName='cities' onChange={handleCityChange} fInspect>
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