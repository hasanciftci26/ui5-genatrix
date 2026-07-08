using CompanyManagement from './data-provider';

annotate CompanyManagement.Employees with {
    ID             @Common.Label: 'Employee ID';
    firstName      @Common.Label: 'First Name';
    lastName       @Common.Label: 'Last Name';
    countryCode    @Common.Label: 'Country';
    dateOfBirth    @Common.Label: 'Date of Birth';
    fixedSalary    @Common.Label: 'Fixed Salary';
    variableSalary @Common.Label: 'Variable Salary';
    workingStartAt @Common.Label: 'Working Start At';
};

annotate CompanyManagement.Employees with {
    countryCode @Common: {
        Text           : toCountries.name,
        TextArrangement: #TextOnly
    };
};

annotate CompanyManagement.Employees with {
    countryCode @Common: {
        ValueListWithFixedValues,
        ValueList: {
            Label         : 'Test',
            SearchSupported,
            $Type         : 'Common.ValueListType',
            CollectionPath: 'Countries',
            Parameters    : [
                {
                    $Type            : 'Common.ValueListParameterInOut',
                    LocalDataProperty: countryCode,
                    ValueListProperty: 'code'
                },
                {
                    $Type            : 'Common.ValueListParameterDisplayOnly',
                    ValueListProperty: 'name'
                }
            ]
        }
    };
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
        },
        {
            $Type: 'UI.DataField',
            Value: dateOfBirth
        },
        {
            $Type: 'UI.DataField',
            Value: fixedSalary
        },
        {
            $Type: 'UI.DataField',
            Value: variableSalary
        },
        {
            $Type: 'UI.DataField',
            Value: workingStartAt
        }
    ]
});

annotate CompanyManagement.Countries with {
    code          @Common.Label: 'Code';
    name          @Common.Label: 'Name';
    population    @Common.Label: 'Population';
    averageSalary @Common.Label: 'Average Salary';
    hasStates     @Common.Label: 'Has States';
    foundedOn     @Common.Label: 'Founded On';
    foundedAt     @Common.Label: 'Founded At';
};
