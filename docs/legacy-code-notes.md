# Notes about legacy code

## Database
### Tools
The [database tools](/database/tools/ts/) is in dire need of refactoring. This code was originally written with a *"quick-and-dirty" mindset*, and it has hardly been updated since it was authored. The tooling does however work perfectly fine, and it is unlikely that we will need to change or extend it anytime soon, so there is no reason to update it – except from the fact that the code is extremely ugly.

## Git history
### Blobs
Very old **pdf**-, **jpg**- and **png** files has been completely removed from git history in order to minify the git repository. The code is however not updated to accommodate for the deleted files. This means that if you checkout an old version of the code, you will surely run into path issues. Updating the entire code history to fix this issue will be too much work for very little gain, so we have decided to not do anything about it. **If you checkout an old version of the code, it will be your responsibility to create new dummy files at the missing paths.**
