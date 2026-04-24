entity Employees {
    key ID             : String(12);
        firstName      : String(40);
        lastName       : type of firstName;
        countryCode    : Countries:code;
        dateOfBirth    : Date not null;
        fixedSalary    : Decimal(13, 2) not null;
        variableSalary : Decimal(13, 2) not null;
        workingStartAt : Time;
};

entity Countries {
    key code          : String(5);
        name          : String(100);
        population    : Integer;
        averageSalary : Decimal(7, 2) @Common.Label: 'Average Salary ($)';
        hasStates     : Boolean;
        createdOn     : Date;
};
