import { expect, test } from "@playwright/test"
import { job } from "../../../server/src/jobs/deleteDeactivatedUsers.js"

test("#todo", () => {
    job()
    expect(true).toBe(true)
})