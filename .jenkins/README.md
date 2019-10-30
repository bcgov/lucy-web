# Setting Up

For running locally, use locally installed npm/node. The command snippets provided below assume you have npm/node installed. Also, the command examples here are provided as subshell commands (within parentheses) so that they will work regardless of your current shell's working directory, as long as it is within the git working directory.

For running from a Jenkinsfile, replace `npm` with the provided `npmw` as it will download and install node/npm using `nvm`.

## Installing Node and NPM

*For Mac OSX:*

1. Install Xcode from the App Store

2. Install Homebrew following the instructions here: https://brew.sh/

3. Install Node (Note: This will also install the Command Line Tools for Xcode)  
`brew install node`

*For Windows:*

1. Select the appropriate installer (32-bit or 64-bit) from here: https://nodejs.org/en/download/

2. Run the installer and follow its prompts

3. Restart your computer

*Validate install:*

You can test your installation by running `node -v` and `npm -v` which should produce output indicating which version has been installed.

# Build
```
( cd "$(git rev-parse --show-toplevel)/.jenkins/.pipeline" && npm run build -- --pr=0 --dev-mode=true )
```
Where:
`--pr=0` is used to set the pull request number to build from.
`--dev-mode=true` is used to indicate that the build will actually use the files in the current working directory, as opposed to a fresh `git clone`

# Deploy to DEV
```
( cd "$(git rev-parse --show-toplevel)/.jenkins/.pipeline" && npm run deploy -- --pr=0 --env=dev )
```

# Deploy to PROD
```
( cd "$(git rev-parse --show-toplevel)/.jenkins/.pipeline" && npm run deploy -- --pr=0 --env=prod )
```

# Clean
The clean script can run against each persistent environment, starting from `build`.
```
( cd "$(git rev-parse --show-toplevel)/.jenkins/.pipeline" && npm run clean -- --pr=0 --env=build )
( cd "$(git rev-parse --show-toplevel)/.jenkins/.pipeline" && npm run clean -- --pr=0 --env=dev )
```

*Warning*: Do *NOT* run against `test` or `prod`. It will cause *PERMANENT* deletion of all objects including `PVC`! be warned!
