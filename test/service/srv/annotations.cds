using CompanyManagement from './data-provider';

annotate CompanyManagement.Employees with {
    ID          @Common.Label: 'Employee ID';
    firstName   @Common.Label: 'First Name';
    lastName    @Common.Label: 'Last Name';
    countryCode @Common.Label: 'Country Code';
};

annotate CompanyManagement.Employees with @(UI: {
    SelectionFields: [
        ID,
        countryCode
    ],
    LineItem       : [
        {
            $Type: 'UI.DataField',
            Value: ID
        },
        {
            $Type: 'UI.DataField',
            Value: firstName
        },
        {
            $Type: 'UI.DataField',
            Value: lastName
        },
        {
            $Type: 'UI.DataField',
            Value: countryCode
        }
    ]
});
