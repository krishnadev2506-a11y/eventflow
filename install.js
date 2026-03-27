const { execSync } = require('child_process');
console.log("Starting node script install...");
try {
  execSync('npm install three @react-three/fiber @react-three/drei framer-motion gsap prisma @prisma/client next-auth stripe @stripe/stripe-js resend cloudinary lucide-react leaflet react-leaflet recharts', { stdio: 'inherit' });
  console.log("Base packages success!");
  execSync('npm install -D @types/three @types/leaflet', { stdio: 'inherit' });
  console.log("Dev packages success!");
} catch(e) { console.error("Error:", e); }
