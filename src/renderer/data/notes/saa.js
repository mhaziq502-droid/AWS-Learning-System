// SAA-C03 — Solutions Architect Associate. Detailed, original study notes with
// diagrams, tables and exam tips. All content written for this project.

export default [
  {
    id: 'saa-well-architected',
    title: 'The Well-Architected Framework',
    blocks: [
      {
        type: 'p',
        text: 'The Well-Architected Framework is AWS\u2019s set of best practices for building secure, high-performing, resilient and efficient systems. As a Solutions Architect you continually balance its pillars against business priorities \u2014 there is rarely a single "correct" design, only the best trade-off for the requirements in front of you.',
      },
      { type: 'h', text: 'The six pillars' },
      {
        type: 'table',
        head: ['Pillar', 'Core question it answers', 'Example levers'],
        rows: [
          ['Operational Excellence', 'How do we run and monitor systems and improve over time?', 'IaC, runbooks, observability, small reversible changes'],
          ['Security', 'How do we protect data, systems and assets?', 'IAM least privilege, encryption, detective controls'],
          ['Reliability', 'How do we recover from failure and meet demand?', 'Multi-AZ, auto scaling, backups, health checks'],
          ['Performance Efficiency', 'How do we use resources efficiently as demand changes?', 'Right instance type, caching, serverless'],
          ['Cost Optimization', 'How do we avoid unnecessary spend?', 'Right-sizing, Spot, Savings Plans, lifecycle policies'],
          ['Sustainability', 'How do we minimize environmental impact?', 'Efficient regions, managed services, right-sizing'],
        ],
      },
      {
        type: 'tip',
        text: 'In scenario questions, map the "magic word" to a pillar: "most cost-effective" \u2192 Cost Optimization; "most resilient / survive an AZ failure" \u2192 Reliability; "least operational overhead" \u2192 favor managed/serverless services.',
      },
      {
        type: 'note',
        text: 'A Well-Architected Review is a structured conversation using these pillars to surface risks before they become incidents. The free AWS Well-Architected Tool automates part of this.',
      },
    ],
  },

  {
    id: 'saa-regions-az',
    title: 'Global infrastructure & high availability',
    blocks: [
      {
        type: 'p',
        text: 'AWS is organized into Regions (independent geographic areas), each containing multiple Availability Zones (AZs). An AZ is one or more physically separate data centers with independent power, cooling and networking, linked to other AZs in the Region by high-bandwidth, low-latency fiber. Edge locations (used by CloudFront and Global Accelerator) sit closer to users for caching and acceleration.',
      },
      {
        type: 'diagram',
        code: `graph TD
  subgraph Region["Region (e.g. eu-west-1)"]
    AZa["AZ-a\\n(data centers)"]
    AZb["AZ-b\\n(data centers)"]
    AZc["AZ-c\\n(data centers)"]
  end
  AZa <-->|low-latency links| AZb
  AZb <-->|low-latency links| AZc
  AZa <-->|low-latency links| AZc
  Users((Users)) --> Edge["Edge location\\n(CloudFront)"]
  Edge --> Region`,
      },
      { type: 'h', text: 'The core HA principle' },
      {
        type: 'list',
        items: [
          'Spread stateless compute across at least two AZs so losing one AZ does not take the application down.',
          'Put a load balancer in front and Auto Scaling behind it, so capacity self-heals and scales.',
          'Use Multi-AZ managed data stores (RDS Multi-AZ, DynamoDB) so the data tier survives an AZ outage.',
          'For disaster recovery that survives a whole-Region event, extend to a second Region.',
        ],
      },
      {
        type: 'warn',
        text: 'High Availability (surviving an AZ failure, usually automatic) is NOT the same as Disaster Recovery (surviving a Region failure, often with a defined RTO/RPO). Exam scenarios test that you pick the right scope.',
      },
    ],
  },

  {
    id: 'saa-compute',
    title: 'Choosing the right compute',
    blocks: [
      {
        type: 'p',
        text: 'Compute selection is one of the most common SAA decision points. The spectrum runs from most control/most management (EC2) to least management/most elasticity (Lambda).',
      },
      {
        type: 'table',
        head: ['Service', 'Best for', 'You manage', 'Scaling model'],
        rows: [
          ['EC2', 'Full OS control, legacy or specialized workloads, licensing', 'OS, patching, scaling config', 'Auto Scaling groups'],
          ['ECS / EKS', 'Containerized microservices', 'Container images, task sizing', 'Service auto scaling'],
          ['Fargate', 'Containers without managing servers', 'Container images only', 'Per-task, serverless'],
          ['Lambda', 'Event-driven, spiky, short tasks (\u226415 min)', 'Just the code', 'Automatic, to zero'],
        ],
      },
      { type: 'h', text: 'EC2 purchasing options (cost lever)' },
      {
        type: 'list',
        items: [
          'On-Demand \u2014 pay per second, no commitment. Use for short-term or unpredictable workloads.',
          'Reserved Instances / Savings Plans \u2014 commit to 1 or 3 years for up to ~72% discount. Use for steady-state baseline.',
          'Spot Instances \u2014 up to ~90% off spare capacity, but can be reclaimed with a 2-minute warning. Use for fault-tolerant, interruptible work (batch, CI, big data).',
          'Dedicated Hosts / Instances \u2014 physical isolation for compliance or BYO-license.',
        ],
      },
      {
        type: 'tip',
        text: 'A classic exam pattern: "fault-tolerant batch job, lowest cost" \u2192 Spot. "Steady 24/7 baseline" \u2192 Savings Plans / RI. "Unpredictable, short-lived" \u2192 On-Demand or Lambda.',
      },
    ],
  },

  {
    id: 'saa-storage',
    title: 'Storage: S3, EBS, EFS and selection',
    blocks: [
      {
        type: 'p',
        text: 'AWS storage falls into three families: object (S3), block (EBS, attached to a single EC2 instance) and file (EFS for Linux/NFS, FSx for Windows/Lustre). Picking the wrong family is a common trap.',
      },
      {
        type: 'diagram',
        code: `graph LR
  App[Application need] --> Q1{Shared across\\nmany instances?}
  Q1 -->|No, single EC2 disk| EBS[(EBS block volume)]
  Q1 -->|Yes, POSIX file share| EFS[(EFS file system)]
  Q1 -->|Yes, objects over HTTP| S3[(S3 object storage)]`,
      },
      { type: 'h', text: 'S3 storage classes' },
      {
        type: 'table',
        head: ['Class', 'Use case', 'Retrieval'],
        rows: [
          ['S3 Standard', 'Frequently accessed data', 'Instant'],
          ['S3 Intelligent-Tiering', 'Unknown / changing access patterns', 'Instant (auto-tiers)'],
          ['S3 Standard-IA', 'Infrequent but needs fast access', 'Instant (retrieval fee)'],
          ['S3 One Zone-IA', 'Infrequent, re-creatable (single AZ)', 'Instant'],
          ['S3 Glacier Instant', 'Archive needing millisecond access', 'Instant'],
          ['S3 Glacier Flexible', 'Archive, minutes to hours OK', 'Minutes\u2013hours'],
          ['S3 Glacier Deep Archive', 'Long-term cold archive, cheapest', 'Hours'],
        ],
      },
      {
        type: 'list',
        items: [
          'Lifecycle policies automatically transition objects between classes (e.g. Standard \u2192 IA after 30 days \u2192 Glacier after 90).',
          'Versioning protects against accidental overwrite/delete; combine with MFA Delete for extra safety.',
          'S3 is strongly read-after-write consistent for all operations.',
          'Encrypt with SSE-S3, SSE-KMS or SSE-C; block public access at the account level by default.',
        ],
      },
      {
        type: 'tip',
        text: 'EBS volume types: gp3 (general SSD, baseline for most workloads), io2 Block Express (high IOPS databases), st1 (throughput HDD for big sequential reads), sc1 (cold HDD, cheapest). "Highest IOPS for a database" \u2192 io2.',
      },
      {
        type: 'warn',
        text: 'An EBS volume lives in ONE AZ and attaches to ONE instance (except io1/io2 Multi-Attach). To share files across instances/AZs you need EFS, not EBS.',
      },
    ],
  },

  {
    id: 'saa-databases',
    title: 'Databases: RDS, Aurora, DynamoDB & caching',
    blocks: [
      {
        type: 'p',
        text: 'Match the data model to the service: relational (RDS/Aurora), key-value/document at scale (DynamoDB), in-memory cache (ElastiCache), data warehouse/analytics (Redshift), graph (Neptune).',
      },
      {
        type: 'table',
        head: ['Service', 'Model', 'Scaling', 'When to pick'],
        rows: [
          ['RDS', 'Relational (MySQL, PostgreSQL, etc.)', 'Vertical + read replicas', 'Standard relational workloads'],
          ['Aurora', 'Relational, AWS-built', 'Auto-scaling storage, up to 15 replicas', 'High performance/availability relational'],
          ['DynamoDB', 'Key-value / document (NoSQL)', 'Virtually unlimited, serverless', 'Massive scale, single-digit-ms latency'],
          ['ElastiCache', 'In-memory (Redis/Memcached)', 'Cluster nodes', 'Caching, sessions, leaderboards'],
          ['Redshift', 'Columnar warehouse', 'Nodes / Serverless', 'Analytics over large datasets'],
        ],
      },
      { type: 'h', text: 'RDS high availability vs read scaling' },
      {
        type: 'list',
        items: [
          'Multi-AZ = a synchronous standby in another AZ for FAILOVER (availability). The standby does not serve reads.',
          'Read Replicas = asynchronous copies for READ SCALING (performance). Can be promoted but are not automatic failover.',
          'They solve different problems and are often combined.',
        ],
      },
      {
        type: 'diagram',
        code: `graph TD
  W[App writes] --> P[(RDS Primary\\nAZ-a)]
  P -. sync replication .-> S[(Standby\\nAZ-b)]
  P -. async .-> R1[(Read Replica)]
  Reads[App reads] --> R1
  S -->|automatic failover| P`,
      },
      {
        type: 'tip',
        text: 'DynamoDB extras: DAX = microsecond read cache; Global Tables = multi-Region active-active; Streams = change events (great for event-driven designs). "Sub-millisecond at any scale" almost always points to DynamoDB.',
      },
    ],
  },

  {
    id: 'saa-networking',
    title: 'VPC networking fundamentals',
    blocks: [
      {
        type: 'p',
        text: 'A VPC is your private, logically isolated network in AWS. You carve it into subnets across AZs. "Public" subnets route to an Internet Gateway; "private" subnets reach the internet only outbound via a NAT Gateway.',
      },
      {
        type: 'diagram',
        code: `graph TD
  IGW["Internet Gateway"] --- VPC
  subgraph VPC["VPC 10.0.0.0/16"]
    direction TB
    subgraph AZa["AZ-a"]
      PubA["Public subnet\\n10.0.1.0/24\\n(ALB, NAT GW)"]
      PrivA["Private subnet\\n10.0.2.0/24\\n(App servers)"]
      DataA["Private subnet\\n10.0.3.0/24\\n(RDS)"]
    end
  end
  Users((Users)) --> IGW --> PubA --> PrivA --> DataA
  PrivA -->|outbound updates| NAT["NAT Gateway\\n(in public subnet)"] --> IGW`,
      },
      { type: 'h', text: 'Security groups vs network ACLs' },
      {
        type: 'table',
        head: ['', 'Security Group', 'Network ACL'],
        rows: [
          ['Scope', 'Instance / ENI level', 'Subnet level'],
          ['State', 'Stateful (return traffic auto-allowed)', 'Stateless (must allow both directions)'],
          ['Rules', 'Allow only', 'Allow and deny'],
          ['Evaluation', 'All rules evaluated', 'Rules in numbered order'],
        ],
      },
      {
        type: 'list',
        items: [
          'VPC Endpoints let resources reach AWS services privately without the public internet: Gateway endpoints (S3, DynamoDB) and Interface endpoints / PrivateLink (most other services).',
          'VPC Peering connects two VPCs (non-transitive). For many VPCs + on-prem, use a Transit Gateway hub.',
          'A NAT Gateway is managed and highly available within an AZ; deploy one per AZ for resilience.',
        ],
      },
      {
        type: 'warn',
        text: 'NAT Gateways allow OUTBOUND-initiated internet access for private subnets but block unsolicited inbound \u2014 do not confuse them with an Internet Gateway, which enables bidirectional public connectivity.',
      },
    ],
  },

  {
    id: 'saa-decoupling',
    title: 'Decoupling: ELB, SQS, SNS & EventBridge',
    blocks: [
      {
        type: 'p',
        text: 'Loosely coupled components fail independently and scale independently. The exam heavily rewards decoupled, event-driven designs over tightly-coupled synchronous ones.',
      },
      {
        type: 'table',
        head: ['Service', 'Pattern', 'Use when'],
        rows: [
          ['SQS', 'Queue (one consumer group pulls)', 'Buffer/level load, decouple producer from consumer'],
          ['SNS', 'Pub/Sub fan-out (push to many)', 'Notify many subscribers of one event'],
          ['EventBridge', 'Event bus with routing rules', 'Route events between services/SaaS by content'],
          ['Kinesis', 'Ordered streaming records', 'Real-time analytics, high-throughput streams'],
        ],
      },
      {
        type: 'diagram',
        code: `graph LR
  Prod[Producer] --> SQS[[SQS Queue]]
  SQS --> C1[Worker 1]
  SQS --> C2[Worker 2]
  Event[Order placed] --> SNS((SNS Topic))
  SNS --> Email[Email]
  SNS --> Lambda[Lambda]
  SNS --> Q2[[SQS]]`,
      },
      {
        type: 'list',
        items: [
          'SQS Standard = at-least-once, best-effort order, massive throughput. SQS FIFO = exactly-once, strict order, limited throughput.',
          'The "SNS + SQS fan-out" pattern pushes one event to many durable queues so each consumer processes at its own pace.',
          'A classic fix for a load spike crashing a backend: put an SQS queue between the front end and workers to buffer.',
        ],
      },
      {
        type: 'tip',
        text: 'Load balancers: ALB (Layer 7, HTTP/HTTPS, path/host routing), NLB (Layer 4, TCP/UDP, ultra-low latency, static IP), GWLB (deploy virtual appliances). "Route by URL path" \u2192 ALB; "millions of requests, static IP, extreme performance" \u2192 NLB.',
      },
    ],
  },

  {
    id: 'saa-security',
    title: 'Security & identity',
    blocks: [
      {
        type: 'p',
        text: 'Security on AWS starts with IAM and the principle of least privilege, layered with encryption, network isolation and detective controls. Remember the Shared Responsibility Model: AWS secures the cloud; you secure what you put IN it.',
      },
      {
        type: 'list',
        items: [
          'Prefer IAM roles (temporary credentials via STS) over long-lived access keys \u2014 especially for EC2, Lambda and cross-account access.',
          'Encrypt at rest with KMS (envelope encryption) and in transit with TLS. S3, EBS, RDS and more support one-click encryption.',
          'Secrets Manager stores and rotates secrets (DB passwords, API keys); Parameter Store is a cheaper option for config/less-sensitive values.',
          'Protect the edge: WAF (filter malicious HTTP), Shield (DDoS), CloudFront (serve over HTTPS, hide origin).',
        ],
      },
      {
        type: 'diagram',
        code: `graph TD
  EC2[EC2 Instance] -->|assumes| Role[IAM Role]
  Role -->|temporary creds| STS[AWS STS]
  Role -->|least-privilege policy| S3[(S3 Bucket)]
  KMS[KMS Key] -->|encrypts| S3`,
      },
      {
        type: 'warn',
        text: 'Never hard-code access keys in code or AMIs. If a question shows credentials embedded in an app, the correct answer is almost always "use an IAM role" instead.',
      },
    ],
  },

  {
    id: 'saa-resilience-dr',
    title: 'Resilience & disaster recovery',
    blocks: [
      {
        type: 'p',
        text: 'DR strategy is chosen by two numbers: RTO (how fast you must recover) and RPO (how much data you can afford to lose). Lower RTO/RPO costs more. The four standard strategies trade cost against recovery speed.',
      },
      {
        type: 'table',
        head: ['Strategy', 'RTO/RPO', 'Cost', 'How it works'],
        rows: [
          ['Backup & Restore', 'Hours', '$', 'Restore from backups into a new environment'],
          ['Pilot Light', 'Tens of minutes', '$$', 'Core (e.g. DB) always running; scale up the rest on failover'],
          ['Warm Standby', 'Minutes', '$$$', 'Scaled-down full copy always running; scale up on failover'],
          ['Multi-Site Active/Active', 'Near zero', '$$$$', 'Full production in multiple Regions serving traffic'],
        ],
      },
      {
        type: 'diagram',
        code: `graph LR
  A[Backup & Restore\\nslow / cheap] --> B[Pilot Light]
  B --> C[Warm Standby]
  C --> D[Active/Active\\nfast / costly]`,
      },
      {
        type: 'tip',
        text: 'Map requirements to strategy: "cheapest, hours of downtime acceptable" \u2192 Backup & Restore. "Near-zero downtime, cost no object" \u2192 Active/Active. Route 53 health checks + failover routing is the usual way to redirect traffic between Regions.',
      },
    ],
  },

  {
    id: 'saa-cost-edge',
    title: 'Cost optimization & edge delivery',
    blocks: [
      {
        type: 'p',
        text: 'Cost optimization is a first-class pillar. The architect\u2019s job is to deliver the requirement at the lowest sustainable cost, not just to make it work.',
      },
      {
        type: 'list',
        items: [
          'Right-size and use Auto Scaling so you never pay for idle capacity.',
          'Pick the right pricing model: Spot for interruptible, Savings Plans/RIs for steady baseline, On-Demand for spiky.',
          'Use S3 lifecycle policies and the right storage class to shrink storage bills.',
          'Cache aggressively: CloudFront at the edge and ElastiCache/DAX in the data tier reduce both compute and data-transfer cost.',
          'Monitor with Cost Explorer, set Budgets with alerts, and act on Trusted Advisor + Compute Optimizer recommendations.',
        ],
      },
      {
        type: 'h',
        text: 'Edge delivery with CloudFront',
      },
      {
        type: 'diagram',
        code: `graph LR
  U((User)) --> CF[CloudFront edge cache]
  CF -->|cache hit| U
  CF -->|cache miss| Origin[(S3 / ALB origin)]
  Origin --> CF`,
      },
      {
        type: 'note',
        text: 'CloudFront caches content at edge locations near users, cutting latency and offloading the origin. Pair it with S3 for static sites and with WAF/Shield for protection. Global Accelerator (anycast static IPs) accelerates non-cacheable TCP/UDP traffic.',
      },
    ],
  },
];
