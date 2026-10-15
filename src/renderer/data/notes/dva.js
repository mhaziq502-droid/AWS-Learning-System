// DVA-C02 — Developer Associate. Original study notes.

export default [
  {
    id: 'dva-serverless',
    title: 'Serverless with Lambda & API Gateway',
    blocks: [
      {
        type: 'p',
        text: 'Serverless lets you run code without managing servers. Lambda runs your function in response to events; API Gateway exposes it as an HTTP/REST/WebSocket API. You pay only while code executes.',
      },
      {
        type: 'diagram',
        code: `graph LR
  Client((Client)) --> APIGW[API Gateway]
  APIGW --> Lambda[Lambda function]
  Lambda --> DDB[(DynamoDB)]
  Lambda --> S3[(S3)]`,
      },
      { type: 'h', text: 'Lambda key limits & concepts' },
      {
        type: 'list',
        items: [
          'Max execution time: 15 minutes. Memory 128 MB\u201310 GB; CPU scales with memory.',
          'Cold start \u2014 first invocation after idle incurs init latency; mitigate with Provisioned Concurrency.',
          'Concurrency \u2014 reserve/limit how many copies run in parallel to protect downstream systems.',
          'Environment variables for config; use IAM execution role for permissions (no stored keys).',
        ],
      },
      {
        type: 'tip',
        text: 'API Gateway features worth knowing: throttling (protect backends), caching (reduce calls), stages (dev/prod), and authorizers (Cognito or Lambda authorizer for auth).',
      },
    ],
  },
  {
    id: 'dva-dynamodb',
    title: 'DynamoDB for developers',
    blocks: [
      {
        type: 'p',
        text: 'DynamoDB is a fully managed key-value/document database with single-digit-millisecond latency at any scale. Table design centers on the partition key (and optional sort key).',
      },
      {
        type: 'list',
        items: [
          'Partition key choice must spread load evenly \u2014 a "hot" key throttles.',
          'Secondary indexes: GSI (different partition/sort key, own capacity) and LSI (same partition key, alternate sort key, created at table creation).',
          'Capacity modes: On-Demand (pay per request, unpredictable traffic) vs Provisioned (set RCU/WCU, steady traffic, cheaper).',
          'DynamoDB Streams emit change events \u2014 great for triggering Lambda in event-driven designs.',
          'DAX provides a microsecond read cache in front of the table.',
        ],
      },
      {
        type: 'tip',
        text: '"Reduce read latency from milliseconds to microseconds for DynamoDB" \u2192 DAX. "Trigger processing whenever an item changes" \u2192 DynamoDB Streams + Lambda.',
      },
    ],
  },
  {
    id: 'dva-cicd',
    title: 'CI/CD with the Code* services',
    blocks: [
      {
        type: 'p',
        text: 'AWS provides a managed developer toolchain for continuous integration and delivery.',
      },
      {
        type: 'diagram',
        code: `graph LR
  Commit[CodeCommit\\nsource] --> Build[CodeBuild\\nbuild + test]
  Build --> Deploy[CodeDeploy\\ndeploy]
  Pipeline[CodePipeline orchestrates all stages] -.-> Commit
  Pipeline -.-> Build
  Pipeline -.-> Deploy`,
      },
      {
        type: 'table',
        head: ['Service', 'Role'],
        rows: [
          ['CodeCommit', 'Managed Git repositories'],
          ['CodeBuild', 'Compile, run tests, produce artifacts'],
          ['CodeDeploy', 'Deploy to EC2, Lambda, ECS'],
          ['CodePipeline', 'Orchestrate the end-to-end workflow'],
          ['CodeArtifact', 'Store and share packages/dependencies'],
        ],
      },
      {
        type: 'tip',
        text: 'Deployment styles: in-place, blue/green (instant rollback by shifting traffic back), and canary (shift a small % first). For Lambda, use aliases + weighted traffic for canary.',
      },
    ],
  },
  {
    id: 'dva-auth-observe',
    title: 'Auth, SDKs & observability',
    blocks: [
      {
        type: 'list',
        items: [
          'Use the AWS SDK with an IAM role; obtain temporary credentials from STS rather than embedding keys.',
          'Cognito User Pools handle sign-up/sign-in; Identity Pools grant temporary AWS access to app users.',
          'X-Ray provides distributed tracing to find latency/errors across services.',
          'CloudWatch Logs, Metrics, and custom metrics (EMF) give operational visibility.',
          'SAM / CloudFormation define serverless infrastructure as code.',
        ],
      },
      {
        type: 'warn',
        text: 'If an exam snippet stores AWS keys in code or in a Lambda env var, prefer the IAM-role answer. Env vars are fine for non-secret config; use Secrets Manager/Parameter Store for secrets.',
      },
    ],
  },
];
