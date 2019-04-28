# React Satisfying Forms
An easier, cleaner, and more powerful way to build forms with double way bindings in react.

## Philosophy

Wrap once, use quickly, and cleaner ever after.

## Features

1. Native support for debouced updates
1. Support for easy native component wrapping, without property overrides mess
1. Support for state and stateless approaches
1. Support for easy change values outside the form component
1. Support for typed form state
1. Support for initial values
1. Support for sync and assync multiples validations
1. Support for nested form isolation
1. Support for field groups and partials (like mvc)
1. Support for validations of fields that where omitted
1. Support for full qualified objects
1. Support for advanced inspect for fields and forms (really handy when developing)

## Installation

` Comming soon npm install `

## Base of Comparisons

### Antd Forms - [page](https://ant.design/components/form/)
Is a powerful engine, based on [RC-Form](https://github.com/react-component/form) but IMO:

- extremely verbosed and messy, especially when you put validations
- does not support functional components as wrapped ones
- it obligates you to wrap your form, using a HOC, to provide the form utility that will wrap the forms (!)

### React Final Form - [page](https://github.com/final-form/react-final-form)

Another powerful engine, clearer than Antd's, but:
- Does not support stateless approach
- Code gets a could get a little messy because of the design choice, of the use of the render prop, instead of children default one.
- Lack of tools for combining validators.
- Modify a value, requires you to build a mutator (!)

## Examples
### Say hello to 'inspect'

```html
<Form inspect>
...
</Form>
```