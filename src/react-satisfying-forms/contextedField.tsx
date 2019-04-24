import * as React from 'react'
import { Form } from './form';
import { FieldActions } from './interfaces/fieldActions';
import { FieldBidings } from './interfaces/fieldBidings';
import { requiredValidator as requiredValidator } from './validations/exampleValidators';
import { FieldValidator } from './interfaces/fieldValidator';
import { FieldInspector } from './inspectors/fieldInspector';
import * as Debounce from 'debounce'
import { ValidationManager } from './validations/validatonManager';

export interface ContextedFieldProps extends FieldActions {
    // injected by the Field component
    form?: Form 
    fieldGroups?: string[]

    // inform  by the user
    innerFieldRef?: (ref: React.RefObject<any>) => void
    name: string
    alias?: string
    
    // When using staless
    value?: any
    checked?: boolean

    extraValidators?: FieldValidator[]
    required?: boolean

    inspect?: boolean
    useDebounce?: boolean
    children?: (bidings: FieldBidings) => React.ReactNode
}

export interface ContextedFieldState {
    value: any
}

export abstract class ContextedField extends React.Component<ContextedFieldProps> {
    
    private validators: FieldValidator[] = []
    private fullName: string
    private debouncedOnchange: any;
    private validationManager: ValidationManager
    private innerFieldRef: React.RefObject<any>

    state: Readonly<ContextedFieldState> = {
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
        this.onChangeValue = this.onChangeValue.bind(this)

        this.validationManager = new ValidationManager();

        if (this.props.required)
            this.validators.push(requiredValidator)
        if (this.props.extraValidators)
            this.validators = [...this.validators, ...this.props.extraValidators]

        this.debouncedOnchange = Debounce.debounce((value: any) => this.onChangeAfterDebouce(value), 200)
    }
    
    /////////////////////////////////////////////////////////
    // Info Getters

    getFullName() {
        const fieldGroups = this.props.fieldGroups || [] 
        return [...fieldGroups, this.props.name].join('.');
    }

    getFieldData() {
        return { 
            fullname: this.getFullName(),
            ...this.props.form!.getFieldData(this.fullName) 
        } 
    }

    /////////////////////////////////////////////////////////
    // Validations

    async validate() {
        return new Promise((resolve) => {
            const fieldData = this.props.form!.getFieldData(this.fullName)
            this.props.form!.setFieldValidating(this.fullName, true);
            this.validationManager.validate(fieldData, this.validators, (error) => { this.vadationError(error) }, (errors) => { this.validationEnd(); resolve(); })
        })
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

        const fieldData = this.getFieldData()
        
        if (!fieldData.hasValidated)
            this.validate()
    }

    onClick(evt: any) {
        if (this.props.onClick)
            this.props.onClick(evt);
    }

    /**
     * This method envolves events. Particulary html events
     * @param evt 
     */
    onChange(evt: any) {
        const value = evt.target ? evt.target.value : evt
        this.setFieldValue(value);
    }

    onChangeValue(value?: any) {
        this.setFieldValue(value);
    }

    setFieldValue(value:any) {
        this.setState(() => ({ value }))
        if (this.props.useDebounce === false) {
            this.onChangeAfterDebouce(value)
        } else {
            this.debouncedOnchange(value)
        }
    }

    /**
     * Flag the event as persisted, to prevent react egine
     * to discart it.
     * @param evt 
     */
    persistEvent(evt: any) {
        evt.persist();
    }

    async onChangeAfterDebouce(value: any) {
        await this.props.form!.setFieldValue(this.fullName, value)
        
        if (this.props.onChange)
            this.props.onChange(value);
        
        this.validate()
    }

    /////////////////////////////////////////////////////////
    // Rendering

    abstract renderField(fieldBindings: FieldBidings): React.ReactNode

    render() {
        const fieldBidings: FieldBidings = {
            ref: this.innerFieldRef,
            value: this.props.value || this.state.value,
            onChange: this.onChange,
            onClick: this.onClick,
            onBlur: this.onBlur,
            onFocus: this.onFocus,
            onChangeValue: this.onChangeValue
        }
        return <FieldInspector field={this} inspect={!!this.props.inspect}>
                {this.renderField && this.renderField(fieldBidings)}
                {this.props.children && this.props.children(fieldBidings)}
            </FieldInspector>
    }
}