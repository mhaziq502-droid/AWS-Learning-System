// AIF-C01 — AI Practitioner. Original foundational AI/ML study notes.

export default [
  {
    id: 'aif-fundamentals',
    title: 'AI, ML & deep learning fundamentals',
    blocks: [
      {
        type: 'p',
        text: 'Artificial Intelligence is the broad field of making machines perform tasks that need human-like intelligence. Machine Learning is a subset where systems learn patterns from data rather than being explicitly programmed. Deep Learning is a subset of ML using multi-layer neural networks. Generative AI uses large foundation models to create new content.',
      },
      {
        type: 'diagram',
        code: `graph TD
  AI[Artificial Intelligence] --> ML[Machine Learning]
  ML --> DL[Deep Learning]
  DL --> GenAI[Generative AI\\n(foundation models)]`,
      },
      { type: 'h', text: 'Types of machine learning' },
      {
        type: 'table',
        head: ['Type', 'Learns from', 'Example'],
        rows: [
          ['Supervised', 'Labeled data', 'Spam detection, price prediction'],
          ['Unsupervised', 'Unlabeled data (finds structure)', 'Customer segmentation, anomaly detection'],
          ['Reinforcement', 'Rewards from actions', 'Robotics, game playing, recommendation tuning'],
        ],
      },
      {
        type: 'tip',
        text: '"Predict a category from past labeled examples" \u2192 supervised classification. "Group similar items with no labels" \u2192 unsupervised clustering.',
      },
    ],
  },
  {
    id: 'aif-genai',
    title: 'Generative AI concepts',
    blocks: [
      {
        type: 'p',
        text: 'Generative AI is powered by foundation models (FMs) \u2014 very large models pre-trained on broad data that can be adapted to many tasks. Large Language Models (LLMs) are text-focused FMs.',
      },
      {
        type: 'list',
        items: [
          'Tokens \u2014 chunks of text (words or sub-words) the model processes; cost and context limits are measured in tokens.',
          'Context window \u2014 how much text (in tokens) the model can consider at once.',
          'Embeddings \u2014 numeric vector representations of text/images used for search and similarity.',
          'Prompt \u2014 the input/instruction you give the model; prompt engineering shapes the output.',
          'Hallucination \u2014 when a model produces confident but incorrect content.',
        ],
      },
      { type: 'h', text: 'Adapting a foundation model' },
      {
        type: 'table',
        head: ['Technique', 'What it does', 'Effort'],
        rows: [
          ['Prompt engineering', 'Craft better inputs', 'Lowest'],
          ['RAG (Retrieval-Augmented Generation)', 'Inject your own data at query time', 'Low\u2013medium'],
          ['Fine-tuning', 'Further-train the model on your data', 'Higher'],
          ['Pre-training', 'Train a model from scratch', 'Highest / rarely needed'],
        ],
      },
      {
        type: 'tip',
        text: 'RAG is the usual answer for "ground the model in our private/company data without retraining." Fine-tuning changes the model\u2019s behavior/style on your examples.',
      },
    ],
  },
  {
    id: 'aif-aws-services',
    title: 'AWS AI/ML services',
    blocks: [
      {
        type: 'p',
        text: 'AWS offers three layers: pre-built AI services (just call an API), the ML platform (SageMaker), and generative-AI building blocks (Bedrock).',
      },
      {
        type: 'diagram',
        code: `graph TD
  L1["AI Services (API calls)\\nRekognition, Comprehend,\\nTranscribe, Polly, Textract"] 
  L2["ML Platform\\nAmazon SageMaker\\n(build, train, deploy)"]
  L3["Generative AI\\nAmazon Bedrock\\n(foundation models), Amazon Q"]`,
      },
      {
        type: 'table',
        head: ['Service', 'Does', 'Example'],
        rows: [
          ['Amazon Bedrock', 'Access foundation models via one API', 'Chatbots, summarization, image generation'],
          ['Amazon SageMaker', 'Build/train/deploy custom ML', 'Custom prediction model'],
          ['Amazon Rekognition', 'Image & video analysis', 'Detect objects, faces, moderation'],
          ['Amazon Comprehend', 'NLP / text analysis', 'Sentiment, entities, key phrases'],
          ['Amazon Transcribe / Polly', 'Speech\u2194text', 'Captions, voice responses'],
          ['Amazon Textract', 'Extract text/data from documents', 'Invoices, forms'],
          ['Amazon Q', 'Generative AI assistant', 'Business Q&A, developer help'],
        ],
      },
    ],
  },
  {
    id: 'aif-responsible',
    title: 'Responsible AI & security',
    blocks: [
      {
        type: 'p',
        text: 'Responsible AI means building systems that are fair, explainable, private, safe and governed. AWS provides tooling to help, but the organization owns responsible use.',
      },
      {
        type: 'list',
        items: [
          'Fairness \u2014 reduce harmful bias across groups.',
          'Explainability / transparency \u2014 understand why a model made a decision (e.g. SageMaker Clarify).',
          'Privacy & security \u2014 protect training and inference data; keep sensitive data controlled.',
          'Safety \u2014 Guardrails for Amazon Bedrock filter harmful content and block unwanted topics.',
          'Governance \u2014 document models, monitor drift, keep humans in the loop for high-stakes decisions.',
        ],
      },
      {
        type: 'warn',
        text: 'Generative models can hallucinate and can reflect bias in training data. For high-stakes use (medical, legal, financial), keep a human reviewer in the loop and apply guardrails.',
      },
    ],
  },
];
