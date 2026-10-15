// SAP-C02 — Solutions Architect Professional. Original study notes.

export default [
  {
    id: 'sap-organizations',
    title: 'Multi-account strategy with Organizations',
    blocks: [
      {
        type: 'p',
        text: 'At professional scale you design across many accounts, not one. AWS Organizations groups accounts into Organizational Units (OUs) and applies Service Control Policies (SCPs) as guardrails.',
      },
      {
        type: 'diagram',
        code: `graph TD
  Root[Organization Root] --> OU1[OU: Production]
  Root --> OU2[OU: Sandbox]
  OU1 --> A1[Account: app-prod]
  OU1 --> A2[Account: data-prod]
  OU2 --> A3[Account: dev]
  SCP[SCP guardrail] -.applies to.-> OU1`,
      },
      {
        type: 'list',
        items: [
          'SCPs set the MAXIMUM permissions an account can have \u2014 they do not grant permissions, only restrict.',
          'Control Tower automates a secure, multi-account landing zone with best-practice guardrails and Account Factory.',
          'Consolidated billing aggregates spend and shares volume discounts / Savings Plans across accounts.',
          'Centralize logging (CloudTrail org trail) and identity (IAM Identity Center / SSO).',
        ],
      },
      {
        type: 'warn',
        text: 'Even an account admin cannot exceed an SCP. If a user "has an allow policy but still gets denied," suspect an SCP (or a permissions boundary) at a higher level.',
      },
    ],
  },
  {
    id: 'sap-migration',
    title: 'Migration strategies & tooling',
    blocks: [
      {
        type: 'p',
        text: 'Large migrations are classified with the "7 Rs." Each application gets a disposition based on cost, risk and benefit.',
      },
      {
        type: 'table',
        head: ['Strategy', 'Meaning'],
        rows: [
          ['Retire', 'Decommission \u2014 no longer needed'],
          ['Retain', 'Keep on-prem for now'],
          ['Relocate', 'Move hypervisor (e.g. VMware Cloud on AWS)'],
          ['Rehost', 'Lift-and-shift, no code change'],
          ['Replatform', 'Minor optimizations (e.g. managed DB)'],
          ['Repurchase', 'Switch to a SaaS product'],
          ['Refactor', 'Re-architect, often cloud-native'],
        ],
      },
      {
        type: 'list',
        items: [
          'Application Migration Service (MGN) \u2014 automated lift-and-shift (rehost).',
          'Database Migration Service (DMS) \u2014 migrate/replicate databases, optionally with Schema Conversion Tool.',
          'DataSync \u2014 move large file datasets to AWS; Snow Family \u2014 ship petabytes physically when the network is impractical.',
        ],
      },
      {
        type: 'tip',
        text: '"Minimal downtime, keep the source running until cutover" \u2192 continuous replication (MGN/DMS). "Transfer 100 TB with poor bandwidth" \u2192 Snow Family.',
      },
    ],
  },
  {
    id: 'sap-hybrid',
    title: 'Hybrid & multi-VPC connectivity',
    blocks: [
      {
        type: 'diagram',
        code: `graph TD
  OnPrem[On-premises DC] -->|Direct Connect| TGW[Transit Gateway]
  OnPrem -->|VPN backup| TGW
  TGW --- VPC1[VPC A]
  TGW --- VPC2[VPC B]
  TGW --- VPC3[VPC C]`,
      },
      {
        type: 'list',
        items: [
          'Transit Gateway is the hub for connecting many VPCs and on-prem \u2014 avoids a messy VPC-peering mesh.',
          'Direct Connect = dedicated, consistent-bandwidth private link; add a VPN as an encrypted backup path.',
          'Use Direct Connect Gateway to reach VPCs in multiple Regions from one DX connection.',
          'PrivateLink exposes a service privately across accounts/VPCs without exposing the whole network.',
        ],
      },
      {
        type: 'tip',
        text: '"Hundreds of VPCs plus on-prem, centrally managed" \u2192 Transit Gateway. "Dedicated low-jitter bandwidth to AWS" \u2192 Direct Connect (with VPN failover for resilience).',
      },
    ],
  },
  {
    id: 'sap-advanced-dr',
    title: 'Advanced resilience, cost & governance',
    blocks: [
      {
        type: 'list',
        items: [
          'Multi-Region active/active with Route 53 (latency/geoproximity routing) and global data stores (DynamoDB Global Tables, Aurora Global Database).',
          'Cost governance at scale: Savings Plans across accounts, Budgets with actions, Cost Categories, and anomaly detection.',
          'Automated governance: Config rules + conformance packs, Security Hub, and remediation via EventBridge + SSM Automation.',
          'Decouple and scale with EventBridge, SQS/SNS, Kinesis and Step Functions for complex workflows.',
        ],
      },
      {
        type: 'note',
        text: 'Professional scenarios are rarely about a single service \u2014 they combine networking, security, cost and DR. Read for the binding constraint (lowest cost? strictest RTO? least operational overhead?) and optimize for that.',
      },
    ],
  },
];
