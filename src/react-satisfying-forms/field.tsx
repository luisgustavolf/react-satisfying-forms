import * as React from 'react'
import { FormContext } from './contexts/formContext';
import { FieldGroupContext } from './contexts/fieldGroupContext';
import { ContextedField, ContextedFieldProps } from './contextedField';

export interface FieldProps extends ContextedFieldProps { }

export interface PureFieldProps extends FieldProps { 
    children?: any
}

export const Field = React.forwardRef<ContextedField, FieldProps>((props, ref) =>
    <FormContext.Consumer>
        {(formContextValues) =>
            <FieldGroupContext.Consumer>
                {(fieldGruopContextValues) =>
                    <ContextedField
                        ref={ref}
                        fForm={formContextValues.form}
                        fFieldGroups={fieldGruopContextValues.parentChain}
                        {...props}
                    />
                }
            </FieldGroupContext.Consumer>
        }
    </FormContext.Consumer>
)

export function fProps(args: {[key: string]: any}) {
    let newArgs: any = {}
    for (const key in args) {
        if (/f[A-Z]/g.test(key)) {
            newArgs[key] = args[key];
        }
    }
    return newArgs;
}

export function notFProps(args: {[key: string]: any}) {
    let newArgs: any = {}
    for (const key in args) {
        if (!/f[A-Z]/g.test(key)) {
            newArgs[key] = args[key];
        }
    }
    return newArgs;
}