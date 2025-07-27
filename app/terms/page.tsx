import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsPage() {
  return (
    <div className="container mx-auto py-8 max-w-4xl">
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-4xl font-bold">Terms of Service</h1>
          <p className="text-muted-foreground mt-2">
            Last updated: January 26, 2025
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>1. Acceptance of Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              By accessing and using Fitness Coach ("the Service"), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>2. Description of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              Fitness Coach is a web-based application that provides personalized fitness and wellness coaching, goal tracking, and health recommendations. The service includes features such as:
            </p>
            <ul>
              <li>Personal goal setting and tracking</li>
              <li>Fitness and wellness recommendations</li>
              <li>Progress monitoring and analytics</li>
              <li>Personalized coaching suggestions</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>3. User Accounts</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              To access certain features of the Service, you must register for an account. You are responsible for:
            </p>
            <ul>
              <li>Maintaining the confidentiality of your account credentials</li>
              <li>All activities that occur under your account</li>
              <li>Notifying us immediately of any unauthorized use of your account</li>
              <li>Providing accurate and complete information during registration</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>4. Health Disclaimer</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              <strong>Important:</strong> The information and recommendations provided by Fitness Coach are for educational and informational purposes only and should not be considered as medical advice. 
            </p>
            <p>
              You should always consult with a qualified healthcare professional before starting any fitness program, making dietary changes, or taking any actions based on the recommendations provided by our service.
            </p>
            <p>
              We are not responsible for any health issues or injuries that may result from following our recommendations.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>5. User Responsibilities</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              As a user of Fitness Coach, you agree to:
            </p>
            <ul>
              <li>Use the service only for lawful purposes</li>
              <li>Not share your account with others</li>
              <li>Provide accurate information about your health and fitness status</li>
              <li>Not attempt to reverse engineer or compromise the security of the service</li>
              <li>Respect the intellectual property rights of the service</li>
            </ul>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>6. Privacy and Data</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms of Service by reference.
            </p>
            <p>
              By using the service, you consent to the collection, use, and sharing of your information as described in our Privacy Policy.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>7. Limitation of Liability</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              In no event shall Fitness Coach, its owners, directors, employees, or agents be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>8. Service Availability</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              We strive to maintain the service availability, but we do not guarantee that the service will be available at all times. The service may be unavailable due to maintenance, updates, or other factors beyond our control.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>9. Modifications to Terms</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              We reserve the right to modify these Terms of Service at any time. We will notify users of any significant changes via email or through the service interface. Continued use of the service after such modifications constitutes acceptance of the updated terms.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>10. Termination</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              Either party may terminate this agreement at any time. Upon termination, your right to use the service will cease immediately. We reserve the right to suspend or terminate accounts that violate these terms.
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>11. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-gray dark:prose-invert max-w-none">
            <p>
              If you have any questions about these Terms of Service, please contact us at:
            </p>
            <p>
              Email: support@fitnesscoach.com<br />
              Address: [Your Company Address]
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
