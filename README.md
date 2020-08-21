# canadyarn

✨ Check specific packages to have a single resolved version in yarn.lock

## How to use

1. Install `canadyarn`.<br>

    ```sh
    $ yarn add --dev canadyarn
    ```

2. Add the key `"checkSingleVersionDependencies"` to `package.json` file,<br>
   specify the names of packages to check as a string array,<br>
   and add `canadyarn` as a runnable script.<br>
   Example:

    ```json
    {
        "checkSingleVersionDependencies": ["react", "react-native", "typescript"],
        "scripts": {
            "canadyarn": "canadyarn"
        }
    }
    ```

3. Run `canadyarn`.<br>

    ```sh
    $ yarn run canadyarn
    ```
