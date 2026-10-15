// MLA-C01 — Machine Learning Engineer Associate. Original study notes.

export default [
  {
    id: 'mls-data-eng',
    title: 'Data engineering for ML',
    blocks: [
      {
        type: 'p',
        text: 'Good models start with good data pipelines. The ML lifecycle flows from data ingestion and preparation, through training and evaluation, to deployment and monitoring.',
      },
      {
        type: 'diagram',
        code: `graph LR
  Ingest[Ingest\\nKinesis / S3] --> Prep[Prepare\\nGlue / Data Wrangler]
  Prep --> Train[Train\\nSageMaker]
  Train --> Eval[Evaluate\\nClarify]
  Eval --> Deploy[Deploy\\nEndpoint]
  Deploy --> Monitor[Monitor\\nModel Monitor]
  Monitor --> Prep`,
      },
      {
        type: 'list',
        items: [
          'S3 is the central data lake for ML; Glue catalogs and transforms data (serverless ETL).',
          'Athena queries S3 data with SQL; EMR runs big-data frameworks (Spark) at scale.',
          'SageMaker Data Wrangler and Feature Store speed up feature engineering and reuse.',
          'SageMaker Ground Truth labels data (human + automated).',
        ],
      },
    ],
  },
  {
    id: 'mls-modeling',
    title: 'Model training & evaluation',
    blocks: [
      {
        type: 'list',
        items: [
          'SageMaker training jobs run built-in algorithms, your own containers, or popular frameworks.',
          'Hyperparameter tuning (Automatic Model Tuning) searches for the best settings.',
          'Use Spot training and distributed training to cut cost and time.',
          'Evaluate with the right metric: accuracy can mislead on imbalanced data \u2014 consider precision, recall, F1, AUC.',
          'SageMaker Clarify detects bias and explains feature importance.',
        ],
      },
      {
        type: 'table',
        head: ['Problem', 'Watch metric'],
        rows: [
          ['Imbalanced classification', 'Precision / Recall / F1 (not just accuracy)'],
          ['Ranking / threshold choice', 'AUC-ROC'],
          ['Regression', 'RMSE / MAE'],
        ],
      },
      {
        type: 'warn',
        text: 'Overfitting = great on training data, poor on new data. Mitigate with more data, regularization, simpler models, and proper train/validation/test splits.',
      },
    ],
  },
  {
    id: 'mls-deploy',
    title: 'Deployment & inference options',
    blocks: [
      {
        type: 'table',
        head: ['Option', 'Best for'],
        rows: [
          ['Real-time endpoint', 'Low-latency, steady traffic'],
          ['Serverless inference', 'Intermittent/spiky traffic, scale to zero'],
          ['Asynchronous inference', 'Large payloads / long processing'],
          ['Batch transform', 'Score a whole dataset offline'],
        ],
      },
      {
        type: 'tip',
        text: '"Unpredictable, bursty traffic, avoid paying for idle" \u2192 Serverless inference. "Score millions of records nightly" \u2192 Batch transform.',
      },
    ],
  },
  {
    id: 'mls-mlops',
    title: 'MLOps & monitoring',
    blocks: [
      {
        type: 'list',
        items: [
          'SageMaker Pipelines orchestrate repeatable ML workflows (CI/CD for ML).',
          'Model Registry versions and approves models for deployment.',
          'Model Monitor detects data/quality drift in production and can trigger retraining.',
          'Automate retraining when drift or performance degradation is detected.',
        ],
      },
      {
        type: 'note',
        text: 'MLOps brings software-engineering discipline to ML: version data, code and models; automate training and deployment; and monitor continuously, because models decay as real-world data shifts.',
      },
    ],
  },
];
