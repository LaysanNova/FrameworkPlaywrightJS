import { getYesterdayDate } from '../../utils/helper';

export const NEW_PAGE_TITLE = 'New Links | Hacker News';
export const PAST_PAGE_TITLE = `${getYesterdayDate()} front | Hacker News`;
export const HACKER_NEWS_PAGE_TITLE = `Hacker News`;
export const LOGIN_PAGE_TITLE = `Login`;

export const ROWS_30 = 30;
export const ROWS_100 = 100;

export const ROWS_PER_PAGE = {
    values: [5, 10, 15, 25],
    FIVE: 5,
    TEN: 10,
    FIFTEEN: 15,
    TWENTY_FIVE: 25,
};

export const SEARCH_VALUE = ['mich','dan.h@company.com'];
export const EMPLOYEES_COLUMNS = {
    id: {
        label: 'ID',
        type: 'number',
    },
    first: {
        label: 'First Name',
        type: 'text',
    },
    last: {
        label: 'Last Name',
        type: 'text',
    },
    email: {
        label: 'Email',
        type: 'text',
    },
    age: {
        label: 'Age',
        type: 'number',
    },
    salary: {
        label: 'Salary',
        type: 'currency',
    },
    dept: {
        label: 'Dept',
        type: 'text',
    },
    status: {
        label: 'Status',
        type: 'text',
    },
};

export const EMPLOYEE_ROWS = [
    {
        id: '1',
        first: 'John',
        last: 'Smith',
        email: 'john.smith@company.com',
        age: '35',
        salary: '$75,000',
        dept: 'Engineering',
        status: 'Active',
    },
    {
        id: '2',
        first: 'Sarah',
        last: 'Johnson',
        email: 'sarah.j@company.com',
        age: '28',
        salary: '$65,000',
        dept: 'Marketing',
        status: 'Active',
    },
    {
        id: '3',
        first: 'Michael',
        last: 'Williams',
        email: 'm.williams@company.com',
        age: '42',
        salary: '$95,000',
        dept: 'Engineering',
        status: 'Active',
    },
    {
        id: '4',
        first: 'Emily',
        last: 'Brown',
        email: 'emily.brown@company.com',
        age: '31',
        salary: '$55,000',
        dept: 'HR',
        status: 'On Leave',
    },
    {
        id: '5',
        first: 'David',
        last: 'Jones',
        email: 'd.jones@company.com',
        age: '45',
        salary: '$120,000',
        dept: 'Executive',
        status: 'Active',
    },
    {
        id: '6',
        first: 'Lisa',
        last: 'Garcia',
        email: 'lisa.g@company.com',
        age: '29',
        salary: '$60,000',
        dept: 'Design',
        status: 'Active',
    },
    {
        id: '7',
        first: 'James',
        last: 'Miller',
        email: 'james.m@company.com',
        age: '38',
        salary: '$85,000',
        dept: 'Engineering',
        status: 'Active',
    },
    {
        id: '8',
        first: 'Jennifer',
        last: 'Davis',
        email: 'jen.davis@company.com',
        age: '33',
        salary: '$70,000',
        dept: 'Sales',
        status: 'Active',
    },
    {
        id: '9',
        first: 'Robert',
        last: 'Martinez',
        email: 'r.martinez@company.com',
        age: '51',
        salary: '$110,000',
        dept: 'Finance',
        status: 'Active',
    },
    {
        id: '10',
        first: 'Amanda',
        last: 'Anderson',
        email: 'amanda.a@company.com',
        age: '26',
        salary: '$50,000',
        dept: 'Marketing',
        status: 'Active',
    },
    {
        id: '11',
        first: 'Christopher',
        last: 'Taylor',
        email: 'chris.t@company.com',
        age: '40',
        salary: '$90,000',
        dept: 'Engineering',
        status: 'Terminated',
    },
    {
        id: '12',
        first: 'Jessica',
        last: 'Thomas',
        email: 'jess.t@company.com',
        age: '34',
        salary: '$72,000',
        dept: 'QA',
        status: 'Active',
    },
    {
        id: '13',
        first: 'Daniel',
        last: 'Hernandez',
        email: 'dan.h@company.com',
        age: '27',
        salary: '$58,000',
        dept: 'Engineering',
        status: 'Active',
    },
    {
        id: '14',
        first: 'Michelle',
        last: 'Moore',
        email: 'm.moore@company.com',
        age: '36',
        salary: '$78,000',
        dept: 'Product',
        status: 'On Leave',
    },
    {
        id: '15',
        first: 'Kevin',
        last: 'Jackson',
        email: 'kevin.j@company.com',
        age: '44',
        salary: '$88,000',
        dept: 'Sales',
        status: 'Active',
    },
];

export const STATUS = {
    ACTIVE: {
        label: 'Active',
        color: 'rgb(74, 222, 128)',
    },
    ON_LEAVE: {
        label: 'On Leave',
        color: 'rgb(251, 191, 36)',
    },
    TERMINATED: {
        label: 'Terminated',
        color: 'rgb(248, 113, 113)',
    },
};

export const DEPARTMENTS = {
    DESIGN: 'Design',
    ENGINEERING: 'Engineering',
    EXECUTIVE: 'Executive',
    FINANCE: 'Finance',
    HR: 'HR',
    MARKETING: 'Marketing',
    PRODUCT: 'Product',
    QA: 'QA',
    SALES: 'Sales',
};

export const ALL_DEPARTMENTS = 'All Depts';
export const ALL_STATUS = 'All Status';


