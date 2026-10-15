// ANS-C01 — Advanced Networking Specialty. Original study notes.

export default [
  {
    id: 'ans-vpc-design',
    title: 'VPC design & IP addressing',
    blocks: [
      {
        type: 'p',
        text: 'Specialty networking goes deep on VPC internals: CIDR planning, subnet routing, and how traffic actually flows. Plan non-overlapping CIDR blocks up front \u2014 overlaps break peering and hybrid routing.',
      },
      {
        type: 'diagram',
        code: `graph TD
  VPC["VPC 10.0.0.0/16"] --> Pub["Public subnet\\n10.0.0.0/24\\nroute 0.0.0.0/0 -> IGW"]
  VPC --> Priv["Private subnet\\n10.0.1.0/24\\nroute 0.0.0.0/0 -> NAT"]
  VPC --> Iso["Isolated subnet\\n10.0.2.0/24\\nno internet route"]`,
      },
      {
        type: 'list',
        items: [
          'Route tables decide where traffic goes; the most specific (longest-prefix) match wins.',
          'A public subnet = route to an Internet Gateway + instances have public IPs.',
          'IPv6 is globally routable; use an egress-only internet gateway for outbound-only IPv6.',
          'Reserve CIDR space for growth and for secondary CIDR blocks.',
        ],
      },
    ],
  },
  {
    id: 'ans-endpoints',
    title: 'VPC endpoints & PrivateLink',
    blocks: [
      {
        type: 'table',
        head: ['Type', 'Backed by', 'Reaches'],
        rows: [
          ['Gateway endpoint', 'Route table entry', 'S3 and DynamoDB only (free)'],
          ['Interface endpoint', 'ENI + PrivateLink', 'Most AWS services & your own services'],
        ],
      },
      {
        type: 'diagram',
        code: `graph LR
  App[Private instance] --> IE[Interface endpoint\\n(ENI in subnet)]
  IE -->|PrivateLink| Svc[AWS or partner service]
  App --> GE[Gateway endpoint] --> S3[(S3)]`,
      },
      {
        type: 'tip',
        text: '"Reach S3 privately without a NAT Gateway" \u2192 Gateway endpoint. "Expose my own service to another VPC/account privately" \u2192 PrivateLink + interface endpoint.',
      },
    ],
  },
  {
    id: 'ans-hybrid',
    title: 'Hybrid connectivity & routing',
    blocks: [
      {
        type: 'list',
        items: [
          'Direct Connect: dedicated private link. Private VIF reaches VPCs; public VIF reaches AWS public services; transit VIF reaches a Transit Gateway.',
          'Use a Direct Connect Gateway to connect one DX to VPCs across multiple Regions.',
          'Site-to-Site VPN runs over the internet (IPsec); often used as DX backup. BGP exchanges routes dynamically.',
          'Transit Gateway interconnects VPCs, VPNs and DX at scale; route tables on the TGW segment traffic.',
        ],
      },
      {
        type: 'diagram',
        code: `graph TD
  DC[On-prem] -->|Direct Connect primary| TGW[Transit Gateway]
  DC -->|VPN backup| TGW
  TGW --- VPCa[VPC a]
  TGW --- VPCb[VPC b]`,
      },
      {
        type: 'warn',
        text: 'For resilience, do not rely on a single DX connection. Pair DX with a VPN backup, or use two DX connections at separate locations.',
      },
    ],
  },
  {
    id: 'ans-dns-edge-sec',
    title: 'DNS, edge & network security',
    blocks: [
      {
        type: 'list',
        items: [
          'Route 53 routing policies: simple, weighted, latency, failover, geolocation, geoproximity, multivalue. Health checks drive failover.',
          'Route 53 Resolver (inbound/outbound endpoints) resolves DNS between on-prem and VPC.',
          'CloudFront + Global Accelerator optimize edge delivery; GA uses anycast static IPs for TCP/UDP.',
          'Network security layers: security groups, NACLs, AWS Network Firewall (stateful, VPC-level), and WAF (Layer 7).',
        ],
      },
      {
        type: 'tip',
        text: '"Static anycast IPs + fast failover for a non-HTTP TCP app" \u2192 Global Accelerator. "Cache and secure a website at the edge" \u2192 CloudFront + WAF.',
      },
    ],
  },
];
