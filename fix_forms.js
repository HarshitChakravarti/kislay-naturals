const fs = require('fs');

['src/components/auth/LoginForm.tsx', 'src/components/auth/SignupForm.tsx'].forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  
  if (!content.includes("from 'react-toastify'")) {
    content = "import { toast } from 'react-toastify';\n" + content;
  }
  
  content = content.replace(/showToast\('Successfully logged in', 'success'\);/g, "toast.success('Successfully logged in');");
  content = content.replace(/showToast\('Account created successfully!', 'success'\);/g, "toast.success('Account created successfully!');");
  
  fs.writeFileSync(file, content, 'utf8');
});
