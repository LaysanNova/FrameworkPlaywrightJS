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