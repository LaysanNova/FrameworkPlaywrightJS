import { test, expect } from '@playwright/test';

test('Demoblaze Login API', async ({ request }) => {

    const URL = 'https://api.demoblaze.com';
    const LOGIN_ENDPOINT = '/login';

    const response = await request.post(`${URL}${LOGIN_ENDPOINT}`, {
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            username: 'Qsjjfkld',
            password: 'MTIz'
        }
    });

    expect(response.ok()).toBeTruthy();

    const text = await response.text();

    const tokenMatch = text.match(/Auth_token:\s(.+)"/);
    const token = tokenMatch ? tokenMatch[1] : null;

    expect(token).toBeTruthy();
    console.log('Token:', token);
});

test('POST /bycat returns valid items for each category', async ({ page, request }) => {
    const URL = 'https://api.demoblaze.com';
    const CATEGORIES_ENDPOINT = '/bycat';
    const CATEGORIES = ['phone', 'notebook', 'monitor'];

    for (const category of CATEGORIES) {
        const response = await page.request.post(`${URL}${CATEGORIES_ENDPOINT}`, {
            data: {
                cat: category
            }
        });
        expect(response.ok()).toBeTruthy();

        const body = await response.json();
        const items = body.Items;
        expect(items.length).toBeGreaterThan(0);

        const allPhones = items.every(item => item.cat === category);
        expect(allPhones).toBeTruthy();
        items.forEach(item => {
            expect(item).toHaveProperty('id');
            expect(item).toHaveProperty('title');
            expect(item).toHaveProperty('price');
            expect(item).toHaveProperty('cat');

            expect(typeof item.id).toBe('number');
            expect(typeof item.title).toBe('string');
            expect(typeof item.price).toBe('number');

            expect(item.price).toBeGreaterThan(0);
        });
    }
});
