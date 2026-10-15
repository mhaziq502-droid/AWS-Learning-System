// CLF-C02 — Cloud Practitioner. Original foundational study notes.

export default [
  {
    id: 'clf-cloud-value',
    title: 'What the cloud is & why it matters',
    blocks: [
      {
        type: 'p',
        text: 'Cloud computing is on-demand delivery of IT resources over the internet with pay-as-you-go pricing. Instead of buying and running your own data centers, you rent compute, storage and services and give them back when you are done.',
      },
      { type: 'h', text: 'The six advantages of cloud' },
      {
        type: 'list',
        items: [
          'Trade capital expense (CapEx) for variable expense (OpEx) \u2014 pay only for what you use.',
          'Benefit from massive economies of scale \u2014 AWS\u2019s aggregate buying power lowers prices.',
          'Stop guessing capacity \u2014 scale up and down with real demand.',
          'Increase speed and agility \u2014 provision resources in minutes, not weeks.',
          'Stop spending money running and maintaining data centers.',
          'Go global in minutes \u2014 deploy close to users around the world.',
        ],
      },
      {
        type: 'diagram',
        code: `graph LR
  OnPrem["On-premises\\nBuy servers upfront (CapEx)\\nGuess capacity\\nSlow to scale"] -->|move to cloud| Cloud["Cloud\\nPay per use (OpEx)\\nElastic\\nGlobal in minutes"]`,
      },
      {
        type: 'tip',
        text: 'Elasticity = scale with demand automatically. Agility = move fast / experiment cheaply. Exam questions use these exact words to point at the right benefit.',
      },
    ],
  },
  {
    id: 'clf-global-infra',
    title: 'AWS global infrastructure',
    blocks: [
      {
        type: 'p',
        text: 'The AWS global infrastructure is built from Regions, Availability Zones and edge locations. Understanding this hierarchy underpins almost every other topic.',
      },
      {
        type: 'diagram',
        code: `graph TD
  Global[AWS Global Infrastructure] --> R[Regions]
  R --> AZ[Availability Zones]
  AZ --> DC[Data centers]
  Global --> Edge[Edge locations / PoPs]`,
      },
      {
        type: 'list',
        items: [
          'Region \u2014 a geographic area (e.g. us-east-1) chosen for latency, compliance, service availability and price.',
          'Availability Zone \u2014 one or more isolated data centers within a Region; design across \u22652 AZs for high availability.',
          'Edge location \u2014 a global cache point used by CloudFront and others to serve users with low latency.',
        ],
      },
      {
        type: 'note',
        text: 'Some data-residency rules require data to stay in a specific country \u2014 that is a Region-selection decision.',
      },
    ],
  },
  {
    id: 'clf-core-services',
    title: 'Core service categories',
    blocks: [
      {
        type: 'p',
        text: 'You do not need deep expertise in every service for CLF \u2014 you need to recognize what each major service does and which category it belongs to.',
      },
      {
        type: 'table',
        head: ['Category', 'Key services', 'What they do'],
        rows: [
          ['Compute', 'EC2, Lambda, Elastic Beanstalk, ECS/EKS', 'Run applications and code'],
          ['Storage', 'S3, EBS, EFS, Glacier', 'Store objects, blocks, files, archives'],
          ['Database', 'RDS, DynamoDB, Aurora, Redshift', 'Managed relational, NoSQL, analytics'],
          ['Networking', 'VPC, Route 53, CloudFront, API Gateway', 'Connect, route and deliver traffic'],
          ['Security', 'IAM, KMS, Shield, WAF', 'Control access and protect resources'],
          ['Management', 'CloudWatch, CloudTrail, CloudFormation', 'Monitor, audit and automate'],
        ],
      },
    ],
  },
  {
    id: 'clf-shared-responsibility',
    title: 'The Shared Responsibility Model',
    blocks: [
      {
        type: 'p',
        text: 'Security is a partnership. AWS is responsible for security OF the cloud; the customer is responsible for security IN the cloud. The line moves depending on how managed a service is.',
      },
      {
        type: 'diagram',
        code: `graph TD
  subgraph Customer["Customer: security IN the cloud"]
    C1[Your data]
    C2[IAM / access management]
    C3[OS, network & firewall config]
    C4[Client & server-side encryption]
  end
  subgraph AWS["AWS: security OF the cloud"]
    A1[Hardware & global infrastructure]
    A2[Regions, AZs, edge]
    A3[Managed service internals]
  end`,
      },
      {
        type: 'tip',
        text: 'For EC2 you patch the guest OS (customer). For a managed service like RDS, AWS patches the DB engine OS, but you still manage data, access and encryption settings.',
      },
    ],
  },
  {
    id: 'clf-pricing-support',
    title: 'Pricing, billing & support',
    blocks: [
      {
        type: 'p',
        text: 'AWS pricing has three fundamentals: pay-as-you-go, pay less when you reserve, and pay less the more you use (volume discounts). A set of tools helps you estimate and control spend.',
      },
      {
        type: 'list',
        items: [
          'Pricing Calculator \u2014 estimate costs before you build.',
          'Cost Explorer \u2014 visualize and analyze actual spend over time.',
          'Budgets \u2014 set thresholds and get alerted before you overspend.',
          'Cost Allocation Tags \u2014 attribute spend to teams/projects.',
          'Consolidated Billing (Organizations) \u2014 one bill plus combined volume discounts across accounts.',
        ],
      },
      { type: 'h', text: 'Support plans' },
      {
        type: 'table',
        head: ['Plan', 'Who it is for'],
        rows: [
          ['Basic', 'Everyone \u2014 docs, forums, limited Trusted Advisor'],
          ['Developer', 'Experimenting / dev workloads'],
          ['Business', 'Production workloads \u2014 24/7 support, full Trusted Advisor'],
          ['Enterprise On-Ramp / Enterprise', 'Business/mission-critical \u2014 TAM, fastest response'],
        ],
      },
      {
        type: 'tip',
        text: 'Only Business and above get the FULL set of Trusted Advisor checks and 24/7 phone/chat/email access to engineers. A dedicated Technical Account Manager (TAM) comes with Enterprise.',
      },
    ],
  },
];
