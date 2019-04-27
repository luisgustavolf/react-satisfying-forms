import * as React from 'react'
import { Form } from './form';
import { FieldActions } from './interfaces/fieldActions';
import { FieldBidings } from './interfaces/fieldBidings';
import { requiredValidator as requiredValidator } from './validations/exampleValidators';
import { FieldValidator } from './interfaces/fieldValidator';
import { FieldInspector } from './inspectors/fieldInspector';
import * as Debounce from 'debounce'
import { ValidationManager } from './validations/validatonManager';
import { FieldStatus } from './interfaces/fieldStatus';
import { FieldStatusWithErrorHint } from './interfaces/FieldStatusWithErrorHint';

export interface ContextedFieldProps extends FieldActions {
    // injected by the Field component
    fForm?: Form 
    fFieldGroups?: string[]

    // inform  by the user
    fInnerFieldRef?: (ref: React.RefObject<any>) => void
    fName: string

    fRequired?: boolean
    fExtraValidators?: FieldValidator[]
    
    fInspect?: boolean
    fUseDebounce?: boolean
    children?: (bidings: FieldBidings, fieldStatusWithErrorHint: FieldStatusWithErrorHint) => React.ReactNode
}

export interface ContextedFieldState {
    value: any
}

export abstract class ContextedField extends React.Component<ContextedFieldProps, ContextedFieldState> {
    private debouncedOnchange: any;
    private innerFieldRef: React.RefObject<any>
    private isDebouncing?: boolean

    state: Readonly<ContextedFieldState> = {
        value: ''
    }

    constructor(props: any) {
        super(props)
    
        this.innerFieldRef = React.createRef();

        if (this.props.fInnerFieldRef)
            this.props.fInnerFieldRef(this.innerFieldRef)

        this.onChange = this.onChange.bind(this);
        this.onClick = this.onClick.bind(this);
        this.onBlur = this.onBlur.bind(this);
        this.onFocus = this.onFocus.bind(this);

        this.debouncedOnchange = Debounce.debounce((value: any) => this.onChangeAfterDebouce(value), 200)

        this.registerValidators()
    }

    registerValidators() {
        const validators:FieldValidator[] = []
        
        if(this.props.fRequired)
            validators.push(requiredValidator)
        if(this.props.fExtraValidators)
            validators.concat(this.props.fExtraValidators)
    }

    /////////////////////////////////////////////////////////
    // Info Getters

    get fullName() {
        const fieldGroups = this.props.fFieldGroups || [] 
        return [...fieldGroups, this.props.fName].join('.');
    }

    getFieldStatus() {
        return { 
            fullname: this.fullName,
            ...this.props.fForm!.getFieldStatus(this.fullName) 
        } 
    }

    /////////////////////////////////////////////////////////
    // Proxy Events

    onFocus(evt: any) {
        if (this.props.onFocus)
            this.props.onFocus(evt);
    }
    
    onBlur(evt: any) {
        this.props.fForm!.setFieldTouched(this.fullName)
        
        if (this.props.onBlur)
            this.props.onBlur(evt);

        const fieldData = this.getFieldStatus()
        
        if (!fieldData.hasValidated)
            this.props.fForm!.validateField(this.fullName);
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

    setFieldValue(value:any) {
        this.setState(() => ({ value }))
        if (this.props.fUseDebounce === false) {
            this.onChangeAfterDebouce(value)
        } else {
            this.isDebouncing = true
            this.debouncedOnchange(value)
        }
    }

    verifyIfFieldValueCorrespondsToFormsValue() {
        const valueOnFormState = this.props.fForm!.getFieldValue(this.fullName);
        if (!this.isDebouncing && valueOnFormState && (valueOnFormState != this.state.value))
            this.setState({ value: valueOnFormState })
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
        this.isDebouncing = false
        
        await this.props.fForm!.setFieldValue(this.fullName, value)
        
        if (this.props.onChange)
            this.props.onChange(value);
        
        this.props.fForm!.validateField(this.fullName)
    }

    /////////////////////////////////////////////////////////
    // Render Cycle

    componentWillMount() {
        this.props.fForm!.registerField(this);
    }

    componentDidMount() {
        this.verifyIfFieldValueCorrespondsToFormsValue()
    }

    componentDidUpdate() {
        this.verifyIfFieldValueCorrespondsToFormsValue()
    }

    componentWillUnmount() {
        this.props.fForm!.unregisterField(this);
    }

    /////////////////////////////////////////////////////////
    // Rendering

   

    /////////////////////////////////////////////////////////
    // Rendering

    render() {
        const fieldStatus = this.getFieldStatus()
        const fieldStatusWithErrorHint:FieldStatusWithErrorHint = { 
            ...fieldStatus,
            shouldDisplayErrors: !!((fieldStatus.hasValidated || fieldStatus.touched || fieldStatus.dirty) && fieldStatus.errors)
        }

        console.log(fieldStatusWithErrorHint.shouldDisplayErrors, fieldStatus.errors)

        const fieldBidings: FieldBidings = {
            ref: this.innerFieldRef,
            value: this.state.value,
            onChange: this.onChange,
            onClick: this.onClick,
            onBlur: this.onBlur,
            onFocus: this.onFocus,
        }

        return <FieldInspector field={this} inspect={!!this.props.fInspect}>
                {this.props.children && this.props.children(fieldBidings, fieldStatusWithErrorHint)}
            </FieldInspector>
    }
}