# SurveyJS Dashboard: Table View - Server-Side Data Processing Demo Example

This example shows how to configure a server that can paginate, sort, filter, and otherwise process survey data and integrate this server with the [Table View](https://surveyjs.io/dashboard/examples/export-survey-results-to-csv-files/) from the [SurveyJS Dashboard](https://surveyjs.io/dashboard) library. The example uses a NodeJS server with a MongoDB database as a storage.

## Disclaimer

This demo must not be used as a real service as it doesn't cover such real-world survey service aspects as authentication, authorization, user management, access levels, and different security issues. These aspects are covered by backend-specific articles, forums, and documentation.

## Run the Application

1. Install [NodeJS](https://nodejs.org/) and [Docker Desktop](https://docs.docker.com/desktop/) on your machine.

2. Run the following commands:

    ```bash
    git clone https://github.com/surveyjs/surveyjs-dashboard-table-view-nodejs-mongodb.git
    cd surveyjs-dashboard-table-view-nodejs-mongodb
    docker compose up -d
    ```

3. Open http://localhost:9080 in your web browser.

## Implement Server-Side Data Processing

Table View displays unaggregated user responses in a table. Without server-side data processing, the Table View may take more time to launch, because it loads all user responses from a storage in one batch and processes them in the user's browser. To shorten the loading time, you can delegate sorting and filtering to the server and implement data pagination to load data in small batches.

The Table View is instantiated using the `Tabulator` constructor, which accepts a function as a second parameter. This function is called each time the Table View requests the next batch of user responses. Its argument is an object with the following properties:

- `offset`: `number`      
The number of records to skip from the beginning of the dataset. Used to implement data pagination.

- `limit`: `number`      
The number of records to load in the current batch. Used to implement data pagination.

- `filter`: `Array<{ field: string, type: string, value: any }>`       
Filter conditions that should be applied to the dataset. Refer to the [Tabulator documentation](https://tabulator.info/docs/4.8/filter) for information on available filters.

- `sort`: `{ field: string, direction: undefined | "asc" | "desc" }`      
Sort order settings that should be applied to the dataset.

- `callback`: `(response: { data: Array<Object>, totalCount: number, error?: any }) => void })`       
A callback used to return the processed dataset. Instead of using the callback, the function can return a Promise.

Pass these load parameters in a server request. The server should apply them to the dataset and return processed data back to the client in an object with the following structure: `{ data: Array<Object>, totalCount: number, error?: any }`. Refer to the [`getObjectPaginated`](https://github.com/surveyjs/surveyjs-dashboard-table-view-nodejs-mongodb/blob/main/express-app/db-adapters/nosql-crud-adapter.js#L19-L36) function implementation for an example of how the server should handle the load parameters.

## Related Demo Examples

- [SurveyJS + NodeJS + MongoDB Demo Example](https://github.com/surveyjs/surveyjs-nodejs-mongodb)
- [SurveyJS + NodeJS + PostgreSQL Demo Example](https://github.com/surveyjs/surveyjs-nodejs-postgresql)

## SurveyJS Resources

- [Website](https://surveyjs.io/)
- [Documentation](https://surveyjs.io/form-library/documentation/overview)
- [Starter Demos](https://surveyjs.io/form-library/examples/overview)
- [What's New](https://surveyjs.io/stay-updated/major-updates/2023)
