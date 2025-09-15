const fs = require('fs');
const path = require('path');
const glob = require('glob');

const SCRIPT_TAG = '<script src="/dashboard-console-capture.js"></script>';
const CONSOLE_COMMENT = '<!-- Console capture script for dashboard debugging -->';

function injectConsoleCapture() {
  // Find all HTML files in the output directory
  const htmlFiles = glob.sync('.next/**/*.html', { ignore: '.next/cache/**/*' });
  
  if (htmlFiles.length === 0) {
    console.log('No HTML files found to inject console capture script');
    return;
  }
  
  let injectedCount = 0;
  
  htmlFiles.forEach(filePath => {
    try {
      let content = fs.readFileSync(filePath, 'utf8');
      
      // Skip if script is already injected
      if (content.includes('dashboard-console-capture.js')) {
        return;
      }
      
      // Inject script tag in head section
      if (content.includes('</head>')) {
        content = content.replace(
          '</head>',
          `  ${CONSOLE_COMMENT}\n  ${SCRIPT_TAG}\n</head>`
        );
        
        fs.writeFileSync(filePath, content);
        injectedCount++;
        console.log(`✓ Injected console capture script into: ${filePath}`);
      }
    } catch (error) {
      console.error(`Error processing ${filePath}:`, error.message);
    }
  });
  
  console.log(`\nConsole capture script injection complete!`);
  console.log(`Files processed: ${htmlFiles.length}`);
  console.log(`Files injected: ${injectedCount}`);
  
  if (injectedCount === 0) {
    console.log('\nNote: No files needed injection (script already present or no suitable injection points found)');
  }
}

// Run the injection
injectConsoleCapture();