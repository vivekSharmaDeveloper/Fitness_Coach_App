import { NextResponse } from "next/server";
import { 
  sendWelcomeEmail, 
  sendForgotPasswordEmail, 
  sendPasswordResetConfirmationEmail,
  testEmailConnection 
} from "@/lib/email";

export async function POST(request: Request) {
  try {
    const { type, email, name } = await request.json();

    if (!email) {
      return NextResponse.json(
        { message: "Email is required" },
        { status: 400 }
      );
    }

    let result;

    switch (type) {
      case 'welcome':
        result = await sendWelcomeEmail(email, name || 'Test User');
        break;
      
      case 'forgot-password':
        result = await sendForgotPasswordEmail(email, name || 'Test User', 'test-token-123');
        break;
      
      case 'password-reset-confirmation':
        result = await sendPasswordResetConfirmationEmail(email, name || 'Test User');
        break;
      
      case 'connection-test':
        result = await testEmailConnection();
        break;
      
      default:
        return NextResponse.json(
          { message: "Invalid email type. Use: welcome, forgot-password, password-reset-confirmation, or connection-test" },
          { status: 400 }
        );
    }

    return NextResponse.json({
      message: `${type} email test completed successfully`,
      result
    });

  } catch (error) {
    console.error("Email test error:", error);
    return NextResponse.json(
      { 
        message: "Email test failed",
        error: error instanceof Error ? error.message : String(error)
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: "Email Test API",
    usage: {
      method: "POST",
      body: {
        type: "welcome | forgot-password | password-reset-confirmation | connection-test",
        email: "test@example.com",
        name: "Test User (optional)"
      }
    },
    examples: [
      {
        description: "Test welcome email",
        body: {
          type: "welcome",
          email: "user@example.com",
          name: "John Doe"
        }
      },
      {
        description: "Test SMTP connection",
        body: {
          type: "connection-test",
          email: "any@email.com"
        }
      }
    ]
  });
}
