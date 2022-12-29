import { test } from '@playwright/test';

test.describe("Admin can update repertoire", async () => {
    await testUpdateRepertoire({ song: /ice cream/ })
})

test.describe("Super admin can update repertoire", async () => {
    await testUpdateRepertoire({ song: /killing/ })
})

async function testUpdateRepertoire( opts: { song: string | RegExp }) {
    test.describe.configure({mode: "serial"})
    //#TODO
}