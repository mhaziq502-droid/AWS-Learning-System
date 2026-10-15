// SCS-C02 — Security Specialty. Original study notes.

export default [
  {
    id: 'scs-iam-deep',
    title: 'Identity & access management in depth',
    blocks: [
      {
        type: 'p',
        text: 'IAM is the heart of AWS security. A request is allowed only if an explicit allow exists AND no explicit deny applies, after all policy types are evaluated.',
      },
      {
        type: 'diagram',
        code: `graph TD
  Req[API request] --> Deny{Explicit deny\\nanywhere?}
  Deny -->|yes| Blocked[DENIED]
  Deny -->|no| Allow{Explicit allow\\npresent?}
  Allow -->|no| Blocked
  Allow -->|yes| OK[ALLOWED]`,
      },
      {
        type: 'list',
        items: [
          'Policy types: identity-based, resource-based (e.g. bucket policy), permissions boundaries, SCPs, and session policies.',
          'An explicit deny always wins over any allow.',
          'Prefer roles + STS temporary credentials; federate with SAML/OIDC or IAM Identity Center for workforce SSO.',
          'IAM Access Analyzer finds resources shared outside your account/organization.',
        ],
      },
      {
        type: 'tip',
        text: 'Cross-account access pattern: Account A role trusts Account B (trust policy / principal), and B is granted sts:AssumeRole. Resource-based policies (S3, KMS) can also grant cross-account directly.',
      },
    ],
  },
  {
    id: 'scs-data-protection',
    title: 'Data protection & KMS',
    blocks: [
      {
        type: 'p',
        text: 'KMS manages encryption keys and enforces who can use them via key policies (and optionally IAM). Envelope encryption lets you encrypt large data efficiently.',
      },
      {
        type: 'diagram',
        code: `graph LR
  Data[Plaintext data] --> DK[Data key]
  DK -->|encrypts| Cipher[Ciphertext]
  CMK[KMS key] -->|encrypts| DK
  DK2[Encrypted data key] --- Cipher`,
      },
      {
        type: 'list',
        items: [
          'Key policy is the primary access control for a KMS key; without it, IAM alone cannot grant access.',
          'Customer managed keys allow rotation control, policies and auditing; AWS managed keys are simpler but less flexible.',
          'CloudHSM provides dedicated, single-tenant hardware for strict compliance.',
          'Secrets Manager stores + rotates secrets; ACM manages TLS certificates.',
        ],
      },
      {
        type: 'warn',
        text: 'If a principal has an IAM allow for KMS but still gets AccessDenied, check the KMS key policy \u2014 it must also permit that principal.',
      },
    ],
  },
  {
    id: 'scs-detect-respond',
    title: 'Detection & incident response',
    blocks: [
      {
        type: 'table',
        head: ['Service', 'Purpose'],
        rows: [
          ['GuardDuty', 'Threat detection from CloudTrail, VPC Flow, DNS logs'],
          ['Security Hub', 'Aggregate findings + posture against standards'],
          ['Macie', 'Discover/classify sensitive data (PII) in S3'],
          ['Inspector', 'Vulnerability scanning of workloads/images'],
          ['Detective', 'Investigate and visualize the root cause'],
        ],
      },
      {
        type: 'diagram',
        code: `graph LR
  GD[GuardDuty finding] --> EB[EventBridge]
  EB --> Lambda[Lambda response]
  Lambda --> Isolate[Isolate instance / revoke keys]`,
      },
      {
        type: 'tip',
        text: '"Automatically respond to a threat finding" \u2192 GuardDuty + EventBridge + Lambda/SSM. "Find PII in buckets" \u2192 Macie. "Scan EC2/containers for CVEs" \u2192 Inspector.',
      },
    ],
  },
  {
    id: 'scs-infra-logging',
    title: 'Infrastructure security & logging',
    blocks: [
      {
        type: 'list',
        items: [
          'Edge protection: WAF (Layer 7 rules), Shield Standard (always on) / Advanced (DDoS + support), CloudFront.',
          'Network: security groups, NACLs, Network Firewall, and VPC endpoints to avoid public exposure.',
          'Logging: CloudTrail (API audit, enable org-wide + log file validation), VPC Flow Logs, S3 access logs \u2014 centralize to a dedicated, locked-down logging account.',
          'Protect log integrity with S3 Object Lock and restrictive bucket policies.',
        ],
      },
      {
        type: 'note',
        text: 'Security-Specialty answers favor defense in depth and least privilege: multiple layers, centralized tamper-resistant logging, and automated detection + response.',
      },
    ],
  },
];
