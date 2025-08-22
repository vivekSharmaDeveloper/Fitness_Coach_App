import { ImageResponse } from 'next/og';
import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    const title = searchParams.get('title') || 'FitCoach - AI Fitness Coach';
    const description = searchParams.get('description') || 'Transform your health with AI-powered personal fitness coaching';
    
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#1e293b',
            backgroundImage: 'linear-gradient(45deg, #1e293b 0%, #334155 100%)',
          }}
        >
          {/* Logo/Icon */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '120px',
              height: '120px',
              backgroundColor: '#3b82f6',
              borderRadius: '60px',
              fontSize: '60px',
              marginBottom: '32px',
            }}
          >
            💪
          </div>
          
          {/* Title */}
          <div
            style={{
              fontSize: '60px',
              fontWeight: 'bold',
              color: 'white',
              textAlign: 'center',
              marginBottom: '24px',
              maxWidth: '1000px',
              lineHeight: '1.1',
            }}
          >
            {title}
          </div>
          
          {/* Description */}
          <div
            style={{
              fontSize: '32px',
              color: '#94a3b8',
              textAlign: 'center',
              maxWidth: '800px',
              lineHeight: '1.3',
            }}
          >
            {description}
          </div>
          
          {/* Bottom branding */}
          <div
            style={{
              position: 'absolute',
              bottom: '40px',
              right: '40px',
              display: 'flex',
              alignItems: 'center',
              fontSize: '24px',
              color: '#64748b',
            }}
          >
            fitcoach.app
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error('Error generating OG image:', error);
    return new Response('Failed to generate image', { status: 500 });
  }
}
