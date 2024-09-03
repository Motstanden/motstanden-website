import { expect, test } from "@playwright/test"
import { job } from "../../../server/src/jobs/deleteDeactivatedUsers.js"
import { loadServerEnv } from "../../utils/loadServerEnv.js"

test("#todo", () => {
    loadServerEnv()
    job()
    expect(true).toBe(true)
})