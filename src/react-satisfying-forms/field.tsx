import * as React from 'react'
import { Form } from './form';
import { IFieldActions } from './interface/iFieldActions';
import { IFieldBidings } from './interface/iFieldBidings';
import { RequiredValidation as requiredValidator } from './validations/requiredValidation';
import { IFieldValidator } from './interface/iFieldValidator';
import { FieldInspector } from './inspector/fieldInspector';


export interface IFieldProps extends IFieldActions {
    // injected by the owner form
    form?: Form 
    fieldGroups?: string[]

    // inform  by the user
    name: string
    alias?: string
    validators?: IFieldValidator[]
    required?: boolean
    inspect?: boolean
    children?: (bidings: IFieldBidings) => React.ReactNode
}

export class Field extends React.Component<IFieldProps> {
    
    private Wrapper: any
    private validators: IFieldValidator[] = []

    constructor(props: any) {
        super(props)
        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);

        if (this.props.required)
            this.validators.push(requiredValidator)
        if (this.props.validators)
            this.validators = [...this.validators, ...this.props.validators]
    }
    
    getFullName() {
        return [...this.props.fieldGroups!, this.props.name].join('.');
    }

    getFieldData() {
        return this.props.form!.getFieldData(this.getFullName())
    }

    /////////////////////////////////////////////////////////
    // Validations

    async validate() {
        const fieldFullName = this.getFullName();
        const fieldData = this.props.form!.getFieldData(fieldFullName)

        this.props.form!.setFieldValidating(fieldFullName, true);
        
        const validationResults = this.validators.map((validator) => validator(fieldData.value))
        const resultFromAllValidadors = await Promise.all(validationResults)
        
        this.props.form!.setFieldValidating(fieldFullName, false);
        this.props.form!.setFieldErros(fieldFullName, resultFromAllValidadors)
    }

    /////////////////////////////////////////////////////////
    // Proxy Events

    onFocus(evt: any) {
        if (this.props.onFocus)
            this.props.onFocus(evt);
    }
    
    onBlur(evt: any) {
        this.props.form!.setFieldTouched(this.getFullName())
        
        if (this.props.onBlur)
            this.props.onBlur(evt);

        this.validate()
    }

    onClick(evt: any) {
        if (this.props.onClick)
            this.props.onClick(evt);
    }

    async onChange(evt: any) {
        const value = evt.target ? evt.target.value : evt
        await this.props.form!.setFieldValue(this.getFullName(), value)
        
        if (this.props.onChange)
            this.props.onChange(evt);
        
        this.validate()
    }

    /////////////////////////////////////////////////////////
    // Rendering

    render() {
        const fieldData = this.getFieldData()
        const fieldBidings: IFieldBidings = {
            value: fieldData.value || "",
            onChange: this.onChange,
            onClick: this.onClick,
            onBlur: this.onBlur,
            onFocus: this.onFocus
        }
        return <FieldInspector field={this} inspect={!!this.props.inspect}>
                {this.props.children && this.props.children(fieldBidings)}
            </FieldInspector>
    }
}