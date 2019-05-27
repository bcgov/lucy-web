# Lucy - Invasive species management tools (ISMT)



# Set-up
### Note: Please use the below instructions as written to run the app seamlessly
* Install Docker
    link: https://gist.github.com/rstacruz/297fc799f094f55d062b982f7dac9e41
* Install GMAKE
* Clone repository
* Change to project dir (from command line or terminal)

## Docker

### Unix/Linux/Mac/Windows

### Setting up Env

* Duplicate env.example to env.local file
* Create Empty .env file in root dir
* Update app secret values in env.local (env.local is .gitignored)

### Run App in Local env

* RUN APP : make local
* DEBUG APP: make local_debug
* Stop App: make close_local
* Clean App: make clean_local