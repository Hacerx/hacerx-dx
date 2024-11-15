# summary

Get types.

# description

Get types for your custom objects from the org.

# flags.base-url.summary

Base directory to resolve non-relative module names.

# flags.base-url.description

Base directory to resolve non-relative module names.

# flags.init.summary

Initialize the config file.

# flags.init.description

Initialize the config file or overrides the existing one.

# examples

- Generate jsconfig:

  <%= config.bin %> <%= command.id %>

- Initialize jsconfig or override existing one:

  <%= config.bin %> <%= command.id %> --init

- Base url is set to the current directory:

  <%= config.bin %> <%= command.id %> --base-url .
