export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold mb-4">About Free Fall</h1>
        <p className="text-xl text-gray-600">
          Creating a safe space for emotional expression and connection
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
          <p className="text-gray-600">
            Free Fall aims to provide a supportive platform where individuals can freely express their thoughts and feelings without fear of judgment. We believe in the power of anonymous sharing to create meaningful connections and foster emotional well-being.
          </p>
        </div>

        <div className="card">
          <h2 className="text-2xl font-bold mb-4">Our Values</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Privacy and Anonymity</li>
            <li>• Empathy and Support</li>
            <li>• Inclusivity and Acceptance</li>
            <li>• Safe and Respectful Environment</li>
          </ul>
        </div>
      </div>

      <div className="card mb-12">
        <h2 className="text-2xl font-bold mb-4">How It Works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <div className="text-3xl mb-2">1</div>
            <h3 className="font-semibold mb-2">Share Anonymously</h3>
            <p className="text-gray-600">
              Post your thoughts and feelings without revealing your identity
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">2</div>
            <h3 className="font-semibold mb-2">Connect</h3>
            <p className="text-gray-600">
              Interact with others who understand and offer support
            </p>
          </div>
          <div>
            <div className="text-3xl mb-2">3</div>
            <h3 className="font-semibold mb-2">Grow Together</h3>
            <p className="text-gray-600">
              Build meaningful connections in a safe, supportive environment
            </p>
          </div>
        </div>
      </div>

      <div className="card">
        <h2 className="text-2xl font-bold mb-4">Community Guidelines</h2>
        <div className="space-y-4 text-gray-600">
          <p>
            To maintain a supportive environment, we ask all members to:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Be kind and respectful to others</li>
            <li>Respect everyone's privacy and anonymity</li>
            <li>Avoid harmful or inappropriate content</li>
            <li>Focus on constructive and positive interactions</li>
            <li>Report any concerning behavior</li>
          </ul>
        </div>
      </div>
    </div>
  )
} 