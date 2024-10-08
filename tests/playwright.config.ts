import type { PlaywrightTestConfig } from '@playwright/test'
import { devices } from '@playwright/test'
import dotenv from 'dotenv'
import path from 'path'
import { getDirname } from './utils/getDirname.js'

/**
 * Read environment variables from file.
 * https://github.com/motdotla/dotenv
 */
const __dirname = getDirname(import.meta.url);
dotenv.config({ path: path.join(__dirname, '.env') });

/**
 * See https://playwright.dev/docs/test-configuration.
 */
const config: PlaywrightTestConfig = {
    testDir: './tests',
    testMatch: [
        "*.spec.ts", "*.api.ts"
    ],

    /* Files matching .gitignore patterns are excluded when searching for tests */
    respectGitIgnore: true,

    /* Maximum time one test can run for. */
    timeout: 55 * 1000,
    expect: {
        /**
         * Maximum time expect() should wait for the condition to be met.
         * For example in `await expect(locator).toHaveText();`
         */
        timeout: 15 * 1000 // We will assume that developers have slow computers
    },

    /* Run tests in files in parallel */
    fullyParallel: true,

    /* Fail the build on CI if you accidentally left test.only in the source code. */
    forbidOnly: !!process.env.CI,
    
    /* Retry on CI only */
    retries: process.env.CI ? 2 : 0,
    
    /* Opt out of parallel tests on CI. */
    workers: process.env.CI ? 1 : undefined,
    
    /* Reporter to use. See https://playwright.dev/docs/test-reporters */
    reporter: 'html',
    
    /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
    use: {
        /* Maximum time each action such as `click()` can take. Defaults to 0 (no limit). */
        actionTimeout: 0,

        /* Base URL to use in actions like `await page.goto('/')`. */
        baseURL: process.env.BASEURL,

        /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
        trace: 'on-first-retry',
    },

    /* Configure projects for major browsers */
    projects: [
        {
            name: "global setup",
            testMatch: /global\.setup\.ts/,
            testDir: "."
        },

        {
            name: 'firefox',
            use: {
                ...devices['Desktop Firefox'],
            },
            dependencies: ['global setup'],
        },

        {
            name: 'chromium',
            use: {
                ...devices['Desktop Chrome'],
            },
            dependencies: ['global setup'],

            // Tests that fails due to race conditions caused by running in parallel with other browsers.
            // Temp solution: Only run these tests in firefox
            testIgnore: [ 
                "simpleTexts.spec.ts",
                "comments.api.ts",
                "wallPosts.api.ts",
                "deleteDeactivatedUsers.spec.ts",
            ]
        },

        {
            name: 'webkit',
            use: {
                ...devices['Desktop Safari'],
            },
            dependencies: ['global setup'],

            // Tests that fails due to race conditions caused by running in parallel with other browsers.
            // Temp solution: Only run these tests in firefox
            testIgnore: [ 
                "simpleTexts.spec.ts",
                "comments.api.ts",
                "wallPosts.api.ts",
                "deleteDeactivatedUsers.spec.ts",
            ]
        },

        /* Test against mobile viewports. */
        // {
        //   name: 'Mobile Chrome',
        //   use: {
        //     ...devices['Pixel 5'],
        //   },
        // },
        // {
        //   name: 'Mobile Safari',
        //   use: {
        //     ...devices['iPhone 12'],
        //   },
        // },

        /* Test against branded browsers. */
        // {
        //   name: 'Microsoft Edge',
        //   use: {
        //     channel: 'msedge',
        //   },
        // },
        // {
        //   name: 'Google Chrome',
        //   use: {
        //     channel: 'chrome',
        //   },
        // },
    ],

    /* Folder for test artifacts such as screenshots, videos, traces, etc. */
    // outputDir: 'test-results/',

    /* Run your local dev server before starting the tests */
    // webServer: {
    //   command: 'npm run start',
    //   port: 3000,
    // },
};

export default config;
