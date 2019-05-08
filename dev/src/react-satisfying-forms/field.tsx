import * as React from 'react'
import { FormContext } from './contexts/formContext';
import { FieldGroupContext } from './contexts/fieldGroupContext';
import { ContextedField, ContextedFieldProps } from './contextedField';
import { FieldBidings } from './interfaces/fieldBidings';
import { FieldStatusWithErrorHint } from './interfaces/FieldStatusWithErrorHint';

export interface FieldProps extends ContextedFieldProps { 
    children?: any
}

export const Field = React.forwardRef<ContextedField, ContextedFieldProps>((props, ref) =>
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
     const allParams = Object.assign({}, ...args)
     let newArgs: any = {}
     for (const key in allParams) {
        if (!/f[A-Z]/g.test(key)) {
            newArgs[key] = allParams[key];
        }
    }
    return newArgs;
}

export interface FieldFactoryArgs<TProps, TExtraFProps = {}> {
    (fprops: FieldProps & TExtraFProps, props: TProps, bidings: FieldBidings, fieldStatus: FieldStatusWithErrorHint): React.ReactNode
}

export function FieldFactory<TProps, TExtraFProps = {}>(field: FieldFactoryArgs<TProps, TExtraFProps>) {
    return (props: FieldProps & TExtraFProps & TProps) => 
        <Field {...fProps(props)}>
            {(bidings, status) => field(fProps(props), notFProps(props), bidings, status)}
        </Field>
}