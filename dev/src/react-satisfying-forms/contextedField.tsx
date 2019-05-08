import * as React from 'react'
import { Form } from './form';
import { FieldActions } from './interfaces/fieldActions';
import { FieldBidings } from './interfaces/fieldBidings';
import { requiredValidator as requiredValidator } from './validations/exampleValidators';
import { FieldValidator } from './interfaces/fieldValidator';
import { FieldInspector } from './inspectors/fieldInspector';
import * as Debounce from 'debounce'
import { FieldStatusWithErrorHint } from './interfaces/FieldStatusWithErrorHint';

export interface ContextedFieldProps {
    // injected by the Field component
    fForm?: Form 
    fFieldGroups?: string[]

    // inform  by the user
    fInnerFieldRef?: (ref: React.RefObject<any>) => void
    fName: string

    fCheckable?:boolean
    fCheckedValue?: any

    fRequired?: boolean
    fExtraValidators?: FieldValidator[]
    
    fInspect?: boolean
    fUseDebounce?: boolean
    
    fOnClick?: (value: any) => void
    fOnBlur?: (value: any) => void
    fOnFocus?: (value: any) => void
    fOnChange?: (value: any) => void

    children?: (bidings: FieldBidings, fieldStatusWithErrorHint: FieldStatusWithErrorHint) => React.ReactNode
}

export interface ContextedFieldState {
    value: any,
    checked?: boolean
}

export abstract class ContextedField extends React.Component<ContextedFieldProps, ContextedFieldState> {
    private debouncedOnchange: any;
    private innerFieldRef: React.RefObject<any>
    private isDebouncing?: boolean
    private lastValidators: FieldValidator[] = []

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

        this.onChangeAfterDebouce = this.onChangeAfterDebouce.bind(this)
        this.debouncedOnchange = Debounce.debounce(this.onChangeAfterDebouce, 200)

        this.updateValidatorsOnFormIfNecessary();
    }

    /////////////////////////////////////////////////////////
    // Validations

    updateValidatorsOnFormIfNecessary() {
        if (this.validatorsAreTheSameAsLastOnes()) 
            return
        
        this.lastValidators = this.getValidators();
        this.props.fForm!.registerFieldValidators(this.fullName, this.lastValidators);
    }
    
    getValidators() {
        let validators:FieldValidator[] = []
        
        if(this.props.fRequired)
            validators.push(requiredValidator)
        if(this.props.fExtraValidators)
            validators = [...validators, ...this.props.fExtraValidators]
        
        return validators;
    }

    validatorsAreTheSameAsLastOnes() {
        const presentValidators = this.getValidators();
        
        if(this.lastValidators.length != presentValidators.length) 
            return false

        const validatorsCompared = this.lastValidators.filter((validator) => {
            return presentValidators.find((presentValidator) => {
                return presentValidator == validator
            })
        })

        return validatorsCompared.length == this.lastValidators.length
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
        if (this.props.fOnFocus)
            this.props.fOnFocus(evt);
    }
    
    onBlur(evt: any) {
        this.props.fForm!.setFieldTouched(this.fullName)
        
        if (this.props.fOnBlur)
            this.props.fOnBlur(evt);

        const fieldData = this.getFieldStatus()
        
        if (!fieldData.hasValidated)
            this.props.fForm!.validateField(this.fullName);
    }

    onClick(evt: any) {
        if (this.props.fOnClick)
            this.props.fOnClick(evt);
    }

    /**
     * This method envolves events. Particulary html events
     * @param evt 
     */
    async onChange(evt: any) {
        let value;
        
        if (this.props.fCheckable) {
            const isChecked = evt && evt.target && evt.target.checked
            value = isChecked ? this.props.fCheckedValue : undefined
        } else {
            value = evt && evt.target ? evt.target.value : evt
        }

        this.setFieldValue(value, () => {
            if (this.props.fOnChange)
                this.props.fOnChange(evt);
        });
    }

    setFieldValue(value:any, cb: () => void) {
        this.setState(() => ({ value }))
        if (this.props.fUseDebounce === false) {
           this.onChangeAfterDebouce(value, cb)
        } else {
            this.isDebouncing = true
            this.debouncedOnchange(value, cb)
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

    async onChangeAfterDebouce(value: any, cb: () => void) {
        this.isDebouncing = false
        await this.props.fForm!.setFieldValue(this.fullName, value)
        cb();
    }

    verifyIfFieldValueCorrespondsToFormsValue() {
        const valueOnFormState = this.props.fForm!.getFieldValue(this.fullName);
        if (!this.isDebouncing && valueOnFormState && (valueOnFormState != this.state.value))
            this.setState({ value: valueOnFormState })
    }

    /////////////////////////////////////////////////////////
    // Render Cycle

    componentWillMount() {
    }

    componentDidMount() {
        this.verifyIfFieldValueCorrespondsToFormsValue()
    }

    componentDidUpdate() {
        this.verifyIfFieldValueCorrespondsToFormsValue()
        this.updateValidatorsOnFormIfNecessary()
    }

    componentWillUnmount() {
    }

    /////////////////////////////////////////////////////////
    // Rendering

   

    /////////////////////////////////////////////////////////
    // Rendering

    render() {
        const fieldStatus = this.getFieldStatus()
        const fieldStatusWithErrorHint:FieldStatusWithErrorHint = { 
            ...fieldStatus,
            shouldDisplayErrors: !!((fieldStatus.hasValidated || fieldStatus.touched || fieldStatus.dirty) && fieldStatus.errors && fieldStatus.errors.length)
        }

        let fieldBidings: FieldBidings = {
            ref: this.innerFieldRef,
            value: this.state.value,
            onChange: this.onChange,
            onClick: this.onClick,
            onBlur: this.onBlur,
            onFocus: this.onFocus,
        }

        if (this.props.fCheckable && this.state.value !== undefined)
            fieldBidings = { ...fieldBidings, checked: this.state.value == this.props.fCheckedValue}

        return <FieldInspector field={this} inspect={!!this.props.fInspect}>
                {this.props.children && this.props.children(fieldBidings, fieldStatusWithErrorHint)}
            </FieldInspector>
    }
}