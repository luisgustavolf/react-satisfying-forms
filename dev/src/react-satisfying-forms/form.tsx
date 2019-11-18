import * as React from 'react'
import * as OPath from 'object-path';
import { FieldStatusWithValue } from './interfaces/fieldStatusWithValue';
import { FieldStatus } from './interfaces/fieldStatus';
import { FormInspector } from './inspectors/formInspector';
import { IFormFieldValues as FormFieldValues } from './interfaces/iFormFieldValues';
import { FormStatus } from './interfaces/formStatus';
import { FormContext } from './contexts/formContext';
import { FieldValidations } from './interfaces/fieldValidations';
import { FieldValidator } from './interfaces/fieldValidator';
import { FormValidationManager } from './validations/formValidationManager';
import { FormSubmit, FormSubmitProps } from './formSubmit';
import { FormState, FormStateProps } from './formState';
import { FormFieldsValues, FormFieldsValuesProps } from './formValues';

export interface FormProps<TData> {
    inspect?: boolean
    onlyRegisteredFields?:boolean
    initialValues?: TData
    fieldsValues?: TData
    fieldsValidations?: FieldValidations<TData>
    onSubmit?: (fieldsValues: TData) => void
    onChange?: (fieldsValues: TData) => void
    children?: React.ReactNode
}

export interface FormState<TData> extends FormFieldValues<TData> {
    formId: string
    fieldsStatus: { 
        [fieldName: string]: FieldStatus 
    }
    formStatus: FormStatus
}

export class Form<TData extends Object = {}, TProps extends Object = {}, TState extends Object = {}> 
        extends React.Component<FormProps<TData> & TProps, FormState<TData> & TState> {
    
    static formCount: number = 0
    static Submit: (props: FormSubmitProps) => JSX.Element
    static State: <TData>(props: FormStateProps<TData>) => JSX.Element
    static Values: <TData>(props: FormFieldsValuesProps<TData>) => JSX.Element
    
    private validationCounter: number = 0
    private formValidationManager: FormValidationManager<any>

    public registeredFields: string[] = []

    state: Readonly<FormState<TData> & TState> = {
        ...this.state,
        formId: (Form.formCount++).toString(),
        fieldsValues: this.props.initialValues || {} as TData,
        fieldsStatus: {},
        formStatus: {},
    }

    ///////////////////////////////////////////////////////////
    // Tree search & rebuild

    constructor(props: any) {
        super(props);
        this.submit = this.submit.bind(this);
        
        this.formValidationManager = new FormValidationManager<TData>()
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    ///////////////////////////////////////////////////////////
    // Flags

    get isStaless() {
        return !!(this.props.fieldsValues)
    }

    get fieldValues() {
        return this.isStaless ? this.props.fieldsValues! : this.state.fieldsValues
    }

    ///////////////////////////////////////////////////////////
    // Props manipulation

    private setFieldStatus(fieldName: string, prop: string, value: any) {
        if (this.state.fieldsStatus[fieldName] && this.state.fieldsStatus[fieldName][prop] === value)
            return

        this.setState((prevState) => { 
            //prevState.fieldsStatus[fieldName] = { ...prevState.fieldsStatus[fieldName], [prop]: value }
            const pState = {
                ...prevState,
                fieldsStatus: { 
                    ...prevState.fieldsStatus, 
                    [fieldName]: {
                        ...prevState.fieldsStatus[fieldName], 
                        [prop]: value
                    }
                }
            }
            
            if(prop === 'isValidating' && !value)
                pState.fieldsStatus[fieldName].hasValidated = true

            return { 
                fieldsStatus:  { ...pState.fieldsStatus }
            }
        }, () => { 
            this.updateFormStatusAfterFieldStatusChange(prop, value)
        })
    }

    updateFormStatusAfterFieldStatusChange(prop: string, value: any) {
        this.setState((prevState) => {
            const newFormStatus = this.getFormStatusAfterFieldStatusChange({...prevState.formStatus}, prop, value)
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

    setFieldsValues(values: TData) {
        this.setState({
            ...this.state,
            fieldsValues: values,
            fieldsStatus: {},
            formStatus: {}
        })
    }

    async setFieldValue(fieldName: string, value: any) {
        if (this.isStaless) { 
            this.setFieldValueFromFieldValuesProp(fieldName, value) 
            this.validateField(fieldName)
            return Promise.resolve()
        } else {
            return this.setFieldValueFromState(fieldName, value).then(() => { 
                this.validateField(fieldName)
                return Promise.resolve()
            });
        }
    }

    private async setFieldValueFromState(fieldName: string, value: any) {
        return new Promise((resolve) => {
            this.setState((prevState) => { 
                this.verifyIfParentIsNull(prevState, fieldName)
                OPath.set(prevState.fieldsValues, fieldName, value)
                return { fieldsValues:  {...prevState.fieldsValues }}
            }, () => {
                this.setFieldDirty(fieldName);
                
                if(this.props.onChange)
                    this.props.onChange({...this.state.fieldsValues});
                
                resolve();
            })
        })
    }
    
    // Prevent child values to be seted, from a null parent,
    // causing errors on typing new valuess
    private verifyIfParentIsNull(state: (FormState<TData> & TState), fieldName: string) {
        const parents = fieldName.split('.');
        parents.forEach((parent, index) => {
            const pathParts = parents.slice(0, index);
            const path = pathParts.join('.');

            if (OPath.get(state.fieldsValues, path) === null) {
                OPath.set(state.fieldsValues, path, {})
            }
        })
    }

    private async setFieldValueFromFieldValuesProp(fieldName: string, value: any) {
        let fieldValues = {...this.props.fieldsValues}
        OPath.set(fieldValues, fieldName, value)
        this.setFieldDirty(fieldName);
                
        if(this.props.onChange)
            this.props.onChange(fieldValues as TData);

        return Promise.resolve()
    }

    getFieldValue(fieldName: string): any {
        return OPath.get(this.fieldValues, fieldName);
    }

    getFieldStatus(fieldName: string): FieldStatusWithValue {
        return {
            ...this.state.fieldsStatus[fieldName],
            value: this.getFieldValue(fieldName)
        }
    }

    async removeField(fieldName: string, removeChildStatus: boolean = true) {
        if (!OPath.has(this.state.fieldsValues, fieldName))
            return
        
        return new Promise((resolve) => { 
            this.setState((prev) => {
                OPath.del(prev.fieldsValues, fieldName)
                this.removeFieldStatus(prev, fieldName, removeChildStatus)
                return { ...prev }
            }, () => { 
                this.updateFormStatus().then(() => resolve())
            })
        })
    }

    private removeFieldStatus(state: FormState<TData>, fieldName: string, includeChildren: boolean = true) {
        Object.keys(state.fieldsStatus).forEach((key) => {
            if (key === fieldName || (includeChildren && key.indexOf(`${fieldName}.`) > -1))
                delete state.fieldsStatus[key]
        })
        
        const indexRegexp = /\.(\d{1,})$/
        
        // Verify if its a array prop
        if (indexRegexp.test(fieldName)) {
            let initialIndex = parseInt(fieldName.match(indexRegexp)![1])
            
            while(true) {
                const presProp = fieldName.replace(indexRegexp, `.${initialIndex}`);
                const nextProp = fieldName.replace(indexRegexp, `.${initialIndex + 1}`);
                
                if (!OPath.has(state, nextProp))
                    break
                
                OPath.set(state, presProp, OPath.get(state, nextProp))
                initialIndex++
            }
        }

        return state
    }

    /////////////////////////////////////////////////////////
    // Fieldregistration

    registerField(fieldName: string) {
        this.registeredFields.push(fieldName);
    }

    unregisterField(fieldName: string) {
        const index = this.registeredFields.findIndex((f) => fieldName);
        if (index > -1) {
            this.registeredFields.splice(index, 0);
        }
    }

    /////////////////////////////////////////////////////////
    // Validations

    registerFieldValidators(fieldname: string, validators: FieldValidator[]) {
        this.formValidationManager.registerFieldValidations(fieldname, (fieldValues) => validators)
    }
    
    async validateField(fieldName: string) {
        const validationsAttrs = this.formValidationManager.getFieldValidations(fieldName);
        
        if (validationsAttrs === undefined)
            return 
        
        this.setFieldValidating(fieldName, true);
        const validations = validationsAttrs.validations(this.fieldValues)
        return new Promise((resolve) => {
            validationsAttrs.validationManager.validate(
                this.getFieldValue(fieldName), 
                validations, 
                (errors) => { this.setFieldErros(fieldName, errors); },
                (errors) => { this.setFieldValidating(fieldName, false); resolve(errors) })
        })
    }

    async validate() {
        const fieldsWithValidators = this.formValidationManager.getFieldsWithValidations()
        
        if (!fieldsWithValidators)
            return
        
        const fieldsThatHaventValidateYet = fieldsWithValidators.filter((fieldname) => {
            const fieldStatus = this.getFieldStatus(fieldname);
            return !fieldStatus.hasValidated
        })

        const validators = fieldsThatHaventValidateYet.map((fieldname) => this.validateField(fieldname))
        await Promise.all(validators);
        return fieldsWithValidators.filter((fieldname) => { 
            const fieldData = this.getFieldStatus(fieldname)
            return fieldData.errors && fieldData.errors.length
        }).map(fieldname => ({ 
            fieldname, 
            errors: this.getFieldStatus(fieldname).errors 
        }))
    }

    /////////////////////////////////////////////////////////
    // Form Status

    getFormStatusAfterFieldStatusChange(prevFormStatus: FormStatus, fieldProp: any, fieldValue: any) {
        const formStatus = this.getFormStatus();
        let newFormStatus:FormStatus = {...prevFormStatus}
            
        if (fieldProp === 'dirty') {
            newFormStatus.dirty = true
        } else if (fieldProp === 'isValidating') {
            fieldValue === true ? this.validationCounter++ : this.validationCounter--
        }
        
        newFormStatus.isValidating = this.validationCounter > 0
        newFormStatus.hasValidated = formStatus.hasValidated
        newFormStatus.hasErrors = formStatus.hasErrors

        return newFormStatus
    }

    async updateFormStatus() {
        const formStatus = this.getFormStatus();
        return new Promise(resolve => {
            this.setState((prev) => ({
                formStatus: {...prev.formStatus, ...formStatus}
            }), () => resolve())
        })
    }

    getFormStatus() {
        let status:FormStatus = {}
        status.hasValidated = true;

        for (const key in this.state.fieldsStatus) {
            if (this.state.fieldsStatus.hasOwnProperty(key)) {
                const fieldStatus = this.state.fieldsStatus[key];
                status.isValidating = status.isValidating || fieldStatus.isValidating
                status.dirty = status.dirty || fieldStatus.dirty
                status.hasErrors = status.hasErrors || (fieldStatus.errors && fieldStatus.errors.length ? true : false)
            } 
        }

        const fieldsWValidations = this.formValidationManager.getFieldsWithValidations()
        const fieldsValidated = fieldsWValidations.filter(fieldname => {
            return this.getFieldStatus(fieldname).hasValidated === true
        })

        status.hasValidated = fieldsValidated.length === fieldsWValidations.length

        return status
    }

    async submit() {
        this.log('submiting...')
        if (this.state.formStatus.isValidating) {
            this.log('form is validating...')
            return false
        } else if (!this.state.formStatus.hasValidated) {
            this.log('form needs validation. Validating...')
            const result = await this.validate();
            if (result && result.length > 0) {
                this.log('form have some errors...')
                return false;
            }
        } else if (this.state.formStatus.hasErrors) {
            this.log('form have some errors...')
            return false
        } 
        
        const values = this.getFilteredFieldValues();

        if(this.props.onSubmit) 
            this.props.onSubmit(values)

        return values;
    }

    getFilteredFieldValues() {
        const finalValues = { } as TData;
        
        if (this.props.onlyRegisteredFields === false)
            return {...this.state.fieldsValues};

        this.registeredFields.forEach((fieldName) => {
            if (OPath.has(this.state.fieldsValues, fieldName)) {
                OPath.set(finalValues, fieldName, OPath.get(this.state.fieldsValues, fieldName));
            }
        })

        return finalValues            
    }

    /////////////////////////////////////////////////////////
    // Handlers

    handleSubmit(evt: React.KeyboardEvent<HTMLDivElement>) {
        if (evt.keyCode === 13) {
            this.submit();
        }
    }

    /////////////////////////////////////////////////////////
    // Render events

    // componentDidUpdate() {
    //     this.logTimeEnd(`Form#${this.state.formId} update`)
    // }

    // componentDidMount() {
    //     this.logTimeEnd(`Form#${this.state.formId} mount`)
    // }

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
     * When using inheritance, use this method as a replacement
     * for the defaults 'render'.
     */
    renderFields():React.ReactNode {
        return <React.Fragment />
    }

    render () {
        return <>
            <FormContext.Provider value={{ form: this as any }}>
                <FormInspector form={this as Form} inspect={!!this.props.inspect}>
                    <div onKeyDownCapture={this.handleSubmit}>
                        {this.props.children}
                        {this.renderFields()}
                    </div>
                </FormInspector>
            </FormContext.Provider>
        </>
    }
}


Form.Submit = FormSubmit
Form.State = FormState
Form.Values = FormFieldsValues