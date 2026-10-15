// Original, exam-realistic practice questions for full-length timed mock exams.
// These are AUTHORED for this project in the style/format of AWS certification
// exams (scenario-based, single- and multiple-response), tagged by exam domain.
// They are NOT real/leaked exam questions.
//
// Question shape:
//   {
//     q: 'scenario / prompt',
//     options: ['A text', 'B text', ...],
//     answer: [indices...],      // one index = single-answer; multiple = multi-answer
//     domain: 'Domain name',
//     explain: 'why the answer is correct (and others are not)'
//   }
//
// Exam config shape (per module): { minutes, passPct, numQuestions, domains }

export const EXAM_CONFIG = {
  'clf-c02': { minutes: 90, passPct: 70, numQuestions: 65 },
  'aif-c01': { minutes: 90, passPct: 70, numQuestions: 65 },
  'saa-c03': { minutes: 130, passPct: 72, numQuestions: 65 },
  'dva-c02': { minutes: 130, passPct: 72, numQuestions: 65 },
  'soa-c02': { minutes: 130, passPct: 72, numQuestions: 65 },
  'mls-c01': { minutes: 130, passPct: 72, numQuestions: 65 },
  'sap-c02': { minutes: 180, passPct: 75, numQuestions: 75 },
  'devops-c02': { minutes: 180, passPct: 75, numQuestions: 75 },
  'ans-c01': { minutes: 170, passPct: 75, numQuestions: 65 },
  'scs-c02': { minutes: 170, passPct: 75, numQuestions: 65 },
};

export const EXAMS = {
  'saa-c03': [
    {
      q: 'A company runs a web app on EC2 behind an Application Load Balancer in a single Availability Zone. They need the application to stay available if an entire AZ fails, with minimal changes. What should the architect do?',
      options: [
        'Add more EC2 instances in the same AZ',
        'Deploy EC2 instances in a second AZ and let the ALB and an Auto Scaling group span both AZs',
        'Move the instances to a larger instance type',
        'Place the instances behind Amazon CloudFront',
      ],
      answer: [1],
      domain: 'Resilient architectures',
      explain: 'AZ-level resilience requires instances spread across multiple AZs with the ALB and Auto Scaling group spanning them. More/larger instances in one AZ does not survive an AZ failure.',
    },
    {
      q: 'An application writes files that must be read by hundreds of EC2 instances across multiple AZs concurrently, using a standard file-system interface. Which storage service is appropriate?',
      options: ['Amazon EBS', 'Amazon S3', 'Amazon EFS', 'Instance store'],
      answer: [2],
      domain: 'Resilient architectures',
      explain: 'EFS is a shared, multi-AZ, POSIX file system many instances can mount at once. EBS attaches to a single instance in one AZ; S3 is object (not file-system) storage.',
    },
    {
      q: 'A batch workload is fault tolerant and can be interrupted. The company wants the lowest possible compute cost. Which EC2 purchasing option is best?',
      options: ['On-Demand', 'Reserved Instances', 'Spot Instances', 'Dedicated Hosts'],
      answer: [2],
      domain: 'Cost-optimized architectures',
      explain: 'Spot Instances offer the deepest discount and suit interruption-tolerant batch work. RIs/On-Demand cost more; Dedicated Hosts are for isolation/licensing.',
    },
    {
      q: 'A read-heavy relational workload on Amazon RDS is CPU-bound on reads during peak hours. Which change improves read performance with least effort?',
      options: [
        'Enable Multi-AZ',
        'Add one or more read replicas and direct reads to them',
        'Increase the backup retention period',
        'Switch to the io2 volume type only',
      ],
      answer: [1],
      domain: 'High-performing architectures',
      explain: 'Read replicas scale read throughput. Multi-AZ is for availability/failover, not read scaling, and its standby does not serve reads.',
    },
    {
      q: 'A solution must decouple a front-end from a back-end so sudden traffic spikes do not overwhelm the workers, and each message must be processed at least once. What should be used?',
      options: [
        'Amazon SNS standard topic',
        'Amazon SQS standard queue',
        'A larger EC2 instance for the back-end',
        'Amazon Kinesis Data Firehose',
      ],
      answer: [1],
      domain: 'Resilient architectures',
      explain: 'An SQS queue buffers requests so workers process at their own pace, giving at-least-once delivery. SNS is push pub/sub (no buffering for a single worker pool).',
    },
    {
      q: 'An EC2 application needs to read from an S3 bucket. Which approach is the MOST secure way to grant access?',
      options: [
        'Store IAM user access keys in the application code',
        'Attach an IAM role with an S3 read policy to the EC2 instance',
        'Make the bucket public and filter by IP',
        'Embed the keys in an environment variable baked into the AMI',
      ],
      answer: [1],
      domain: 'Secure architectures',
      explain: 'An instance IAM role supplies temporary, auto-rotated credentials with least privilege. Hard-coded or baked-in keys are a security risk, and public buckets expose data.',
    },
    {
      q: 'A company wants to serve a static website globally with low latency and reduce load on the S3 origin. Which combination is best?',
      options: [
        'S3 + Amazon CloudFront',
        'EC2 + Elastic IP',
        'S3 + a NAT Gateway',
        'EFS + Global Accelerator',
      ],
      answer: [0],
      domain: 'High-performing architectures',
      explain: 'CloudFront caches static content at edge locations near users and offloads the S3 origin. The other options do not provide global edge caching for a static site.',
    },
    {
      q: 'Instances in a private subnet must download OS updates from the internet but must NOT be reachable from the internet. What should be configured? (Select ONE.)',
      options: [
        'Attach an Internet Gateway route to the private subnet',
        'Add a NAT Gateway in a public subnet and route the private subnet 0.0.0.0/0 to it',
        'Assign public IPs to the private instances',
        'Create a VPC peering connection',
      ],
      answer: [1],
      domain: 'Secure architectures',
      explain: 'A NAT Gateway allows outbound-initiated internet access while blocking unsolicited inbound. Routing the private subnet directly to an IGW or giving public IPs would expose the instances.',
    },
    {
      q: 'Which TWO actions reduce the monthly cost of an over-provisioned, steady 24/7 production fleet? (Select TWO.)',
      options: [
        'Purchase Compute Savings Plans for the steady baseline',
        'Right-size instances using Compute Optimizer recommendations',
        'Switch all instances to On-Demand',
        'Disable Auto Scaling entirely',
        'Move all data to S3 Glacier Deep Archive',
      ],
      answer: [0, 1],
      domain: 'Cost-optimized architectures',
      explain: 'Savings Plans discount steady baseline usage, and right-sizing removes waste. On-Demand is pricier for steady loads, disabling Auto Scaling hurts efficiency, and archiving active data is unrelated.',
    },
    {
      q: 'A company needs a managed NoSQL database with single-digit-millisecond latency at virtually any scale and no servers to manage. Which service fits?',
      options: ['Amazon RDS', 'Amazon DynamoDB', 'Amazon Redshift', 'Amazon Aurora'],
      answer: [1],
      domain: 'High-performing architectures',
      explain: 'DynamoDB is serverless NoSQL with consistent low latency at scale. RDS/Aurora are relational; Redshift is an analytics warehouse.',
    },
    {
      q: 'To meet a near-zero RTO/RPO requirement for a critical application that must survive a full Region outage, which DR strategy is appropriate (cost is not the primary concern)?',
      options: ['Backup & Restore', 'Pilot Light', 'Warm Standby', 'Multi-Site Active/Active'],
      answer: [3],
      domain: 'Resilient architectures',
      explain: 'Multi-Site Active/Active runs full production in multiple Regions for near-zero RTO/RPO. The others trade lower cost for longer recovery times.',
    },
    {
      q: 'An application must route users to the Region that gives them the lowest latency. Which Route 53 routing policy should be used?',
      options: ['Weighted', 'Latency-based', 'Geolocation', 'Failover'],
      answer: [1],
      domain: 'High-performing architectures',
      explain: 'Latency-based routing sends users to the Region with the lowest measured latency. Geolocation routes by user location (not necessarily lowest latency).',
    },
  ],

  'clf-c02': [
    {
      q: 'Which AWS pricing principle allows a company to pay only for the resources it consumes with no upfront commitment?',
      options: ['Pay less when you reserve', 'Pay-as-you-go', 'Volume-based discounts', 'Dedicated pricing'],
      answer: [1],
      domain: 'Billing & pricing',
      explain: 'Pay-as-you-go charges only for consumed resources with no commitment. Reserving and volume discounts are separate pricing levers.',
    },
    {
      q: 'Under the Shared Responsibility Model, which task is the CUSTOMER responsible for?',
      options: [
        'Securing the physical data centers',
        'Patching the guest operating system on an EC2 instance',
        'Maintaining the global network backbone',
        'Replacing failed hardware',
      ],
      answer: [1],
      domain: 'Security & compliance',
      explain: 'Customers manage the guest OS, including patches, on EC2 ("security IN the cloud"). AWS handles the physical/host infrastructure.',
    },
    {
      q: 'Which service provides a single bill and combined volume discounts across multiple AWS accounts?',
      options: ['AWS Budgets', 'AWS Organizations consolidated billing', 'Cost Explorer', 'AWS Config'],
      answer: [1],
      domain: 'Billing & pricing',
      explain: 'Consolidated billing in AWS Organizations aggregates charges and shares volume pricing across accounts.',
    },
    {
      q: 'Which TWO are advantages of cloud computing described by AWS? (Select TWO.)',
      options: [
        'Trade capital expense for variable expense',
        'Guess capacity ahead of time',
        'Go global in minutes',
        'Increase time spent maintaining data centers',
        'Lock into a single Region permanently',
      ],
      answer: [0, 2],
      domain: 'Cloud concepts',
      explain: 'Trading CapEx for variable expense and going global in minutes are core advantages. The cloud removes capacity guessing and data-center maintenance.',
    },
    {
      q: 'A customer needs 24/7 access to AWS support engineers and the full set of Trusted Advisor checks for a production workload. Which support plan is the minimum that meets this?',
      options: ['Basic', 'Developer', 'Business', 'Free Tier'],
      answer: [2],
      domain: 'Billing & support',
      explain: 'Business support is the minimum tier offering 24/7 engineer access and all Trusted Advisor checks.',
    },
    {
      q: 'Which service lets you estimate the cost of a planned AWS architecture BEFORE deploying it?',
      options: ['Cost Explorer', 'AWS Pricing Calculator', 'AWS Budgets', 'AWS Trusted Advisor'],
      answer: [1],
      domain: 'Billing & pricing',
      explain: 'The Pricing Calculator produces up-front estimates. Cost Explorer analyzes actual historical spend after the fact.',
    },
    {
      q: 'What best describes an AWS Availability Zone?',
      options: [
        'A single globally distributed cache',
        'One or more discrete data centers with redundant power and networking within a Region',
        'A billing construct',
        'A content delivery edge location',
      ],
      answer: [1],
      domain: 'Cloud concepts',
      explain: 'An AZ is one or more isolated data centers within a Region, enabling fault-tolerant designs across AZs.',
    },
    {
      q: 'Which AWS service provides object storage?',
      options: ['Amazon EBS', 'Amazon EFS', 'Amazon S3', 'Amazon FSx'],
      answer: [2],
      domain: 'Technology',
      explain: 'S3 is object storage. EBS is block, EFS/FSx are file storage.',
    },
  ],

  'sap-c02': [
    {
      q: 'An enterprise with 200 AWS accounts must enforce that no account can disable CloudTrail, regardless of local admin permissions. What should the architect implement?',
      options: [
        'An IAM policy attached to every user',
        'A Service Control Policy (SCP) at the organization/OU level denying cloudtrail:StopLogging',
        'A permissions boundary on the root user',
        'A security group rule',
      ],
      answer: [1],
      domain: 'Multi-account governance',
      explain: 'SCPs set the maximum permissions for member accounts; a deny on StopLogging cannot be overridden by any account admin. IAM policies/boundaries do not constrain other accounts organization-wide.',
    },
    {
      q: 'A company must transfer 150 TB of data to AWS within two weeks, but its internet link would take months. What is the MOST suitable approach?',
      options: [
        'AWS DataSync over the internet',
        'AWS Snowball Edge devices shipped to AWS',
        'Database Migration Service',
        'S3 Transfer Acceleration only',
      ],
      answer: [1],
      domain: 'Migration planning',
      explain: 'The Snow Family physically ships large datasets when network transfer is impractical. DataSync/Transfer Acceleration still depend on the slow link.',
    },
    {
      q: 'An architecture needs hub-and-spoke connectivity between 50 VPCs and two on-premises sites, centrally managed. Which service is the best fit?',
      options: ['VPC peering between every VPC', 'AWS Transit Gateway', 'An Internet Gateway per VPC', 'AWS Direct Connect only'],
      answer: [1],
      domain: 'Network design',
      explain: 'Transit Gateway provides scalable hub-and-spoke connectivity, avoiding an unmanageable full mesh of peering connections.',
    },
    {
      q: 'Which TWO mechanisms help centrally reduce cost across many accounts in an organization? (Select TWO.)',
      options: [
        'Consolidated billing for combined volume discounts',
        'Organization-wide Savings Plans sharing',
        'Giving every account its own unrelated billing',
        'Disabling Cost Explorer',
        'Running all workloads On-Demand only',
      ],
      answer: [0, 1],
      domain: 'Cost control',
      explain: 'Consolidated billing aggregates usage for volume discounts, and Savings Plans discounts can be shared across the organization. The other options increase or ignore cost.',
    },
    {
      q: 'A critical workload requires an RPO of seconds and an RTO of under a minute across two Regions. Which approach best meets this?',
      options: [
        'Nightly backups copied to a second Region',
        'Pilot Light with manual failover',
        'Active/active multi-Region with a global data store (e.g. DynamoDB Global Tables or Aurora Global Database)',
        'Single-Region Multi-AZ only',
      ],
      answer: [2],
      domain: 'Resilience & DR',
      explain: 'Active/active with global data replication meets near-zero RPO/RTO. Backups and pilot light have far longer recovery times; single-Region Multi-AZ does not survive a Region loss.',
    },
    {
      q: 'A user has an IAM policy granting s3:GetObject but still receives AccessDenied in a specific account. What is the MOST likely cause?',
      options: [
        'The object does not exist',
        'An SCP or permissions boundary denies the action at a higher level',
        'S3 is down in the Region',
        'The user needs an EC2 instance',
      ],
      answer: [1],
      domain: 'Multi-account governance',
      explain: 'An explicit deny from an SCP or permissions boundary overrides an identity allow. This is the classic "allowed but still denied" multi-account pattern.',
    },
  ],

  'dva-c02': [
    {
      q: 'A Lambda function intermittently times out while calling a slow downstream API. The current timeout is the default. Which change is appropriate while keeping cost in mind?',
      options: [
        'Increase the function timeout up to the needed value (max 15 minutes) and tune memory',
        'Move the code to a 20-minute Lambda',
        'Disable the timeout entirely',
        'Call the function recursively',
      ],
      answer: [0],
      domain: 'Serverless development',
      explain: 'Lambda supports up to a 15-minute timeout; raise it appropriately and tune memory (which also scales CPU). There is no 20-minute Lambda, and timeouts cannot be disabled.',
    },
    {
      q: 'A developer must store a database password used by an application and have it rotated automatically. Which service is best?',
      options: ['AWS Secrets Manager', 'Plain environment variable', 'Amazon S3 object', 'AWS Config'],
      answer: [0],
      domain: 'Security',
      explain: 'Secrets Manager stores secrets securely and supports automatic rotation. Plain env vars/S3 objects are not designed for rotating secrets.',
    },
    {
      q: 'Which deployment approach for a Lambda function shifts a small percentage of traffic to the new version first and automatically rolls back on CloudWatch alarm?',
      options: ['All-at-once', 'Canary with alias traffic shifting', 'Recreate', 'In-place only'],
      answer: [1],
      domain: 'Deployment',
      explain: 'CodeDeploy canary deployments shift a small traffic percentage first via a Lambda alias and can auto-rollback on alarms.',
    },
    {
      q: 'A developer wants microsecond read latency for a read-heavy DynamoDB table. What should be added?',
      options: ['A read replica', 'DynamoDB Accelerator (DAX)', 'An EBS cache volume', 'A larger instance'],
      answer: [1],
      domain: 'Serverless development',
      explain: 'DAX is a purpose-built in-memory cache for DynamoDB delivering microsecond reads. DynamoDB has no "read replica" or instance to size.',
    },
    {
      q: 'Which service provides managed user sign-up, sign-in, and token issuance for a web/mobile app?',
      options: ['Amazon Cognito user pools', 'AWS KMS', 'AWS STS directly', 'Amazon Inspector'],
      answer: [0],
      domain: 'Security',
      explain: 'Cognito user pools handle sign-up/sign-in and issue tokens. KMS is for keys; STS issues temporary AWS credentials (often via Cognito identity pools).',
    },
  ],

  'soa-c02': [
    {
      q: 'An operator needs memory-utilization metrics from EC2 instances, which are not available by default. What is required?',
      options: [
        'Nothing \u2014 memory is a default metric',
        'Install and configure the CloudWatch Agent',
        'Enable CloudTrail',
        'Create a NAT Gateway',
      ],
      answer: [1],
      domain: 'Monitoring',
      explain: 'Memory and disk are OS-level metrics not published by default; the CloudWatch Agent collects and pushes them. CloudTrail is for API audit.',
    },
    {
      q: 'Administrators must get shell access to EC2 instances without opening inbound port 22 or running a bastion host. Which service enables this?',
      options: ['Systems Manager Session Manager', 'Direct Connect', 'EC2 Instance Connect over the internet', 'AWS Config'],
      answer: [0],
      domain: 'Automation',
      explain: 'Session Manager provides audited shell access with no open inbound ports and no bastion. It is the standard operational answer here.',
    },
    {
      q: 'An RDS instance was deleted and its automated backups are gone. Which practice would have preserved a recovery point?',
      options: [
        'Rely only on Multi-AZ',
        'Take a manual snapshot (or final snapshot on deletion), which persists until explicitly removed',
        'Enable more read replicas',
        'Increase instance size',
      ],
      answer: [1],
      domain: 'Reliability',
      explain: 'Automated backups are removed with the instance; manual/final snapshots persist independently. Multi-AZ and replicas do not provide retained point-in-time copies after deletion.',
    },
    {
      q: 'A CloudWatch alarm should take corrective action when CPU stays high. Which TWO actions can an alarm trigger directly? (Select TWO.)',
      options: [
        'Send an Amazon SNS notification',
        'Trigger an EC2 Auto Scaling policy',
        'Rewrite the application code',
        'Delete the VPC',
        'Rotate IAM access keys',
      ],
      answer: [0, 1],
      domain: 'Monitoring',
      explain: 'Alarms can publish to SNS and invoke Auto Scaling actions (among others). They do not edit code, delete networks, or rotate keys directly.',
    },
  ],

  'aif-c01': [
    {
      q: 'A company wants a chatbot grounded in its internal documents without retraining a model. Which approach is MOST appropriate?',
      options: [
        'Pre-train a new foundation model from scratch',
        'Use Retrieval-Augmented Generation (RAG) to inject relevant documents at query time',
        'Fine-tune on the entire internet',
        'Increase the temperature setting',
      ],
      answer: [1],
      domain: 'Generative AI',
      explain: 'RAG retrieves relevant private documents and adds them to the prompt, grounding answers without retraining. Pre-training/broad fine-tuning is costly and unnecessary.',
    },
    {
      q: 'Which AWS service provides access to multiple foundation models through a single API for building generative AI applications?',
      options: ['Amazon SageMaker', 'Amazon Bedrock', 'Amazon Comprehend', 'Amazon Rekognition'],
      answer: [1],
      domain: 'AWS AI services',
      explain: 'Bedrock offers managed access to multiple foundation models via one API. SageMaker builds custom models; Comprehend/Rekognition are specific AI services.',
    },
    {
      q: 'Which is a core principle of responsible AI?',
      options: ['Maximize model size', 'Fairness and bias mitigation', 'Avoid documentation', 'Always pick the cheapest model'],
      answer: [1],
      domain: 'Responsible AI',
      explain: 'Responsible AI emphasizes fairness, explainability, privacy, safety and governance \u2014 not model size or cost alone.',
    },
    {
      q: 'A supervised learning task predicts whether a transaction is fraudulent, and the dataset is highly imbalanced. Which evaluation metric is MOST informative?',
      options: ['Raw accuracy', 'Precision/recall (or F1)', 'Model file size', 'Training time'],
      answer: [1],
      domain: 'ML fundamentals',
      explain: 'On imbalanced data, accuracy can be misleading; precision/recall/F1 better reflect performance on the rare positive class.',
    },
  ],

  'devops-c02': [
    {
      q: 'A team wants automatic rollback of an ECS deployment if error rates spike immediately after release. Which combination achieves this?',
      options: [
        'CodeDeploy blue/green for ECS with a CloudWatch alarm configured as a rollback trigger',
        'Manual redeploy after noticing errors',
        'A single in-place update with no monitoring',
        'Disabling health checks',
      ],
      answer: [0],
      domain: 'CI/CD',
      explain: 'CodeDeploy blue/green with CloudWatch alarm rollback triggers automatically reverts traffic on error spikes. The other options lack automated safety.',
    },
    {
      q: 'Which approach makes infrastructure changes safe to preview before applying with CloudFormation?',
      options: ['Apply directly to production', 'Use change sets to preview create/modify/delete actions', 'Delete and recreate the stack', 'Edit resources manually in the console'],
      answer: [1],
      domain: 'Infrastructure as Code',
      explain: 'Change sets show exactly what an update will do before you execute it. Manual edits cause drift; delete/recreate risks data loss.',
    },
    {
      q: 'A compliance rule must auto-remediate any security group opened to 0.0.0.0/0 on port 22. Which event-driven design fits?',
      options: [
        'AWS Config rule detects the violation and triggers SSM Automation / Lambda via EventBridge to remediate',
        'A nightly manual review',
        'A CloudFront distribution',
        'An SQS queue only',
      ],
      answer: [0],
      domain: 'Monitoring & remediation',
      explain: 'Config detects non-compliance and EventBridge triggers automated remediation (SSM Automation/Lambda). The other options are not automated detective+corrective controls.',
    },
  ],

  'ans-c01': [
    {
      q: 'Instances in a private subnet must reach Amazon S3 without traversing a NAT Gateway or the public internet. What should be configured?',
      options: ['An S3 Gateway VPC endpoint with a route-table entry', 'A second NAT Gateway', 'A public IP on each instance', 'An Internet Gateway route'],
      answer: [0],
      domain: 'VPC connectivity',
      explain: 'A Gateway endpoint for S3 adds a route so traffic stays on the AWS network with no NAT or internet path. The other options use the public internet or add cost.',
    },
    {
      q: 'A company needs a dedicated, consistent-bandwidth private connection from its data center to AWS, with an encrypted backup path. Which design is best?',
      options: [
        'Two internet VPNs only',
        'AWS Direct Connect as primary with a Site-to-Site VPN as backup',
        'A single Direct Connect with no backup',
        'VPC peering to on-premises',
      ],
      answer: [1],
      domain: 'Hybrid connectivity',
      explain: 'Direct Connect gives dedicated bandwidth; a VPN provides an encrypted failover path. A single DX has no redundancy, and VPC peering cannot connect on-premises.',
    },
    {
      q: 'An application uses a non-HTTP TCP protocol and needs static anycast IP addresses plus fast regional failover. Which service should be used?',
      options: ['Amazon CloudFront', 'AWS Global Accelerator', 'Amazon Route 53 weighted routing', 'An Application Load Balancer'],
      answer: [1],
      domain: 'Edge & DNS',
      explain: 'Global Accelerator provides static anycast IPs and fast failover for TCP/UDP. CloudFront is for cacheable HTTP(S); ALB is Layer 7 only.',
    },
  ],

  'scs-c02': [
    {
      q: 'A principal has an IAM policy allowing kms:Decrypt but receives AccessDenied when using a KMS key. What is the MOST likely cause?',
      options: [
        'The KMS key policy does not grant the principal access',
        'KMS requires a NAT Gateway',
        'The key is in S3',
        'The principal needs an EC2 instance',
      ],
      answer: [0],
      domain: 'Data protection',
      explain: 'A KMS key policy is the primary access control; without it granting the principal, IAM allow alone is insufficient. This is a frequently tested KMS nuance.',
    },
    {
      q: 'Which service automatically discovers and classifies sensitive data such as PII stored in Amazon S3?',
      options: ['Amazon Macie', 'Amazon GuardDuty', 'Amazon Inspector', 'AWS Shield'],
      answer: [0],
      domain: 'Data protection',
      explain: 'Macie uses ML to find and classify sensitive data in S3. GuardDuty is threat detection; Inspector scans for vulnerabilities; Shield is DDoS protection.',
    },
    {
      q: 'A security team wants automated response when GuardDuty reports a compromised instance. Which design achieves this?',
      options: [
        'GuardDuty finding \u2192 EventBridge rule \u2192 Lambda/SSM to isolate the instance',
        'Email the team and wait',
        'Enable a larger instance type',
        'Disable CloudTrail',
      ],
      answer: [0],
      domain: 'Incident response',
      explain: 'EventBridge routes GuardDuty findings to automated remediation (Lambda/SSM) to isolate the instance. The other options are manual or counterproductive.',
    },
    {
      q: 'Which TWO practices protect the integrity of centralized CloudTrail logs? (Select TWO.)',
      options: [
        'Enable log file validation',
        'Use S3 Object Lock / restrictive bucket policy on the log bucket',
        'Grant every account write-delete on the bucket',
        'Turn off encryption',
        'Store logs only on an EC2 instance',
      ],
      answer: [0, 1],
      domain: 'Logging & monitoring',
      explain: 'Log file validation detects tampering, and Object Lock/restrictive policies prevent deletion or modification. Broad delete rights, no encryption, and single-instance storage weaken integrity.',
    },
  ],

  'mls-c01': [
    {
      q: 'A model performs well on training data but poorly on new data. What is this called and a valid mitigation?',
      options: [
        'Underfitting \u2014 add more layers only',
        'Overfitting \u2014 add regularization, more data, or simplify the model',
        'Data drift \u2014 ignore it',
        'Label leakage \u2014 increase epochs',
      ],
      answer: [1],
      domain: 'Modeling',
      explain: 'Strong train / weak test performance is overfitting; mitigate with regularization, more/representative data, or a simpler model and proper validation.',
    },
    {
      q: 'An inference workload has sporadic, unpredictable traffic and must avoid paying for idle endpoints. Which SageMaker option fits best?',
      options: ['Real-time endpoint always on', 'Serverless inference', 'Batch transform', 'A large provisioned cluster'],
      answer: [1],
      domain: 'Deployment',
      explain: 'Serverless inference scales to zero and bills per request, ideal for intermittent traffic. Always-on endpoints and provisioned clusters pay for idle capacity.',
    },
    {
      q: 'Which SageMaker capability detects data/quality drift in production and can trigger retraining?',
      options: ['SageMaker Model Monitor', 'SageMaker Ground Truth', 'SageMaker Feature Store', 'SageMaker Clarify only'],
      answer: [0],
      domain: 'MLOps',
      explain: 'Model Monitor watches live data/quality for drift and can trigger alerts/retraining. Ground Truth labels data; Feature Store stores features; Clarify focuses on bias/explainability.',
    },
  ],
};

export function getExam(moduleId) {
  return EXAMS[moduleId] || [];
}

export function getExamConfig(moduleId) {
  return EXAM_CONFIG[moduleId] || { minutes: 130, passPct: 72, numQuestions: 65 };
}
