import * as React from 'react'
import { FormContext } from './contexts/formContext';
import { FieldGroupContext } from './contexts/fieldGroupContext';
import { ContextedField, ContextedFieldProps } from './contextedField';
import { Form } from './form';

export interface FieldProps extends ContextedFieldProps { 
    
}

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

/**
 * Returns a new object with ONLY fProps
 * @param args object
 */
export function fProps(...args: {[key: string]: any}[]) {
    const allParams = Object.assign({}, ...args)
    let newArgs: any = {}
    for (const key in allParams) {
        if (/f[A-Z]/g.test(key)) {
            newArgs[key] = allParams[key];
        }
    }
    return newArgs;
}

/**
 * Returns a new object with EXCEPT fProps
 * @param args object
 */
export function notFProps(...args: {[key: string]: any}[]) {
     //const allParams = args.reduce((prev, current) => ({...prev, ...current}) ,{})
     const allParams = Object.assign({}, ...args)
     let newArgs: any = {}
     for (const key in allParams) {
        if (!/f[A-Z]/g.test(key)) {
            newArgs[key] = allParams[key];
        }
    }
    return newArgs;
}