AWS Configuration Cheat Sheet - Updated for new UI

updated 6-26-2020

This lecture note is not intended to be a replacement for the videos, but to serve as a cheat sheet for students who want to quickly run thru the AWS configuration steps or easily see if they missed a step. It will also help navigate through the changes to the AWS UI since the course was recorded.

EBS Application Creation

1.  Go to AWS Management Console and use Find Services to search for Elastic Beanstalk

2.  Click "Create Application"

3.  Set Application Name to 'multi-docker'

4.  Scroll down to Platform and select Docker

5.  In Platform Branch, select Multi-Container Docker running on 64bit Amazon Linux

6.  Click Create Application

7.  You may need to refresh, but eventually, you should see a green checkmark underneath Health.

_RDS Database Creation_

1.  Go to AWS Management Console and use Find Services to search for RDS

2.  Click Create database button

3.  Select PostgreSQL

4.  In Templates, check the Free tier box.

5.  Scroll down to Settings.

6.  Set DB Instance identifier to multi-docker-postgres

7.  Set Master Username to postgres

8.  Set Master Password to postgrespassword and confirm.

9.  Scroll down to Connectivity. Make sure VPC is set to Default VPC

10. Scroll down to Additional Configuration and click to unhide.

11. Set Initial database name to fibvalues

12. Scroll down and click Create Database button

_ElastiCache Redis Creation_

1.  Go to AWS Management Console and use Find Services to search for ElastiCache

2.  Click Redis in sidebar

3.  Click the Create button

4.  Make sure Cluster Mode Enabled is NOT ticked

5.  In Redis Settings form, set Name to multi-docker-redis

6.  Change Node type to 'cache.t2.micro'

7.  Change Replicas per Shard to 0

8.  Scroll down and click Create button

_Creating a Custom Security Group_

1.  Go to AWS Management Console and use Find Services to search for VPC

2.  Find the Security section in the left sidebar and click Security Groups

3.  Click Create Security Group button

4.  Set Security group name to multi-docker

5.  Set Description to multi-docker

6.  Make sure VPC is set to default VPC

7.  Click Create Button

8.  Scroll down and click Inbound Rules

9.  Click Edit Rules button

10. Click Add Rule

11. Set Port Range to 5432-6379

12. Click in the box next to Source and start typing 'sg' into the box. Select the Security Group you just created.

13. Click Create Security Group

_Applying Security Groups to ElastiCache_

1.  Go to AWS Management Console and use Find Services to search for ElastiCache

2.  Click Redis in Sidebar

3.  Check the box next to Redis cluster

4.  Click Actions and click Modify

5.  Click the pencil icon to edit the VPC Security group. Tick the box next to the new multi-docker group and click Save

6.  Click Modify

_Applying Security Groups to RDS_

1.  Go to AWS Management Console and use Find Services to search for RDS

2.  Click Databases in Sidebar and check the box next to your instance

3.  Click Modify button

4.  Scroll down to Network and Security and add the new multi-docker security group

5.  Scroll down and click Continue button

6.  Click Modify DB instance button

_Applying Security Groups to Elastic Beanstalk_

1.  Go to AWS Management Console and use Find Services to search for Elastic Beanstalk

2.  Click Environments in the left sidebar.

3.  Click MultiDocker-env

4.  Click Configuration

5.  In the Instances row, click the Edit button.

6.  Scroll down to EC2 Security Groups and tick box next to multi-docker

7.  Click Apply and Click Confirm

8.  After all the instances restart and go from No Data to Severe, you should see a green checkmark under Health.

9.

Add AWS configuration details to .travis.yml file's deploy script

1.  Set the *region*. The region code can be found by clicking the region in the toolbar next to your username.\
    eg: 'us-east-1'

2.  *app* should be set to the EBS Application Name\
    eg: 'multi-docker'

3.  *env* should be set to your EBS Environment name.\
    eg: 'MultiDocker-env'

4.  Set the *bucket_name*. This can be found by searching for the S3 Storage service. Click the link for the elasticbeanstalk bucket that matches your region code and copy the name.

5.  eg: 'elasticbeanstalk-us-east-1-923445599289'

6.  Set the *bucket_path* to 'docker-multi'

7.  Set *access_key_id* to \$AWS_ACCESS_KEY

8.  Set *secret_access_key* to \$AWS_SECRET_KEY

_Setting Environment Variables_

1.  Go to AWS Management Console and use Find Services to search for Elastic Beanstalk

2.  Click Environments in the left sidebar.

3.  Click MultiDocker-env

4.  Click Configuration

5.  In the Software row, click the Edit button

6.  Scroll down to Environment properties

7.  In another tab Open up ElastiCache, click Redis and check the box next to your cluster. Find the Primary Endpoint and copy that value but omit the :6379

8.  Set REDIS_HOST key to the primary endpoint listed above, remember to omit :6379

9.  Set REDIS_PORT to 6379

10. Set PGUSER to postgres

11. Set PGPASSWORD to postgrespassword

12. In another tab, open up the RDS dashboard, click databases in the sidebar, click your instance and scroll to Connectivity and Security. Copy the endpoint.

13. Set the PGHOST key to the endpoint value listed above.

14. Set PGDATABASE to fibvalues

15. Set PGPORT to 5432

16. Click Apply button

17. After all instances restart and go from No Data, to Severe, you should see a green checkmark under Health.

_IAM Keys for Deployment_

You can use the same IAM User's access and secret keys from the single container app we created earlier.

AWS Keys in Travis

1.  Go to your Travis Dashboard and find the project repository for the application we are working on.

2.  On the repository page, click "More Options" and then "Settings"

3.  Create an *AWS_ACCESS_KEY* variable and paste your IAM access key

4.  Create an *AWS_SECRET_KEY* variable and paste your IAM secret key

Deploying App

1.  Make a small change to your src/App.js file in the greeting text.

2.  In the project root, in your terminal run:

    1.  git add.
    2.  git commit -m "testing deployment"
    3.  git push origin master

3.  Go to your Travis Dashboard and check the status of your build.

4.  The status should eventually return with a green checkmark and show "build passing"

5.  Go to your AWS Elasticbeanstalk application

6.  It should say "Elastic Beanstalk is updating your environment"

7.  It should eventually show a green checkmark under "Health". You will now be able to access your application at the external URL provided under the environment name.
