// DOP-C02 — DevOps Engineer Professional. Original study notes.

export default [
  {
    id: 'dop-iac',
    title: 'Infrastructure as Code',
    blocks: [
      {
        type: 'p',
        text: 'IaC makes infrastructure versioned, repeatable and reviewable. CloudFormation is the declarative core; the CDK lets you define it in real programming languages that synthesize to CloudFormation.',
      },
      {
        type: 'list',
        items: [
          'Change sets preview what an update will create/modify/delete before you apply it.',
          'Nested stacks and modules keep large templates maintainable.',
          'Drift detection reports where live resources diverged from the template.',
          'StackSets deploy the same stack across many accounts/Regions.',
        ],
      },
      {
        type: 'tip',
        text: 'Use DeletionPolicy: Retain on stateful resources (databases, buckets) so a stack deletion does not destroy data.',
      },
    ],
  },
  {
    id: 'dop-pipelines',
    title: 'CI/CD pipelines & deployment strategies',
    blocks: [
      {
        type: 'diagram',
        code: `graph LR
  Src[Source] --> Build[Build + unit tests]
  Build --> Stage[Deploy to staging]
  Stage --> Approve{Manual approval}
  Approve -->|yes| Prod[Deploy to prod\\nblue/green or canary]`,
      },
      {
        type: 'table',
        head: ['Strategy', 'Risk control', 'Rollback'],
        rows: [
          ['In-place / rolling', 'Update in batches', 'Redeploy previous version'],
          ['Blue/green', 'New env in parallel, switch traffic', 'Instant \u2014 switch back'],
          ['Canary', 'Small % first, then ramp', 'Shift traffic back'],
        ],
      },
      {
        type: 'tip',
        text: 'CodeDeploy supports blue/green for EC2/ECS/Lambda; combine with CloudWatch alarms to auto-rollback on error spikes.',
      },
    ],
  },
  {
    id: 'dop-observability',
    title: 'Monitoring, logging & auto-remediation',
    blocks: [
      {
        type: 'diagram',
        code: `graph LR
  Event[Config/CloudWatch event] --> EB[EventBridge rule]
  EB --> Lambda[Lambda / SSM Automation]
  Lambda --> Fix[Auto-remediate]`,
      },
      {
        type: 'list',
        items: [
          'Centralize logs with CloudWatch Logs; aggregate across accounts to a logging account.',
          'EventBridge rules trigger automated remediation (Lambda or SSM Automation) when something drifts.',
          'Config rules continuously check compliance; conformance packs bundle rules.',
          'Use CloudWatch Synthetics canaries to catch user-facing outages proactively.',
        ],
      },
      {
        type: 'warn',
        text: 'Design remediation to be idempotent and guarded \u2014 an auto-remediation loop that keeps firing can cause its own incident.',
      },
    ],
  },
  {
    id: 'dop-ha-recovery',
    title: 'High availability & self-healing',
    blocks: [
      {
        type: 'list',
        items: [
          'Multi-AZ by default; Auto Scaling with health checks for self-healing fleets.',
          'Immutable deployments (replace, do not patch in place) reduce config drift.',
          'Automate backups and test restores; treat recovery as a practiced procedure, not a hope.',
          'Use feature flags and gradual rollouts to limit blast radius.',
        ],
      },
      {
        type: 'note',
        text: 'DevOps-Pro questions reward automation and safety: prefer solutions that detect, alarm, and remediate without human toil, while keeping safe rollback paths.',
      },
    ],
  },
];
