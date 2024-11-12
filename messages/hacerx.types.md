# summary

Get types.

# description

Get types for your custom objects from the org.

# flags.sobject.summary

SObject(s) to get types for

# flags.sobject.description

SObject(s) to get types for

Get multiple types, either set multiple --sobject <name> flags or a single --sobject flag with multiple names separated by spaces. Enclose names that contain spaces in one set of double quotes.

# flags.api-version.summary

Target API version for the deploy.

# flags.api-version.description

Use this flag to override the default API version with the API version of your package.xml file. The default API version is the latest version supported by the CLI.

# flags.output-dir.summary

Output directory

# flags.output-dir.description

The directory to output the types to

# examples

- Get all types:

  <%= config.bin %> <%= command.id %>

- Get types for a specific SObject:

  <%= config.bin %> <%= command.id %> --sobject Account

# info.hello

Hello %s at %s.
