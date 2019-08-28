import React from "react";
import { StatelessForm } from "../statelessForm";

export interface FormContextValue {
    form?: StatelessForm<any>
}

export const FormContext = React.createContext<FormContextValue>({})