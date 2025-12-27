/**
 * Setup script to create .env.local file
 * Run: node setup-env.js
 */

const fs = require('fs');
const path = require('path');

const envLocalContent = `# Server Port
PORT=3001

# API Base URL (Client-side - must start with NEXT_PUBLIC_)
NEXT_PUBLIC_API_URL=http://localhost:3000

# API Base URL (Server-side only)
API_URL=http://localhost:3000

# Environment
NODE_ENV=development
`;

const envExampleContent = `# Server Port
PORT=3001

# API Base URL (Client-side - must start with NEXT_PUBLIC_)
NEXT_PUBLIC_API_URL=http://localhost:3000

# API Base URL (Server-side only)
API_URL=http://localhost:3000

# Environment
NODE_ENV=development

# Example for production
# NEXT_PUBLIC_API_URL=https://api.yourdomain.com
# API_URL=https://api.yourdomain.com
# PORT=3001
`;

const envLocalPath = path.join(__dirname, '.env.local');
const envExamplePath = path.join(__dirname, '.env.example');

try {
  // Create .env.local if it doesn't exist
  if (!fs.existsSync(envLocalPath)) {
    fs.writeFileSync(envLocalPath, envLocalContent);
    console.log('✅ Created .env.local file');
  } else {
    console.log('⚠️  .env.local already exists, skipping...');
  }

  // Create .env.example if it doesn't exist
  if (!fs.existsSync(envExamplePath)) {
    fs.writeFileSync(envExamplePath, envExampleContent);
    console.log('✅ Created .env.example file');
  } else {
    console.log('⚠️  .env.example already exists, skipping...');
  }

  console.log('\n📝 Environment files are ready!');
  console.log('💡 Edit .env.local to configure your API URL and port.\n');
} catch (error) {
  console.error('❌ Error creating environment files:', error.message);
  process.exit(1);
}

