# summary

Get types.

# description

Get types for your custom objects from the org.

# flags.sobject.summary

SObject(s) to get types for

# flags.sobject.description

SObject(s) to get types for

Get multiple types, either set multiple --sobject <name> flags or a single --sobject flag with multiple names separated by spaces. Enclose names that contain spaces in one set of double quotes.

It can be used with the `--case-insensitive` flag to ignore the case of SObject names.

Allows wildcard characters `*` and `.`.

# flags.api-version.summary

Target API version for the deploy.

# flags.api-version.description

Use this flag to override the default API version with the API version of your package.xml file. The default API version is the latest version supported by the CLI.

# flags.output-dir.summary

Output directory

# flags.output-dir.description

The directory to output the types to

# flags.case-insensitive.summary

Case insensitive SObject names

# flags.case-insensitive.description

Use this flag to ignore the case of SObject names

# flags.declare-module.summary

Add declare module to the output file

# flags.declare-module.description

Add declare module to the output file

# examples

- Get all types:

  <%= config.bin %> <%= command.id %>

- Get types for a specific SObject:

  <%= config.bin %> <%= command.id %> --sobject Account

- Get types for multiple SObjects:

  <%= config.bin %> <%= command.id %> --sobject Account --sobject Contact
  <%= config.bin %> <%= command.id %> --sobject Account Contact

- Get types for all sobjects that start with a specific prefix:

  <%= config.bin %> <%= command.id %> --sobject Acc\*

- Get types for all sobjects that end with a specific suffix:

  <%= config.bin %> <%= command.id %> --sobject \*ct

- Get types for all sobjects that contain a specific substring:

  <%= config.bin %> <%= command.id %> --sobject \*ct\*

# info.hello

Hello %s at %s.
