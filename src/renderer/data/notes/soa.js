// SOA-C02 — SysOps Administrator Associate. Original study notes.

export default [
  {
    id: 'soa-monitoring',
    title: 'Monitoring & observability',
    blocks: [
      {
        type: 'p',
        text: 'Operations work lives and dies by observability. AWS separates metrics (CloudWatch), API audit (CloudTrail) and configuration state (Config). Knowing which tool answers which question is heavily tested.',
      },
      {
        type: 'table',
        head: ['Tool', 'Answers', 'Example'],
        rows: [
          ['CloudWatch', 'How is my system performing?', 'CPU %, latency, custom metrics, alarms'],
          ['CloudTrail', 'Who did what, when?', 'An IAM user deleted a bucket at 14:03'],
          ['AWS Config', 'What is the configuration and did it change?', 'Was this SG ever opened to 0.0.0.0/0?'],
        ],
      },
      {
        type: 'diagram',
        code: `graph LR
  Metric[CloudWatch metric] --> Alarm{Threshold breached?}
  Alarm -->|yes| SNS[SNS notification]
  Alarm -->|yes| ASG[Auto Scaling action]`,
      },
      {
        type: 'tip',
        text: 'CloudWatch Logs Insights queries logs; CloudWatch Agent pushes OS-level metrics (memory, disk) that are NOT available by default. "Need memory utilization" \u2192 install the CloudWatch Agent.',
      },
    ],
  },
  {
    id: 'soa-automation',
    title: 'Automation with Systems Manager',
    blocks: [
      {
        type: 'p',
        text: 'AWS Systems Manager (SSM) is the operations Swiss army knife \u2014 manage fleets at scale without SSH/RDP.',
      },
      {
        type: 'list',
        items: [
          'Session Manager \u2014 shell access with no open inbound ports, no bastion, full audit.',
          'Run Command \u2014 execute commands across many instances at once.',
          'Patch Manager \u2014 scan/apply OS patches on a schedule.',
          'Parameter Store \u2014 config and secrets (SecureString with KMS).',
          'State Manager / Automation \u2014 enforce desired state and run runbooks.',
        ],
      },
      {
        type: 'tip',
        text: '"Give admins shell access without opening port 22 or a bastion host" \u2192 Session Manager. It is a very common SOA answer.',
      },
    ],
  },
  {
    id: 'soa-reliability',
    title: 'Backup, recovery & reliability',
    blocks: [
      {
        type: 'list',
        items: [
          'AWS Backup centralizes backup policies across services (EBS, RDS, DynamoDB, EFS, etc.).',
          'RDS: automated backups (point-in-time restore) + manual snapshots (retained until deleted).',
          'Route 53 health checks + failover routing redirect traffic away from unhealthy endpoints.',
          'Auto Scaling with health checks replaces failed instances automatically (self-healing).',
        ],
      },
      {
        type: 'diagram',
        code: `graph TD
  ASG[Auto Scaling Group] --> HC{Instance healthy?}
  HC -->|no| Term[Terminate]
  Term --> Launch[Launch replacement]
  Launch --> ASG`,
      },
      {
        type: 'warn',
        text: 'RDS automated backups are deleted when you delete the DB instance (unless you take a final snapshot). Manual snapshots persist until you remove them.',
      },
    ],
  },
  {
    id: 'soa-networking-ops',
    title: 'Networking & deployment operations',
    blocks: [
      {
        type: 'list',
        items: [
          'VPC Flow Logs capture traffic metadata for troubleshooting connectivity and security.',
          'CloudFormation drift detection shows where live resources diverged from the template.',
          'Use change sets to preview CloudFormation updates before applying.',
          'Trusted Advisor flags cost, security, fault-tolerance and limit issues.',
        ],
      },
      {
        type: 'tip',
        text: 'Troubleshooting "instance cannot reach the internet": check route table (0.0.0.0/0 to IGW or NAT?), security group (outbound), NACL (both directions), and that a public instance has a public IP.',
      },
    ],
  },
];
