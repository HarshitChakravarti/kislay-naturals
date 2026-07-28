const fs = require('fs');

let authContext = fs.readFileSync('src/contexts/AuthContext.tsx', 'utf8');
authContext = authContext.replace(/import \{ createContext, useContext, useState, useEffect, useCallback, ReactNode \} from 'react';/, "import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';\nimport { toast } from 'react-toastify';");
authContext = authContext.replace(/interface Toast \{[\s\S]*?\}\s*/, "");
authContext = authContext.replace(/  showToast: \(message: string, type: 'success' \| 'error'\) => void;\n/, "");
authContext = authContext.replace(/  const \[toasts, setToasts\] = useState<Toast\[\]>\(\[\]\);\n/, "");
authContext = authContext.replace(/  const showToast = useCallback\(\(message: string, type: 'success' \| 'error'\) => \{[\s\S]*?\}, \[\]\);\n/, "");
authContext = authContext.replace(/showToast\('Successfully logged out', 'success'\);/g, "toast.success('Successfully logged out');");
authContext = authContext.replace(/showToast\(err\.message \|\| 'Failed to logout', 'error'\);/g, "toast.error(err.message || 'Failed to logout');");
authContext = authContext.replace(/\[supabase, router, showToast, clearAuthData\]/g, "[supabase, router, clearAuthData]");
authContext = authContext.replace(/        showToast,\n/, "");
authContext = authContext.replace(/      \{toasts\.length > 0 && \([\s\S]*?\}\)\}\s*<\/div>\s*\)\}\s*/, "");

fs.writeFileSync('src/contexts/AuthContext.tsx', authContext, 'utf8');

['src/components/auth/LoginForm.tsx', 'src/components/auth/SignupForm.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/const \{ showToast \} = useAuth\(\);/g, "");
  content = content.replace(/const \{.*showToast.*\} = useAuth\(\);/g, "");
  // Actually they might destructure multiple things, let's just do a simpler replace.
  // Wait, what if they destructure `login` and `showToast`?
  fs.writeFileSync(file, content, 'utf8');
});
