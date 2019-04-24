import * as React from 'react'
import { ContextedField } from './contextedField';
import * as OPath from 'object-path';
import { FieldState } from './interfaces/fieldData';
import { FieldStatus } from './interfaces/fieldStatus';
import { FormInspector } from './inspectors/formInspector';
import { IFormFieldValues } from './interfaces/iFormFieldValues';
import { FormStatus } from './interfaces/formStatus';
import { FormContext } from './contexts/formContext';

export interface IFormProps<TData> {
    inspect?: boolean
    fieldValues?: TData
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
    private fieldGroupsEntered: string[] = []
    private fieldRefs: React.RefObject<ContextedField>[] = []
    private validationCounter: number = 0

    state: Readonly<IFormState<TData> & TState> = {
        ...this.state,
        formId: (Form.formCount++).toString(),
        fieldValues: {} as TData,
        fieldStatus: {},
        formStatus: {},
    }

    ///////////////////////////////////////////////////////////
    // Tree search & rebuild

    constructor(props: any) {
        super(props);
        this.submit = this.submit.bind(this);
    }

    ///////////////////////////////////////////////////////////
    // Props manipulation

    private setFieldStatus(fieldName: string, prop: string, value: any) {
        const fieldStats = OPath.get(this.state.fieldStatus, `${fieldName}.${prop}`)
        
        if (fieldStats == value)
            return

        this.setState((prevState) => { 
            OPath.set(prevState.fieldStatus, `${fieldName}.${prop}`, value)
            
            if(prop == 'isValidating' && !value)
                OPath.set(prevState.fieldStatus, `${fieldName}.hasValidated`, true)

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
        if (this.props.fieldValues)
            return
        
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

    getFieldValue(name: string): any {
        if (this.props.fieldValues)
            return OPath.get(this.props.fieldValues!, name);
        else 
            return OPath.get(this.state.fieldValues, name);
    }

    getFieldData(name: string): FieldState {
        return {
            ...OPath.get(this.state.fieldStatus, name),
            value: this.getFieldValue(name)
        }
    }

    /////////////////////////////////////////////////////////
    // Validations

    async validate() {
        const fieldsThatDHaventValidateYet = this.fieldRefs.filter((ref) => {
            const fieldData = ref.current!.getFieldData()
            return !fieldData.hasValidated
        })
        const validators = fieldsThatDHaventValidateYet.map((fRef) => fRef.current!.validate())
        await Promise.all(validators);
        return this.fieldRefs.filter((ref) => { 
            const fieldData = ref.current!.getFieldData()
            return fieldData.errors && fieldData.errors.length
        }).map((ref) => { return ref.current!.getFieldData() })
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

            newFormStatus.hasValidated = formStatus.hasValidated
            newFormStatus.isValidating = this.validationCounter > 0
            newFormStatus.hasErros = formStatus.hasErros
        }

        return newFormStatus
    }

    getFormStatus() {
        let status:FormStatus = {}
        status.hasValidated = true;

        for (let i = 0; i < this.fieldRefs.length; i++) {
            const fieldData = this.fieldRefs[i].current!.getFieldData();
            status.isValidating = status.isValidating || fieldData.isValidating
            status.dirty = status.dirty || fieldData.dirty
            status.hasErros = status.hasErros || (fieldData.errors && fieldData.errors.length ? true : false)

            if (status.hasValidated === true && !fieldData.hasValidated)
                status.hasValidated = false;
        } 
        
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
            if (result.length > 0) 
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
        return <>
            <FormContext.Provider value={{ form: this }}>
                <FormInspector form={this as Form} inspect={!!this.props.inspect}>
                    {this.props.children && this.props.children!(this.submit, this.state)}
                    {this.renderFields()}
                </FormInspector>
            </FormContext.Provider>
        </>
    }
}