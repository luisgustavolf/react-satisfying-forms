import React from "react";
import { StatelessForm } from "../statelessform";

export interface FormContextValue {
    form?: StatelessForm<any>
}

export const FormContext = React.createContext<FormContextValue>({})