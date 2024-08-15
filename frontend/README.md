## Project Structure

src
|
+-- app # application layer containing:
| |
| +-- routes # application routes / can also be called pages
+-- app.tsx # main application component
+-- provider.tsx # application provider that wraps the entire application with different global providers
+-- router.tsx # application router configuration
+-- assets # assets folder can contain all the static files such as images, fonts, etc.
|
+-- components # shared components used across the entire application
|
+-- config # global configurations, exported env variables etc.
|
+-- features # feature based modules
|
+-- hooks # shared hooks used across the entire application
|
+-- lib # reusable libraries preconfigured for the application
|
+-- stores # global state stores
|
+-- test # test utilities and mocks
|
+-- types # shared types used across the application
|
+-- utils # shared utility functions

## Feature Structure

src/features/awesome-feature
|
+-- api # exported API request declarations and api hooks related to a specific feature
|
+-- assets # assets folder can contain all the static files for a specific feature
|
+-- components # components scoped to a specific feature
|
+-- hooks # hooks scoped to a specific feature
|
+-- stores # state stores for a specific feature
|
+-- types # typescript types used within the feature
|
+-- utils # utility functions for a specific feature
