entity Employees {
    key ID          : String(12);
        firstName   : String(40);
        lastName    : type of firstName;
        countryCode : Countries:code;
};

entity Countries {
    key code : String(5);
        name : String(100);
};