entity Employees {
    key ID             : String(12);
        firstName      : String(40);
        lastName       : type of firstName;
        countryCode    : Countries:code;
        dateOfBirth    : Date;
        fixedSalary    : Decimal(13, 2);
        variableSalary : Decimal(13, 2);
        workingStartAt : Time;
        toCountries    : Association to one Countries
                             on toCountries.code = $self.countryCode;
};

entity Countries {
    key code          : String(5);
        name          : String(100);
        population    : Integer;
        averageSalary : Decimal(7, 2);
        hasStates     : Boolean;
        foundedOn     : Date;
        foundedAt     : Time;
};
