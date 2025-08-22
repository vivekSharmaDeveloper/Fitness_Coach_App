# Google Cloud Vertex AI Setup Guide

Follow these steps to enable real AI recommendations using Google Vertex AI:

## Step 1: Create Google Cloud Project

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Click "Create Project" or select an existing project
3. Note your **Project ID** (you'll need this later)

## Step 2: Enable Vertex AI API

1. In Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Vertex AI API"
3. Click on it and press "Enable"

## Step 3: Set Up Authentication

### Option A: Application Default Credentials (Recommended for local development)

1. Install Google Cloud SDK:
   ```bash
   # Download and install from: https://cloud.google.com/sdk/docs/install
   ```

2. Run authentication:
   ```bash
   gcloud auth application-default login
   ```

### Option B: Service Account Key (Production)

1. Go to "IAM & Admin" > "Service Accounts"
2. Click "Create Service Account"
3. Give it a name like "fitness-app-vertex-ai"
4. Grant these roles:
   - "Vertex AI User"
   - "AI Platform Developer"
5. Create and download a JSON key file
6. Set environment variable:
   ```bash
   set GOOGLE_APPLICATION_CREDENTIALS=path\to\your\service-account-key.json
   ```

## Step 4: Configure Environment Variables

Update your `.env.local` file:

```env
# Replace with your actual Google Cloud Project ID
GOOGLE_CLOUD_PROJECT_ID=your-project-id-here
GOOGLE_CLOUD_LOCATION=us-central1
```

## Step 5: Test the Setup

1. Start your Next.js app:
   ```bash
   npm run dev
   ```

2. Go through the onboarding process
3. Click "Get AI Recommendations"
4. Check the console logs for Vertex AI success messages

## Troubleshooting

### Common Issues:

1. **Authentication Error**: Make sure you've run `gcloud auth application-default login`
2. **Project ID Error**: Double-check your project ID in `.env.local`
3. **API Not Enabled**: Ensure Vertex AI API is enabled in your project
4. **Permissions Error**: Make sure your account has Vertex AI permissions

### Cost Information:

- Gemini 1.5 Pro pricing: ~$0.00125 per 1K input tokens, ~$0.005 per 1K output tokens
- Each recommendation request: ~$0.01-0.02
- Much cheaper than OpenAI GPT-4!

## Supported Regions:

- `us-central1` (recommended)
- `us-east1`
- `europe-west1`
- `asia-southeast1`

Choose the region closest to your users and update `GOOGLE_CLOUD_LOCATION` accordingly.
