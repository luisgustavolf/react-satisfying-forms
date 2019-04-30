import React from "react";
import { Form } from "../form";

export interface FormContextValue {
    form?: Form
}

export const FormContext = React.createContext<FormContextValue>({})