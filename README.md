# React Satisfying Forms
(NOTE) This doc is under contruction, but, if you that curious, you can pick the file I use as a base in: dev/src/satisfyingFormExample.tsx 

## Philosophy

Wrap once, use quickly ever after.

## Installation

` npm i react-satisfying-forms `

## Features

1. [Basic usage](#basic-usage)
1. Forms
    1. [Form inspect](#form-inspect)
    1. [State mode](#state-mode)
    1. [Stateless mode](#stateless-mode)
    1. Typed State
    1. Initial Values
    1. Nested forms
    1. Outside Controll
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
        1. Debouced state update
        1. Complex properties bidings
        1. Event pass-trough, like onChange
    1. Field Factoring
    1. Validations
        1. Sync Validations
        1. Assync Validations

## Nice Tricks
1. Make your own fild factory, for your lib
1. Working with lists


## Base of Comparison

### Antd Forms - [page](https://ant.design/components/form/)
Is a powerful engine, based on [RC-Form](https://github.com/react-component/form) but IMO:

- extremely verbosed and messy, especially when you put validations
- does not support functional components as wrapped ones
- it obligates you to wrap your form, using a HOC, to provide the form utility that will wrap the forms (!)
- does not suport complex properties, that converts to multilevel objects (ex.: "personalData.name" >> { personalData: {name: '' } } )

### React Final Form - [page](https://github.com/final-form/react-final-form)

Another powerful engine, clearer than Antd's, but:
- Does not support stateless approach
- Code gets a could get a little messy because of the design choice, of the use of the render prop, instead of children default one.
- Lack of tools for combining validators.
- Modify a value, requires you to build a mutator (!)

## Examples
### Basic Usage
A basic example, with some validations and errors. To trigger the error just tipe something, and errase it.

```jsx
function MyForm() {
    
    // If there is no errors...
    function handleSubmit(values) {
        console.log(values);
    }

    // Note that field in it's raw declaration, 
    // it's a litte bit verbose... 
    // So, this is why we encorourage you to use 
    // our factory method, discribed in this doc.
    return <Form onSubmit={handleSubmit}>
        {(submit, state) => 
            <>
                <Field fName={'name'} fRequired>
                    {(fieldBidings, fieldStatus) => 
                        <>
                            <input {...fieldBidings}/>
                            {status.shouldDisplayErrors ? status.errors : ""}
                        </>
                    }
                </Field>
                <button onClick={submit}>Submit</button>
            </>
        }
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

#### State Mode
By desfault, form works whit internal state...

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