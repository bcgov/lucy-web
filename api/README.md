# invasiveBC - Invasive species management tools (ISMT) - API
This is the application source code for the Restful API of the Invasive species database.

## Setting Up
### Requirements
* Install Docker following the instructions in the project root README
* Install GMAKE
* Clone repository
* Change to project dir (from command line or terminal)
* `oc` for open shift build and deployment

### Setting Up Env

* Duplicate `env.example` to `env.local` file
* Create empty `.env` file in root dir
* Update app secret values in `env.local` (env.local is .gitignored and will not be committed)

## Running the Application

*Run App in Local env*

* RUN APP: `make local`
* DEBUG APP: `make local_debug`
* Stop App: `make close_local`
* Clean App: `make clean_local`

## Closing the Application

## Clean Remote Instance of the application

Clean Remote:  
`make clean-remote PR={PR_NUM | static deployment name like dev/test/prod} ENV={dev | test | prod}`

*Examples*

* make clean-remote PR=99 ENV=dev
* make clean-remote PR=dev ENV=dev

## Running Tests