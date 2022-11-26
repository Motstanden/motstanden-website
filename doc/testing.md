# Summary
The project is using [playwright](https://playwright.dev/) for end to end testing.<br/>
It is important to write tests because it ensures that the project works as expected and that developers can confidently write code without breaking anything.<br/>

Run the tests in this project by following the steps in [README.md](/.github/README.md#Testing)

## Creating new tests
It is recommended to use playwright's code generation tool to mockup tests.
```bash
npx playwright codegen --output tests/myTest.spec.ts --load-storage storage-state/contributor.json http://localhost:3000
```
Note that this command assumes that the file `storage-state/contributor.json` exists. This file is auto generated when running tests. <br/>

Auto generated tests are not perfect, but they serve as a good starting point. Manual refactor is therefore required.

# Flakiness
It is extremely important to avoid writing flaky tests. You should always check that your tests are not turning flaky.<br/>
You can hunt for flaky tests by running them multiple times in a row: 
```bash
npx playwright test --repeat-each 30 --trace on --grep myTest.spec.ts
```

# Troubleshooting

## Typical error messages
### tracing.startChunk: Tracing is already stopping
This message is most likely appearing because you have forgotten to await an asynchronous function. 

# Dos and don'ts

## Design considerations 
✔️ Do evaluate that your tests are perfectly isolated from all other tests. This is necessary for parallelization. <br/>

✔️ Do ensure that your tests are not flaky. <br/>

✔️ Do write test cases for code that causes front-end and back-end to interact with each other.<br/>

❌ Do not write test cases for pure front-end code – unless you have a good reason to.

✔️ Do consider to implement [test driven development](https://www.youtube.com/watch?v=Jv2uxzhPFl4) in your workflow.

## Element selection
✔️ Do target user-facing attributes when selecting elements. 
These elements are most likely to remain stable throughout the projects lifespan.
```typescript
const quoteField = page.getByLabel('Sitat *')
const saveButton = page.getByRole('button', { name: 'Lagre' })   
```

❌ Do not target selectors tied to implementation. Implementations are likely to change in the future.
```typescript
// ❌ Don't do this
await page.locator('section:has-text("sitater") > ul > li:nth-child(2) > div:nth-child(4) > button').click();
```

✔️ Do follow playwright's definition of [best practices](https://playwright.dev/docs/selectors#best-practices).


## Loging in

✔️ Do use storage state to login.
```typescript
test.use({ storageState: getStoragePath(UserGroup.Contributor)})

test("Should create new quote", async () => {
    // Insert new quote here...
})
```

✔️ Do remember to close the page that is created when loging in inline with storage state.
```typescript
test("Should create new quote", async ({browser}) => {
    const page = await storageLogIn(browser, UserGroup.Contributor)

    // Insert new quote here...
    
    await disposeStorageLogIn(page)     // ✔️ This line is important!
})
```

✔️ Do use email login strategy if you don't want to use the UserGroup users.<br/>
Unlike the example above, this page does not need to be closed.
```typescript
test("Should create new quote", async ({page}) => {
    await emailLogIn(page, "web@motstanden.no")     
})
```

❌ **Do not log out of any users!** This will unexpectedly log out users in other tests as well. Furthermore, this causes tests to not be isolated from each other, and causes tests to be flaky due to race conditions (in parallel testing).

# Resources

- [**Playwright Test for VSCode**](https://marketplace.visualstudio.com/items?itemName=ms-playwright.playwright) <br/>
This extension is very useful for quickly running and debugging tests inside VSCode.<br/>


- [**Playwright cli**](https://playwright.dev/docs/test-cli)<br/>
Used to run and configure tests. Explore the cli by using the `--help` flag. For example:
    ```bash
    npx playwright --help       # List available commands
    npx playwright test --help  # List available options when running tests 
    ```
- **Documentation**
    - [Introduction to playwright](https://playwright.dev/docs/intro)
    - [Playwright API](https://playwright.dev/docs/api/class-playwright)
    - [Playwright source code](https://github.com/microsoft/playwright)