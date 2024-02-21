# Invasives BC Pipeline

Invasives BC automatic Jenkins pipeline checks code integrity (Continuous integration) and perform deployment to various environment (Continuous deployment).  
  
## Pull Request with Continuous Integration

* Create Pull Request in GitHub.

* Automatic pipeline continuous integration stages (Build and Test) will invoke. CI stages check integrity of new code, must finish with success.

* Merge Pull Request in GitHub.

* Accept cleaning of PR related assets of OpenShift in Jenkins **Acceptance Pull Request** stage.

## Branch Action for Continuous Deployment

Any changes like Push or Merge to `dev` branch triggers a build and deployment to Dev/Test Environment.

## Continuous Production Deployment

* Create Pull Request with target branch as `prod` (conventionally source branch will be `dev`).

* Automatic pipeline continuous integration stages (Build and Test) will invoke. CI stages check integrity of new code, must finish with success.

* Manually accept Prod deployment in Jenkins **Deploy (PROD) API/APP [CD]** stage.

* Accept cleaning of PR related assets of OpenShift in Jenkins **Acceptance Pull Request** stage.

![FlowDiagram](documentation/images/Pipeline.png)

## Various Pipeline Stages

### BUILD (CI)

Build Stage build application from Pull Request(PR) source branch. This is a parallel collection of **Build API** and **Build APP** stages.  

### Test Stages (CI)

#### Pre-deploy Stage

Pre-deploy stages, setup Database for testing. This stage includes process like

1. Deploy test database.
2. Run migration or setup database.
3. Run seeder.

#### Test Stage

Run tests with SonarQube Analysis.

#### Security Scan

Whenever a new PR is created or a new commit is pushed to an existing PR, a dynamic security scan will be performed on the DEV environment (https://dev-invasivesbc.apps.silver.devops.gov.bc.ca/) using OWASP Zap's baseline scan. The results of the scan will be displayed on the PR's page in GitHub.

OWASP Zap and GitHub Actions will automatically create a new Issue for any security vulnerabilities discovered during the scan.

* Note that currently the GitHub Action zap-scan (https://github.com/bcgov/lucy-web/blob/dev/.github/workflows/zap-scan.yml) is configured to `continue-on-error: true` due to a bug in GitHub Actions regarding import of the `octokit/rest` package. This line can be removed once GitHub fixes the bug. In the meantime, it should not affect the actual output of the Zap scan.*

### BUILD DEV/Test (CD)

This is manually accepted stage, mainly create static dev branch build images for deployment. This and __Deploy Dev__ and __Deploy Test__ stages will invoke if PR target is dev branch.

### Deploy Dev (CD)

Deploy static dev branch images to dev env. Steps are

1. Deploy DB
2. Run DB Backup.
3. Migrate DB
4. Run Seeder.
5. Deploy API.
6. Deploy Tools (SchemaSpy).
7. Deploy APP.

### Deploy Test (CD)

Deploy static dev branch images to test env. Steps are

1. Deploy DB
2. Run DB Backup.
3. Migrate DB
4. Run Seeder.
5. Deploy API.
6. Deploy Tools (SchemaSpy).
7. Deploy APP.

### Deploy Prod (CD)

This is a manually accepted stage. This stage deploy with creation of Pull Request with **prod** as target branch. __Deploy Prod__ stage will deploy Pull Request specific image to production env. Steps are

1. Deploy DB
2. Run DB Backup.
3. Migrate DB
4. Deploy API.
5. Deploy Tools (SchemaSpy).
6. Deploy APP.

__**N.B: Standard process of production deployment is to create a Pull Request with dev as source branch and prod as target branch**__

### Acceptance Branch

This is automatic pipeline stage to clean unused asset for Branch action.

1. Clean API build config from tool namespace.
2. Clean APP build config from tool namespace.

### Acceptance Pull Request

This is manually accepted step to clean all PR related assets.

1. Clean API build config from tool namespace.
2. Clean APP build config from tool namespace.
3. Clean Pull Request related API deployment.
4. Clean Pull Request related APP deployment

## Note for Pull Request Owner

Followings are responsibility of Pull Request (PR) owners

* Make sure all CI stages should run with success.
* Merge Pull Request before accepting any deployment stages (except prod deployment).
* Deployment of Dev/Test/Prod Env.
* **Acceptance for cleaning stag**.
* If any continuos deployment process fail,
    1. Reopen PR.
    2. Fix issue.
    3. Ask for fresh review.

## Note for Pull Request Reviewer

Followings are responsibility of Pull Request (PR) reviewer

* Review code under Code Review Guideline
* Before accepting any PR, make sure all CI stages (BUILD CI, Test CI) executed successfully.
