import * as React from 'react'
import { StatelessForm } from './statelessForm';
import { IFieldBidings } from './interfaces/iFieldBidings';
import { IFieldActions } from './interfaces/iFieldActions';
import { FieldProps } from './field';
import { IFieldValidator } from './interfaces/iFieldValidator';
import { requiredValidator } from './validations/requiredValidator';
import { IFormValues } from './interfaces/iFormValues';

export interface ContextedFieldProps extends FieldProps { 
    form: StatelessForm<any>
}

export class ContextedField extends React.Component<ContextedFieldProps> {
    
    onClick() {
        const formValues = this.props.form.setFieldInfo(this.props.name, 'touched', true, this.props.form.props.values)
        this.props.form.dispatchChanges(formValues)
    }

    onFocus() {
    }

    onBlur(evt: React.FocusEvent<any>) {
        let nextValues = this.props.form.setFieldInfo(this.props.name, 'touched', true, this.props.form.props.values)
        this.props.form.dispatchChanges(nextValues)
    }

    onChange(evt: React.ChangeEvent<any>) {
        if (this.props.disabled)
            return

        let nextValues: IFormValues<any>
        
        if (this.props.checkable && this.props.checkedValue && evt.target.checked !== undefined) {
            if (evt.target.checked)
                nextValues = this.props.form.setFieldValue(this.props.name, this.props.checkedValue, this.props.form.props.values);
            else 
                nextValues = this.props.form.setFieldValue(this.props.name, undefined, this.props.form.props.values);
        } else {
            nextValues = this.props.form.setFieldValue(this.props.name, evt.target.value, this.props.form.props.values);
        }
        
        this.props.form.dispatchChanges(nextValues)
    }
    
    //////////////////////////////////////////////////////////
    // Validations

    getValidators() {
        let validators: IFieldValidator[] = [];
        
        if (this.props.require) {
            validators.push(requiredValidator);
        }

        if (this.props.validators) {
            validators = validators.concat(this.props.validators);
        }

        return validators;
    }

    //////////////////////////////////////////////////////////
    // Render

    componentDidMount() {
        this.props.form.registerFieldValidations(this.props.name, this.getValidators());
    }

    componentWillUnmount() {
        this.props.form.unRegisterFieldValidations(this.props.name)
    }

    //////////////////////////////////////////////////////////
    // Render

    render() {
        const fieldStatus = this.props.form.getFieldInfos(this.props.name);
        
        const fieldActions:IFieldActions = {
            onChange: (args) => this.onChange(args),
            onClick: (args) => this.onClick(),
            onBlur: (args) => this.onBlur(args),
            onFocus: (args) => this.onFocus(),
        }
        
        const fieldBidings: IFieldBidings = {
            value: this.props.form.getFieldValue(this.props.name) || '',
            name: this.props.name,
            checked: this.props.checkable && this.props.checkedValue ? this.props.form.getFieldIsChecked(this.props.name, this.props.checkedValue) : false,
            ...fieldStatus,
            ...fieldActions 
        }
        
        return (
            <React.Fragment>
                { this.props.children && this.props.children(fieldBidings) }
            </React.Fragment>
        )
    }

}