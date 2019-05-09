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

## Features

1. [Field's Anatomy](#Field's-Anatomy)
1. [Make your own FieldFactory](#Make-your-own-FieldFactory)
1. [Basic usage](#basic-usage)
1. Forms
    1. [Form inspect](#form-inspect)
    1. [Form Helpers](#form-helpers)
    1. [State mode](#state-mode)
    1. [Stateless mode](#stateless-mode)
    1. Typed State
    1. Initial Values
    1. Nested forms
    1. Outside Control
        1. Set fields values
        1. Set field value
        1. Remove field (util when working with lists)
        1. Validates
        1. Submits

1. Field Groups
    1. Basic usage

1. Fields
    1. Normal Usage
        1. Field inspect
        1. Debounced state update
        1. Complex properties bindings
        1. Event pass-trough, like onChange
        1. Working Checkable Fields
    1. Field Factoring
    1. Validations
        1. Sync Validations
        1. Async Validations

## Nice Tricks
1. Make your own field factory, for your lib
1. Working with lists


## Base of Comparison

### Antd Forms - [page](https://ant.design/components/form/)
Is a powerful engine, based on [RC-Form](https://github.com/react-component/form) but IMO:

- extremely verbose and messy, especially when you put validations
- does not support functional components as wrapped ones
- it obligates you to wrap your form, using a HOC, to provide a form utility that will wrap your components (!)
- Working with complex properties, especially array ones, can be a challenge

### React Final Form - [page](https://github.com/final-form/react-final-form)

Another powerful engine, clearer than Antd's, but:
- Does not support stateless approach
- Code could get a little messy because of the design choice, of the use of a render prop inside of the fild, instead of children default one.
- Lack of tools for combining validators.
- Modify a value, requires you to build a mutator (!)

## Features

### Field's Anatomy
Fields are the heart of this engine, and you can deal whit then in two flavors:

#### The Declarative Way
Note that every prop comes prefixed with `f`, like `fName`. This is important because we don't want props been overwritten when interfaces merge, on wrapping fields (see: The Factored Way).

```jsx
//"fieldBidings" Contains all bindings methods needed to the doble-way binding cycle, like onChange and value... 
//"fieldStatus" Contains information about the field, like, if it have errors or have been touched...
<Field fName={'latitude'}>
    {(fieldBidings, fieldStatus) => <input {...fieldBidings} />}
</Field>
```

#### The Factored Way
Factories make using fields blase fast! Just bake once, e you are ready to go. Note that the new field have the two interfaces. It's own props, plus, the Field props. 

**Important:** I recommend to sufix every baked field with "Field", to avoid messes with the native ones... After all, the baked one, is a new component!

```tsx
// 1. Bake the field
const InputField = FieldFactory<React.InputHTMLAttributes<HTMLInputElement>>((fprops, props, fieldBindings, fielStatus) => 
    <input {...props} {...fieldBindings} />
)

// 2. Use it
<InputField fName={'latitude'}/>
```

### Make your own FieldFactory
Now things begins to be fun, and closer to the real word! After all, you need to display errors and other thinks that your user needs.

```tsx
// myFieldFactory.tsx
// ------------------

// Some extra fprops
interface MyFieldFactoryProps {
    fLabel?: string
}

// Your awesome factory, with error displaying, label and requirement showing
function MyFieldFactory<TProps>(field: FieldFactoryArgs<TProps>) {
    return FieldFactory<TProps, MyFieldFactoryProps>((fprops, props, fieldBindings, fielStatus) => 
            <div>
                <div>
                    {fprops.fLabel}
                    {fprops.fRequired && "*"}
                </div>
                <div>
                    {field(fprops, props, fieldBindings, fielStatus)}
                </div>
                <div>
                    {fielStatus.shouldDisplayErrors && fielStatus.errors}
                </div>
            </div>
        )
    
}

// InputField.tsx
// --------------

// Use it!
const InputField = MyFieldFactory<React.InputHTMLAttributes<HTMLInputElement>>((fprops, props, fieldBindings, fielStatus) => 
    <input {...props} {...fieldBindings} />
)
```

### Basic Usage
A basic example, with some validations and errors. To trigger the error just type something, and erase it.

```jsx
function MyForm() {
    
    // If there is no errors...
    function handleSubmit(values) {
        console.log(values);
    }

    return (
        <Form onSubmit={handleSubmit}>
            <InputField fName={'latitude'}/>

            <Form.Submit>
                {(submit) => <button onClick={submit}>Submit</button>}
            </Form.Submit>
        </Form>
}
```

### Form
#### Form inspect
With this feature, now, you can inspect all the form's state, status, and field values and status.

```jsx
<Form inspect>
...
</Form>
```

#### Form Helpers

##### Form Submit
Access the submit action anytime.

```jsx
<Form>
    <Form.Submit>
        {(submit) => { <button onClick={submit}/>}}
    </Form.Submit>
</Form>
```

##### Form Values
Access the fields values anytime. Very useful when other parts of the form depends on other fields

```jsx
<Form>
    <InputField fName={'latitude'}/>
    <Form.Values<any>>
        {(values) => 
            values.latitude && "latitude is defined!"
        }
    </Form.Values>
</Form>
```

##### Form State
The Form's full state. With form status, fieldsValues, and other controls...

```jsx
<Form>
    <InputField fName={'latitude'}/>
    <Form.State<any>>
        {(state) => 
            ...
        }
    </Form.State>
</Form>
```


#### State Mode
By default, form works whit internal state...

```jsx
<Form>
...
</Form>
```

#### Stateless Mode
When you set the "fieldValues" prop, forms now will use this prop as is main values source. And, you will need to attach your feedback function the the onChange prop, that will trigger when any value changes.

```jsx
<Form fieldValues={{ ...}} onChange={(values) => { ... }}>
...
</Form>
```
