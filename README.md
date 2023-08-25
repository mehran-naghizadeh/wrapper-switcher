# wrapper-switcher README

This handy extension empowers you to modify the surrounding context of specific text segments effortlessly. It effortlessly transforms double quotes into single quotes and vice versa, enhancing flexibility in your writing. Additionally, it seamlessly converts curly braces to regular parentheses and vice versa, enriching your text manipulation options.

|         |        | With range selection | Without selection |
| :---:   | :---:  | :---:                | :---:             |
| "xyz"   | **⟶** | 'xyz'                | 'xyz'             |
| 'xyz'   | **⟶** | "xyz"                | "xyz"             |
| (xyz)   | **⟶** | {xyz}                | {{xyz}}           |
| {xyz}   | **⟶** | (xyz)                |                   |
| {{xyz}} | **⟶** | ({xyz})              | (xyz)             |

## Utilization

This extension supports two modes of utilization.

### With a selection
Select your desired range of text surrounded by `{{`, `(`, `'` or `"` . Then, simply press `Ctrl+Shift+P` and type `Switch Quotes`. Done!

![activation-select-range](https://github.com/mehran-naghizadeh/wrapper-switcher/assets/24450563/59546ce8-22e8-4771-b8a2-2c9b871bb850)

## Without any selection
Just put your cursor anywhere in your code, trigger the `Switch Quotes` command as before, and let the extension figure it out for you.


## Known Issues

No known issues, yet.

## Release Notes

### 0.0.1

Initial release
