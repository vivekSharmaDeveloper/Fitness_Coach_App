import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function PrivacyPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Privacy Policy</h1>
          <p className="text-muted-foreground mt-2">
            Last updated: 26 July, 2025
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Introduction</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              Welcome to the Fitness Coach Privacy Policy. Your privacy is critically important to us. This policy explains how we collect, use, and share information about you when you use our services.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Information We Collect</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              We collect information about you in a few different ways, including:
            </p>
            <ul>
              <li>Information you provide to us directly</li>
              <li>Information we collect automatically as you use our Service</li>
              <li>Information from third-party sources</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. How We Use Your Information</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              We use the information we collect to provide and improve our services, including to:
            </p>
            <ul>
              <li>Personalize your experience</li>
              <li>Provide customer support</li>
              <li>Research and analyze usage trends</li>
              <li>Communicate with you</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Sharing of Information</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              We do not sell or rent your personal information to third parties. However, we may share information about you as follows:
            </p>
            <ul>
              <li>With our affiliates or service providers</li>
              <li>When we believe in good faith that disclosure is necessary to protect our rights, your safety, or the safety of others</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. Data Security</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              We use commercially reasonable efforts to protect the information we collect from loss, theft, misuse, and unauthorized access, disclosure, alteration, and destruction.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Changes to This Policy</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              We may change this Privacy Policy from time to time. If we make changes, we will notify you by email or through the Service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Contact Us</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              If you have any questions or concerns about this Privacy Policy or the practices of this Site, please contact us at:
            </p>
            <p>
              Email: privacy@fitnesscoach.com<br />
              Address: [Your Company Address]
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
