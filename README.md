# Journalia

# SST

Look [here](https://github.com/sst/sst/tree/dev/examples) for SST examples

## AWS Auth (SSO)
In order to run any of the SST commands towards the AWS environment you have to auth with sso. If you have set up AWS as described below, run the following.

```sh
$ pnpm sst:sso
```


### Setting up AWS

[AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) - [SST AWS Docs](https://sst.dev/docs/aws-accounts#configure-aws-cli)
```sh
# Install the AWS CLI
$ curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
$ sudo installer -pkg AWSCLIV2.pkg -target /
```