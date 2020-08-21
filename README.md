# canadyarn

[![npm-badge][]][npm-link]
[![license-badge][]][license-link]
[![jw-badge]][jw-link]

🍁 Check specific packages to have a single resolved version in yarn.lock

## Installation

1.  Install `canadyarn`.<br>

    ```sh
    $ yarn add --dev canadyarn
    ```

<!-- prettier-ignore-start -->

2.  Add the key `"checkSingleVersionDependencies"` to `package.json` file,<br>
    specify the names of packages to check as a string array,<br>
    and add `canadyarn` as a runnable script.

    Example:

    ```json
    {
        "checkSingleVersionDependencies": [
            "react",
            "react-native",
            "typescript"
        ],
        "scripts": {
            "canadyarn": "canadyarn"
        }
    }
    ```

<!-- prettier-ignore-end -->

3.  Run `canadyarn`.<br>

    ```sh
    $ yarn run canadyarn
    ```

[npm-badge]: https://img.shields.io/npm/v/canadyarn?style=flat
[npm-link]: https://www.npmjs.com/package/canadyarn
[license-badge]: https://img.shields.io/github/license/lokshunhung/canadyarn?style=flat
[license-link]: https://opensource.org/licenses/MIT
[jw-badge]: https://img.shields.io/badge/%F0%9F%8D%81%20jw%20-approved-brightgreen?style=flat
[jw-link]: https://github.com/wongwingho
