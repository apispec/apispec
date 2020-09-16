# @apispec/runner

The runner pulls in mocha, mochawesome, supertest and @apispec/html-report.

It patches mochawesome to support custom html reports.

It creates a custom mocha interface to support an options object as parameter to describe instead of just the title.

It monkey patches supertest to automatically add requests and responses as context to mochawesome.
