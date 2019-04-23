import * as React from 'react'
import { Form } from './form';
import { FieldActions } from './interface/fieldActions';
import { FieldBidings } from './interface/fieldBidings';
import { requiredValidator as requiredValidator } from './validations/requiredValidation';
import { FieldValidator } from './interface/fieldValidator';
import { FieldInspector } from './inspector/fieldInspector';
import * as Debounce from 'debounce'
import { any } from 'prop-types';
import { ValidationManager } from './validations/validatonManager';

export interface IFieldProps extends FieldActions {
    // injected by the owner form
    form?: Form 
    fieldGroups?: string[]

    // inform  by the user
    innerFieldRef?: (ref: React.RefObject<any>) => void
    name: string
    alias?: string
    
    validators?: FieldValidator[]
    required?: boolean

    inspect?: boolean
    useDebounce?: boolean
    children?: (bidings: FieldBidings) => React.ReactNode
}

export interface IFieldState {
    value: any
}

export class Field extends React.Component<IFieldProps> {
    
    private validators: FieldValidator[] = []
    private fullName: string
    private debouncedOnchange: any;
    private validationManager: ValidationManager
    private innerFieldRef: React.RefObject<any>

    state: Readonly<IFieldState> = {
        value: ''
    }

    constructor(props: any) {
        super(props)
    
        this.fullName = this.getFullName();

        this.innerFieldRef = React.createRef();

        if (this.props.innerFieldRef)
            this.props.innerFieldRef(this.innerFieldRef)

        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);
        
        this.validationManager = new ValidationManager();

        if (this.props.required)
            this.validators.push(requiredValidator)
        if (this.props.validators)
            this.validators = [...this.validators, ...this.props.validators]

        this.debouncedOnchange = Debounce.debounce((evt: any) => this.onChangeAfterDebouce(evt), 200)
    }
    
    /////////////////////////////////////////////////////////
    // Info Getters

    getFullName() {
        return [...this.props.fieldGroups!, this.props.name].join('.');
    }

    getFieldData() {
        return this.props.form!.getFieldData(this.fullName)
    }

    /////////////////////////////////////////////////////////
    // Validations

    async validate() {
        const fieldData = this.props.form!.getFieldData(this.fullName)
        this.props.form!.setFieldValidating(this.fullName, true);
        this.validationManager.validate(fieldData, this.validators, (error) => { this.vadationError(error) }, () => { this.validationEnd() })
    }

    vadationError(errors: string[]) {
        this.props.form!.setFieldErros(this.fullName, errors)
    }

    validationEnd() {
        this.props.form!.setFieldValidating(this.fullName, false);
    }

    /////////////////////////////////////////////////////////
    // Proxy Events

    onFocus(evt: any) {
        if (this.props.onFocus)
            this.props.onFocus(evt);
    }
    
    onBlur(evt: any) {
        this.props.form!.setFieldTouched(this.fullName)
        
        if (this.props.onBlur)
            this.props.onBlur(evt);

        this.validate()
    }

    onClick(evt: any) {
        if (this.props.onClick)
            this.props.onClick(evt);
    }

    onChange(evt: any) {
        if (this.props.useDebounce === false) {
            const value = evt.target ? evt.target.value : evt
            this.setState(() => ({ value }))
            this.onChangeAfterDebouce(evt)
        } else {
            evt.persist()
            const value = evt.target ? evt.target.value : evt
            this.setState(() => ({ value }))
            this.debouncedOnchange(evt)
        }
    }
    
    async onChangeAfterDebouce(evt: any) {
        const value = evt.target ? evt.target.value : evt
        await this.props.form!.setFieldValue(this.fullName, value)
        
        if (this.props.onChange)
            this.props.onChange(value);
        
        this.validate()
    }

    /////////////////////////////////////////////////////////
    // Rendering

    render() {
        //const fieldData = this.getFieldData()
        const fieldBidings: FieldBidings = {
            // value: fieldData.value || "",
            ref: this.innerFieldRef,
            value: this.state.value,
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