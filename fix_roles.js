const fs = require('fs');

const files = [
  'src/app/api/admin/users/route.ts',
  'src/contexts/AuthContext.tsx',
  'src/lib/middleware/admin.ts',
  'src/lib/middleware/auth.ts',
  'src/middleware.ts'
];

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace `user.user_metadata?.role` with `user.app_metadata?.role`
  // Also handle `(user.user_metadata as any)?.role`
  content = content.replace(/user_metadata\?\.role/g, "app_metadata?.role");
  content = content.replace(/\(user\.user_metadata as any\)\?\.role/g, "(user.app_metadata as any)?.role");
  
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${file}`);
});
