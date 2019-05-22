[![Build Status](https://travis-ci.com/luisgustavolf/react-satisfying-forms.svg?branch=master)](https://travis-ci.com/luisgustavolf/react-satisfying-forms)
[![npm version](https://badge.fury.io/js/react-satisfying-forms.svg)](https://badge.fury.io/js/react-satisfying-forms)

# React Satisfying Forms
So satisfying make forms that can be written faster and scalable, right?

## Philosophy

Wrap faster, use quickly ever after. Like so:

```tsx
// InputField.tsx
// --------------

// Now InputField has the same interface as native one, plus form's field props (fprops)
const InputField = FieldFactory<React.InputHTMLAttributes<HTMLInputElement>>((fprops, props, fieldBindings, fielStatus) => 
    <input {...props} {...fieldBindings} />
)

// SomeFunction.tsx
// ----------------

// Note that the inspectors are on! Make some modifications, and see whats going on ;D
export function SomeFunction() {
    return (
        <Form inspect>
            <InputField fName={'name'} fInspect/>
        </Form>
    )
}
```

## Installation

```bash 
npm i react-satisfying-forms --save
```

## Running this sources

```bash
# Clone the rep
git clone https://github.com/luisgustavolf/react-satisfying-forms.git

# Browse the folder
cd react-satisfying-forms

# Enter the Playground
cd dev

# Install depencies
npm install

# Run de app
npm start
```

## Full docs

https://luisgustavolf.gitbook.io/react-satisfying-forms/

