test('A Test', () => {
    expect(true).toBeTruthy();
});

test('Async Test', async () => {
    const result = await new Promise((resolve) => {
        setTimeout(() => {
            resolve(true);
        },
        10);
    });
    expect(result).toBeTruthy();
});
