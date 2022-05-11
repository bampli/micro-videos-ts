export type FieldErrors = {
    [field: string]: string[]
}

// name: [required, string, max_length, etc]

export default interface ValidatorFieldsInterface<PropsValidated> {
    errors: FieldErrors;
    validatedData: PropsValidated;
    validate(data: any): boolean;
}
// const isValid = validator.validate(data)
// validate.validatedData

// objectives:
//  - create a validation abstraction for entities, powered by a lib
//  - do not depend on any lib

// api rest:
//  post /categories {name: 5, description: 5, is_active: 5}
//      name must be a string
//      description must be a string
//      is_active must be a boolean
//
//  return only first error is not efficient
//  entity validation checks all errors at once

// validations: parameters, 2 or more, entity, domain service
// types:
//  null or empty
//  parameter length
//  special: email, cpf, cnpj, credit card

