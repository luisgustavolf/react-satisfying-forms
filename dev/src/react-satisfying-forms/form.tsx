import * as React from 'react'
import * as OPath from 'object-path';
import { FieldStatusWithValue } from './interfaces/fieldStatusWithValue';
import { FieldStatus } from './interfaces/fieldStatus';
import { FormInspector } from './inspectors/formInspector';
import { IFormFieldValues } from './interfaces/iFormFieldValues';
import { FormStatus } from './interfaces/formStatus';
import { FormContext } from './contexts/formContext';
import { flattenObject } from './util/objectUtil';
import { FieldValidations } from './interfaces/fieldValidations';
import { FieldValidationManager } from './validations/fieldValidatonManager';
import { FieldValidator } from './interfaces/fieldValidator';
import { FormValidationManager } from './validations/formValidationManager';

export interface IFormProps<TData> {
    inspect?: boolean
    initialValues?: TData
    fieldValues?: TData
    fieldValidations?: FieldValidations<TData>
    onSubmit?: (fieldValues: TData) => void
    onChange?: (fieldValues: TData) => void
    children?: (handleSubmit: () => void, state: IFormState<TData>) => React.ReactNode
}

export interface IFormState<TData> extends IFormFieldValues<TData> {
    formId: string
    fieldStatus: { [fieldName: string]: FieldStatus }
    formStatus: FormStatus
}

export class Form<TData extends Object = {}, TProps extends Object = {}, TState extends Object = {}> 
        extends React.Component<IFormProps<TData> & TProps, IFormState<TData> & TState> {
    
    static formCount: number = 0
    private validationCounter: number = 0
    private fieldValidationManagers:{ [field: string]: FieldValidationManager } = {}
    private formValidationManager: FormValidationManager<any>

    state: Readonly<IFormState<TData> & TState> = {
        ...this.state,
        formId: (Form.formCount++).toString(),
        fieldValues: this.props.initialValues || {} as TData,
        fieldStatus: {},
        formStatus: {},
    }

    ///////////////////////////////////////////////////////////
    // Tree search & rebuild

    constructor(props: any) {
        super(props);
        this.submit = this.submit.bind(this);
        
        this.formValidationManager = new FormValidationManager<TData>()
    }

    ///////////////////////////////////////////////////////////
    // Flags

    get isStaless() {
        return !!(this.props.fieldValues)
    }

    get fieldValues() {
        return this.isStaless ? this.props.fieldValues! : this.state.fieldValues
    }

    ///////////////////////////////////////////////////////////
    // Props manipulation

    private setFieldStatus(fieldName: string, prop: string, value: any) {
        if (this.state.fieldStatus[fieldName] && this.state.fieldStatus[fieldName][prop] == value)
            return

        this.setState((prevState) => { 
            this.state.fieldStatus[fieldName] = { ...this.state.fieldStatus[fieldName], [prop]: value }
            
            if(prop == 'isValidating' && !value)
                this.state.fieldStatus[fieldName].hasValidated = true

            return { 
                fieldStatus:  { ...prevState.fieldStatus }
            }
        }, () => { 
            this.updateFormStatus(prop, value)
        })
    }

    updateFormStatus(prop: string, value: any) {
        this.setState((prevState) => {
            const newFormStatus = this.updateFormStatusAfterFieldStatusChange({...prevState.formStatus}, prop, value)
            return { formStatus: { ...prevState.formStatus, ...newFormStatus } }
        })
    }

    setFieldTouched(fieldName: string) {
        this.setFieldStatus(fieldName, 'touched', true)
    }

    setFieldDirty(fieldName: string) {
        this.setFieldStatus(fieldName, 'dirty', true)
    }

    setFieldErros(fieldName: string, errors: (string | undefined)[]) {
        this.setFieldStatus(fieldName, 'errors', errors)
    }

    setFieldValidating(fieldName: string, isValidating: boolean) {
        this.setFieldStatus(fieldName, 'isValidating', isValidating)
    }

    async setFieldValue(fieldName: string, value: any) {
        if (this.isStaless) { 
            this.setFieldValueFromFieldValuesProp(fieldName, value) 
            this.validateField(fieldName)
            return Promise.resolve()
        } else {
            this.setFieldValueFromState(fieldName, value).then(() => { 
                this.validateField(fieldName)
                return Promise.resolve()
            });
        }
    }

    private async setFieldValueFromState(fieldName: string, value: any) {
        return new Promise((resolve) => {
            this.setState((prevState) => { 
                OPath.set(prevState.fieldValues, fieldName, value)
                return { fieldValues:  {...prevState.fieldValues }}
            }, () => {
                this.setFieldDirty(fieldName);
                
                if(this.props.onChange)
                    this.props.onChange({...this.state.fieldValues});
                
                resolve();
            })
        })
    }

    private async setFieldValueFromFieldValuesProp(fieldName: string, value: any) {
        let fieldValues = {...this.props.fieldValues}
        OPath.set(fieldValues, fieldName, value)
        this.setFieldDirty(fieldName);
                
        if(this.props.onChange)
            this.props.onChange(fieldValues as TData);

        return Promise.resolve()
    }

    getFieldValue(name: string): any {
        return OPath.get(this.fieldValues, name);
    }

    getFieldStatus(name: string): FieldStatusWithValue {
        return {
            ...this.state.fieldStatus[name],
            value: this.getFieldValue(name)
        }
    }

    /////////////////////////////////////////////////////////
    // Validations

    registerFieldValidators(fieldname: string, validators: FieldValidator[]) {
        this.formValidationManager.registerFieldValidations(fieldname, (fieldValues) => validators)
    }
    
    async validateField(fieldName: string) {
        const validations = this.formValidationManager.getFielValidation(fieldName);
        
        if (validations === undefined)
            return 
        
        this.setFieldValidating(fieldName, true);

        return new Promise((resolve) => {
            validations.validationManager.validate(
                this.getFieldValue(fieldName), 
                validations.validations(this.fieldValues), 
                (errors) => { this.setFieldErros(fieldName, errors) },
                (errors) => { this.setFieldValidating(fieldName, false); resolve() })
        })
    }

    async validate() {
        if (!this.props.fieldValidations)
            return

        const fieldValidators = flattenObject(this.props.fieldValidations)
        const fieldsThatHaventValidateYet = Object.keys(fieldValidators).filter((key) => {
            const fieldStatus = this.getFieldStatus(key);
            return !fieldStatus.hasValidated
        })

        const validators = fieldsThatHaventValidateYet.map((fieldname) => this.validateField(fieldname))
        await Promise.all(validators);
        return Object.keys(fieldValidators).filter((fieldname) => { 
            const fieldData = this.getFieldStatus(fieldname)
            return fieldData.errors && fieldData.errors.length
        }).map(fieldname => this.getFieldStatus(fieldname))
    }

    /////////////////////////////////////////////////////////
    // Form Status

    updateFormStatusAfterFieldStatusChange(prevFormStatus: FormStatus, fieldProp: any, fieldValue: any) {
        const formStatus = this.getFormStatus();
        let newFormStatus:FormStatus = {...prevFormStatus}
            
        if (fieldProp == 'dirty') {
            newFormStatus.dirty = true
        } else if (fieldProp == 'isValidating') {
            fieldValue === true ? this.validationCounter++ : this.validationCounter--
        }
        
        newFormStatus.isValidating = this.validationCounter > 0
        newFormStatus.hasValidated = formStatus.hasValidated
        newFormStatus.hasErros = formStatus.hasErros

        return newFormStatus
    }

    getFormStatus() {
        let status:FormStatus = {}
        status.hasValidated = true;

        for (const key in this.state.fieldStatus) {
            if (this.state.fieldStatus.hasOwnProperty(key)) {
                const fieldStatus = this.state.fieldStatus[key];
                status.isValidating = status.isValidating || fieldStatus.isValidating
                status.dirty = status.dirty || fieldStatus.dirty
                status.hasErros = status.hasErros || (fieldStatus.errors && fieldStatus.errors.length ? true : false)
            } 
        }

        const fieldsWValidations = this.formValidationManager.getFieldnamesWithValidations()
        const fieldsValidated = fieldsWValidations.filter(fieldname => {
            return this.getFieldStatus(fieldname).hasValidated == true
        })
        
        console.log(fieldsWValidations, fieldsValidated)

        status.hasValidated = fieldsValidated.length == fieldsWValidations.length

        return status
    }

    async submit() {
        this.log('submit...')
        if (this.state.formStatus.isValidating) {
            this.log('form is validating...')
            return false
        } else if (!this.state.formStatus.hasValidated) {
            this.log('form needs validation. Validating...')
            const result = await this.validate();
            this.log('form have some errors...')
            if (result && result.length > 0) 
                return false;
        } else if (this.state.formStatus.hasErros) {
            this.log('form have some errors...')
            return false
        } 
        
        if(this.props.onSubmit) 
            this.props.onSubmit(this.state.fieldValues)

        return {...this.state.fieldValues}
    }

    /////////////////////////////////////////////////////////
    // Render events

    componentWillUpdate() {
        this.logTime(`Form#${this.state.formId} update`)
    }

    componentDidUpdate() {
        this.logTimeEnd(`Form#${this.state.formId} update`)
    }

    componentWillMount() {
        this.logTime(`Form#${this.state.formId} mount`)
    }

    componentDidMount() {
        this.logTimeEnd(`Form#${this.state.formId} mount`)
    }

    /////////////////////////////////////////////////////////
    // Render methods

    log(msg: string) {
        if (this.props.inspect)
            console.log(msg)
    }

    warn(msg: string) {
        if (this.props.inspect)
            console.warn(msg)
    }

    logTime(timerId: string) {
        if (this.props.inspect)
            console.time(timerId)
    }

    logTimeEnd(timerId: string) {
        if (this.props.inspect)
            console.timeEnd(timerId)
    }

    /////////////////////////////////////////////////////////
    // Render methods

    /**
     * When using inheritance, use this method as a replace
     * for the defaults 'render'.
     */
    renderFields():React.ReactNode {
        return <React.Fragment />
    }

    render () {
        let state = {
            ...this.state,
            fieldValues: this.props.fieldValues || this.state.fieldValues
        }
            
        return <>
            <FormContext.Provider value={{ form: this }}>
                <FormInspector form={this as Form} inspect={!!this.props.inspect}>
                    {this.props.children && this.props.children!(this.submit, state)}
                    {this.renderFields()}
                </FormInspector>
            </FormContext.Provider>
        </>
    }
}