using {
    Employees as DBEmployees,
    Countries as DBCountries
} from '../db/data-models';

service CompanyManagement {
    entity Employees as select from DBEmployees;
    entity Countries as select from DBCountries;
};
