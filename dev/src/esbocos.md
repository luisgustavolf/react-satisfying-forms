# Ideias 

Objetivos

1. Esta lib deve facilitar o manuseio de estado interno, inclusive:     
    1. Erros internos (como de validacao)
    1. Erros externos (vindos de validacoes do servidos)
    1. Acesso a valores do model para ações de filtragem ou display
    1. Detecao de mudanças, sem estar necessariamente ligando a um evento de change (acredito que seja um caminho mais natural)
    1. Lidar melhor com valores iniciais
    1. Os valores devem ser imutaveis

1. Deve permitir submit dentro e fora do form
1. Deve permitir form groups

## A Ideia

Fazer um modelo stateless, delegando ao componente que assume o form armazenar o estado.

```tsx
const formValues:FormValues = {
    fields: {
        values: {
            field: {
                subField: "asd"
            }
        }
        status: {
            "field.subField": { 
                touched: true,
                dirty: true
            }
        }
        insideErrors: {
            "field.subField": [
                "Required"
            ]
        }
        outsideErrors: {
            "field.subField": [
                "Existed"
            ]
        }
    },
    form: {
        isValidating: false
        hasErrors: true
    },
    boundaries: {
        "tab1": {
            hasErrors: true
        }
    }
} 

formRef.submit();

<Form
    ref={formRef}
    values={formValues} 
    onChange={(formValues) => {}} 
    onSubmit={() => {}}
>
    <Form.Submit>
        {(form) => 
            <Button onClick={() => { form.submit() }}>
                Submit
            </Button>
        }
    </Form.Submit>
</Form>
```